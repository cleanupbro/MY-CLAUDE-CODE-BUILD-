/**
 * Secure Notification API - Clean Up Bros
 * Handles Telegram notifications server-side (token hidden from frontend)
 * 
 * Created: February 2, 2026
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// SECRETS - Only on server, never exposed to browser
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7851141818:AAE7KnPJUL5QW82OhaLN2aaE7Shpq1tQQbk';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-1003155659527';
const API_SECRET = process.env.INTERNAL_API_SECRET || 'cub-internal-2026';

// Rate limiting
const notifyRateLimit = new Map<string, { count: number; resetTime: number }>();
const MAX_NOTIFICATIONS = 50; // per hour
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = notifyRateLimit.get(ip);
  
  if (!record || now > record.resetTime) {
    notifyRateLimit.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }
  
  if (record.count >= MAX_NOTIFICATIONS) {
    return false;
  }
  
  record.count++;
  return true;
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] as string || 'unknown';
}

// Validate request is from our own frontend
function validateRequest(req: VercelRequest): boolean {
  const origin = req.headers['origin'] as string || '';
  const referer = req.headers['referer'] as string || '';
  const secret = req.headers['x-api-secret'] as string || '';
  
  // Check internal secret (for server-to-server calls)
  if (secret === API_SECRET) return true;
  
  // Check origin
  const allowedOrigins = [
    'https://cleanupbros.com.au',
    'https://www.cleanupbros.com.au',
    'http://localhost:3000',
    'http://localhost:5173',
  ];
  
  return allowedOrigins.some(allowed => 
    origin.startsWith(allowed) || referer.startsWith(allowed)
  );
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://cleanupbros.com.au');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Security checks
  if (!validateRequest(req)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  try {
    const { type, message, data } = req.body;

    if (!type || !message) {
      return res.status(400).json({ error: 'Missing type or message' });
    }

    // Format message based on type
    let formattedMessage = message;
    
    // Add type header if not already present
    if (!message.includes('<b>')) {
      const typeEmoji: Record<string, string> = {
        residential: '🏠',
        commercial: '🏢',
        airbnb: '🏨',
        job: '👷',
        feedback: '⭐',
        contact: '📩',
        system: '🔔',
      };
      const emoji = typeEmoji[type] || '📋';
      formattedMessage = `${emoji} <b>${type.toUpperCase()}</b>\n\n${message}`;
    }

    // Send to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: formattedMessage,
          parse_mode: 'HTML',
        }),
      }
    );

    const result = await telegramResponse.json();

    if (!telegramResponse.ok) {
      console.error('Telegram API error:', result);
      return res.status(500).json({ error: 'Notification failed' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Notify error:', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}
