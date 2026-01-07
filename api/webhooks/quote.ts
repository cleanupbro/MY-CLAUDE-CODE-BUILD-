/**
 * API Proxy for Quote Submissions
 * Handles Residential, Commercial, and Airbnb quotes
 *
 * This proxy:
 * 1. Rate limits submissions (5 per hour per IP)
 * 2. Validates and sanitizes input
 * 3. Forwards to N8N webhook with secret header
 * 4. Hides N8N webhook URLs from client
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Rate limiting store (in-memory for now, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = { maxRequests: 5, windowMs: 60 * 60 * 1000 }; // 5 per hour

// Webhook URLs - stored server-side, not exposed to client
const WEBHOOK_URLS: Record<string, string> = {
  residential: process.env.N8N_RESIDENTIAL_WEBHOOK || 'https://nioctibinu.online/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c',
  commercial: process.env.N8N_COMMERCIAL_WEBHOOK || 'https://nioctibinu.online/webhook/bb5fdb61-31d7-4001-9dd1-44ef7dc64d32',
  airbnb: process.env.N8N_AIRBNB_WEBHOOK || 'https://nioctibinu.online/webhook/5d3f6ff4-5f08-4ccf-9b78-03b62ae6b72f',
  landing: process.env.N8N_LANDING_WEBHOOK || 'https://nioctibinu.online/webhook/8fe0b2c9-3d5b-44f5-84ff-0d0ef896e1fa',
};

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] as string || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const key = `quote:${ip}`;
  const now = Date.now();

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return { allowed: true, remaining: RATE_LIMIT.maxRequests - 1 };
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  rateLimitStore.set(key, record);
  return { allowed: true, remaining: RATE_LIMIT.maxRequests - record.count };
}

function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .slice(0, 5000);
}

function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
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

function validateQuoteData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!data.fullName || data.fullName.length < 2) {
    errors.push('Full name is required');
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.phone || !/^(\+?61|0)[2-478](?:[ -]?[0-9]){8}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.push('Valid Australian phone number is required');
  }

  if (!data.suburb || data.suburb.length < 2) {
    errors.push('Suburb is required');
  }

  return { valid: errors.length === 0, errors };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  const origin = req.headers.origin || 'https://cleanupbros.com.au';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Rate limiting
    const ip = getClientIp(req);
    const { allowed, remaining } = checkRateLimit(ip);

    res.setHeader('X-RateLimit-Remaining', remaining.toString());

    if (!allowed) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Please try again later.',
      });
    }

    // Parse body
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    // Determine quote type
    const quoteType = body.quoteType || body.serviceType?.toLowerCase() || 'residential';
    const webhookUrl = WEBHOOK_URLS[quoteType] || WEBHOOK_URLS.residential;

    // Validate
    const validation = validateQuoteData(body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    // Sanitize
    const sanitizedData = sanitizeObject(body);

    // Add metadata
    sanitizedData._submittedAt = new Date().toISOString();
    sanitizedData._source = 'api-proxy';
    sanitizedData._clientIp = ip;

    // Forward to N8N
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.N8N_WEBHOOK_SECRET || '',
      },
      body: JSON.stringify(sanitizedData),
    });

    if (!webhookResponse.ok) {
      console.error('Webhook failed:', webhookResponse.status);
      return res.status(502).json({
        success: false,
        error: 'Failed to submit quote. Please try again.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Quote submitted successfully',
    });
  } catch (error) {
    console.error('Quote submission error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again.',
    });
  }
}
