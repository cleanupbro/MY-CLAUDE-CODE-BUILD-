/**
 * API Proxy for Job Applications
 *
 * This proxy:
 * 1. Rate limits submissions (3 per day per IP)
 * 2. Validates and sanitizes input
 * 3. Forwards to N8N webhook
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = { maxRequests: 3, windowMs: 24 * 60 * 60 * 1000 }; // 3 per day

const WEBHOOK_URL = process.env.N8N_JOBS_WEBHOOK || 'https://nioctibinu.online/webhook/67f764f2-adff-481e-aa49-fd3de1feecde';

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] as string || 'unknown';
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const key = `job:${ip}`;
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
    .slice(0, 10000);
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

function validateJobApplication(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.fullName || data.fullName.length < 2) {
    errors.push('Full name is required');
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.phone || !/^(\+?61|0)[2-478](?:[ -]?[0-9]){8}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.push('Valid Australian phone number is required');
  }

  return { valid: errors.length === 0, errors };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  const origin = req.headers.origin || 'https://cleanupbros.com.au';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const ip = getClientIp(req);
    const { allowed, remaining } = checkRateLimit(ip);

    res.setHeader('X-RateLimit-Remaining', remaining.toString());

    if (!allowed) {
      return res.status(429).json({
        success: false,
        error: 'You have reached the daily application limit. Please try again tomorrow.',
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    const validation = validateJobApplication(body);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    const sanitizedData = sanitizeObject(body);
    sanitizedData._submittedAt = new Date().toISOString();
    sanitizedData._source = 'api-proxy';

    const webhookResponse = await fetch(WEBHOOK_URL, {
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
        error: 'Failed to submit application. Please try again.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    console.error('Job application error:', error);
    return res.status(500).json({
      success: false,
      error: 'An error occurred. Please try again.',
    });
  }
}
