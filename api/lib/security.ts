/**
 * Security Middleware - Clean Up Bros
 * Protects against scraping, bots, and unauthorized access
 * 
 * Created: February 2, 2026
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Rate limit store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number; blocked: boolean }>();

// Known bot user agents to block
const BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /scrape/i, /curl/i, /wget/i,
  /python-requests/i, /axios/i, /node-fetch/i, /postman/i,
  /insomnia/i, /httpie/i, /scrapy/i, /selenium/i, /puppeteer/i,
  /playwright/i, /headless/i, /phantom/i, /nightmare/i,
];

// Suspicious patterns in requests
const SUSPICIOUS_PATTERNS = [
  /\.env/i, /\.git/i, /wp-admin/i, /phpmy/i, /admin\.php/i,
  /shell/i, /eval\(/i, /base64/i, /union.*select/i, /<script/i,
];

// Allowed origins (add your domains)
const ALLOWED_ORIGINS = [
  'https://cleanupbros.com.au',
  'https://www.cleanupbros.com.au',
  'http://localhost:3000',
  'http://localhost:5173',
];

interface SecurityConfig {
  maxRequests?: number;      // Max requests per window
  windowMs?: number;         // Time window in ms
  blockDuration?: number;    // How long to block suspicious IPs
  requireOrigin?: boolean;   // Require valid origin header
  allowBots?: boolean;       // Allow known bots
}

const DEFAULT_CONFIG: SecurityConfig = {
  maxRequests: 30,           // 30 requests
  windowMs: 60 * 1000,       // per minute
  blockDuration: 15 * 60 * 1000, // 15 min block
  requireOrigin: true,
  allowBots: false,
};

/**
 * Get client IP from request
 */
export function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] as string || 'unknown';
}

/**
 * Check if user agent looks like a bot
 */
export function isBot(userAgent: string | undefined): boolean {
  if (!userAgent) return true; // No user agent = suspicious
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

/**
 * Check if request contains suspicious patterns
 */
export function isSuspiciousRequest(req: VercelRequest): boolean {
  const url = req.url || '';
  const body = JSON.stringify(req.body || {});
  const combined = url + body;
  
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(combined));
}

/**
 * Check if origin is allowed
 */
export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed));
}

/**
 * Rate limiting check
 */
export function checkRateLimit(
  ip: string, 
  config: SecurityConfig = DEFAULT_CONFIG
): { allowed: boolean; remaining: number; blocked: boolean } {
  const key = `rate:${ip}`;
  const now = Date.now();
  
  const record = rateLimitStore.get(key);
  
  // Check if IP is blocked
  if (record?.blocked && record.resetTime > now) {
    return { allowed: false, remaining: 0, blocked: true };
  }
  
  // Reset if window expired
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { 
      count: 1, 
      resetTime: now + (config.windowMs || 60000),
      blocked: false 
    });
    return { allowed: true, remaining: (config.maxRequests || 30) - 1, blocked: false };
  }
  
  // Check if over limit
  if (record.count >= (config.maxRequests || 30)) {
    // Block the IP
    rateLimitStore.set(key, {
      ...record,
      blocked: true,
      resetTime: now + (config.blockDuration || 900000)
    });
    return { allowed: false, remaining: 0, blocked: true };
  }
  
  // Increment counter
  record.count++;
  rateLimitStore.set(key, record);
  
  return { 
    allowed: true, 
    remaining: (config.maxRequests || 30) - record.count,
    blocked: false 
  };
}

/**
 * Block an IP address
 */
export function blockIp(ip: string, durationMs: number = 3600000): void {
  const key = `rate:${ip}`;
  rateLimitStore.set(key, {
    count: 999,
    resetTime: Date.now() + durationMs,
    blocked: true
  });
}

/**
 * Main security middleware
 * Returns null if request is allowed, or error response if blocked
 */
export function securityCheck(
  req: VercelRequest,
  config: SecurityConfig = DEFAULT_CONFIG
): { blocked: boolean; reason?: string; status?: number } {
  const ip = getClientIp(req);
  const userAgent = req.headers['user-agent'];
  const origin = req.headers['origin'] as string;
  const referer = req.headers['referer'] as string;
  
  // 1. Check for bots
  if (!config.allowBots && isBot(userAgent)) {
    blockIp(ip, 3600000); // Block for 1 hour
    return { blocked: true, reason: 'Bot detected', status: 403 };
  }
  
  // 2. Check for suspicious patterns
  if (isSuspiciousRequest(req)) {
    blockIp(ip, 86400000); // Block for 24 hours
    return { blocked: true, reason: 'Suspicious request', status: 403 };
  }
  
  // 3. Check origin for API requests
  if (config.requireOrigin && req.method !== 'GET') {
    if (!isAllowedOrigin(origin) && !isAllowedOrigin(referer)) {
      return { blocked: true, reason: 'Invalid origin', status: 403 };
    }
  }
  
  // 4. Rate limiting
  const rateCheck = checkRateLimit(ip, config);
  if (!rateCheck.allowed) {
    return { 
      blocked: true, 
      reason: rateCheck.blocked ? 'IP blocked' : 'Rate limit exceeded', 
      status: 429 
    };
  }
  
  return { blocked: false };
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(res: VercelResponse): void {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';");
  
  // Permissions Policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

/**
 * Wrapper to protect an API endpoint
 */
export function withSecurity(
  handler: (req: VercelRequest, res: VercelResponse) => Promise<void> | void,
  config: SecurityConfig = DEFAULT_CONFIG
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    // Apply security headers
    applySecurityHeaders(res);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGINS[0]);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Security check
    const check = securityCheck(req, config);
    if (check.blocked) {
      console.warn(`[SECURITY] Blocked request from ${getClientIp(req)}: ${check.reason}`);
      return res.status(check.status || 403).json({ 
        error: 'Access denied',
        // Don't reveal the actual reason to attackers
      });
    }
    
    // Run the handler
    return handler(req, res);
  };
}

export default {
  securityCheck,
  checkRateLimit,
  blockIp,
  isBot,
  isSuspiciousRequest,
  getClientIp,
  applySecurityHeaders,
  withSecurity,
};
