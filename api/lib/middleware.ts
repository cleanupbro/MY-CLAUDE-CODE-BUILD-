/**
 * API Middleware - Rate limiting, bot detection, and security utilities
 * Clean Up Bros - February 2026
 */

// Bot detection patterns - block these user agents
const BOT_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /scrape/i, /curl/i, /wget/i,
  /python-requests/i, /axios/i, /node-fetch/i, /postman/i,
  /scrapy/i, /selenium/i, /puppeteer/i, /playwright/i, /headless/i,
];

// Block list for IPs (add manually blocked IPs here)
const BLOCKED_IPS = new Set<string>();

// Simple in-memory rate limiter (for development)
// In production, use Upstash Redis for distributed rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  quote: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
  'job-application': { maxRequests: 3, windowMs: 24 * 60 * 60 * 1000 }, // 3 per day
  feedback: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 per hour
  'payment-link': { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
  default: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 per minute
};

/**
 * Check rate limit for a given IP and endpoint
 */
export function checkRateLimit(
  ip: string,
  endpoint: string
): { allowed: boolean; remaining: number; resetIn: number } {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS.default;
  const key = `${ip}:${endpoint}`;
  const now = Date.now();

  const record = rateLimitStore.get(key);

  // No record or expired window - create new
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
    };
  }

  // Check if limit exceeded
  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: record.resetTime - now,
    };
  }

  // Increment count
  record.count++;
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetIn: record.resetTime - now,
  };
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/**
 * Validate request origin (CORS check)
 */
export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://cleanupbros.com.au',
    'https://www.cleanupbros.com.au',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  if (!origin) return true; // Same-origin requests don't have origin header
  return allowedOrigins.includes(origin);
}

/**
 * Create CORS headers for response
 */
export function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('origin') || 'https://cleanupbros.com.au';

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * Handle OPTIONS preflight requests
 */
export function handlePreflight(request: Request): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

/**
 * Create error response with proper headers
 */
export function errorResponse(
  message: string,
  status: number,
  request: Request
): Response {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(request),
      },
    }
  );
}

/**
 * Create success response with proper headers
 */
export function successResponse(
  data: any,
  request: Request,
  status: number = 200
): Response {
  return new Response(
    JSON.stringify({ success: true, ...data }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(request),
      },
    }
  );
}

/**
 * Check if user agent looks like a bot/scraper
 */
export function isBot(request: Request): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  if (!userAgent) return true; // No user agent = suspicious
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

/**
 * Check if IP is blocked
 */
export function isBlockedIp(ip: string): boolean {
  return BLOCKED_IPS.has(ip);
}

/**
 * Block an IP address
 */
export function blockIp(ip: string): void {
  BLOCKED_IPS.add(ip);
}

/**
 * Full security check - returns error response if blocked, null if allowed
 */
export function securityCheck(request: Request): Response | null {
  const ip = getClientIp(request);
  
  // Check blocked IPs
  if (isBlockedIp(ip)) {
    return errorResponse('Access denied', 403, request);
  }
  
  // Check for bots (except for certain endpoints)
  const url = new URL(request.url);
  const allowBots = url.pathname.includes('/sitemap') || url.pathname.includes('/robots');
  if (!allowBots && isBot(request)) {
    blockIp(ip);
    return errorResponse('Access denied', 403, request);
  }
  
  // Check origin
  if (request.method !== 'GET' && !validateOrigin(request)) {
    return errorResponse('Invalid origin', 403, request);
  }
  
  return null; // All checks passed
}

/**
 * Sanitize string input - remove potential XSS
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 10000); // Limit length
}

/**
 * Sanitize object - recursively sanitize all string values
 */
export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
