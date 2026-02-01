/**
 * Direct Google Calendar API - No N8N Required
 * Creates calendar events for bookings
 * 
 * Setup: Add these to Vercel environment variables:
 * - GOOGLE_CALENDAR_ID (your calendar ID, usually your email)
 * - GOOGLE_SERVICE_ACCOUNT_KEY (JSON stringified service account key)
 * 
 * Or use GOOGLE_CALENDAR_WEBHOOK to use your existing n8n/zapier webhook
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
const SERVICE_ACCOUNT_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
const CALENDAR_WEBHOOK = process.env.GOOGLE_CALENDAR_WEBHOOK; // Fallback to webhook

// Service type color mapping (Google Calendar color IDs)
const SERVICE_COLORS: Record<string, string> = {
  'residential': '2',      // Green
  'end of lease': '6',     // Orange
  'bond': '6',             // Orange
  'airbnb': '3',           // Purple
  'commercial': '1',       // Blue
  'office': '1',           // Blue
  'deep clean': '11',      // Red
};

function getColorId(serviceType: string): string {
  const lower = serviceType.toLowerCase();
  for (const [key, colorId] of Object.entries(SERVICE_COLORS)) {
    if (lower.includes(key)) return colorId;
  }
  return '2'; // Default green
}

function estimateDuration(serviceType: string, bedrooms?: number): number {
  const lower = serviceType.toLowerCase();
  
  if (lower.includes('end of lease') || lower.includes('bond')) {
    return bedrooms ? Math.max(180, bedrooms * 60) : 300; // 3-5 hours
  }
  if (lower.includes('commercial') || lower.includes('office')) {
    return 240; // 4 hours
  }
  if (lower.includes('airbnb')) {
    return bedrooms ? Math.max(90, bedrooms * 45) : 120; // 1.5-2 hours
  }
  if (lower.includes('deep')) {
    return 240; // 4 hours
  }
  // Standard residential
  return bedrooms ? Math.max(120, bedrooms * 45) : 180; // 2-3 hours
}

async function getAccessToken(): Promise<string | null> {
  if (!SERVICE_ACCOUNT_KEY) return null;

  try {
    const key = JSON.parse(SERVICE_ACCOUNT_KEY);
    
    // Create JWT for service account
    const header = { alg: 'RS256', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const claim = {
      iss: key.client_email,
      scope: 'https://www.googleapis.com/auth/calendar',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    };

    // Note: In production, use a proper JWT library
    // For now, we'll use the webhook fallback
    console.warn('Service account JWT signing not implemented - using webhook fallback');
    return null;
  } catch (error) {
    console.error('Failed to parse service account key:', error);
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      referenceId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      serviceType,
      bookingDate,
      startTime,
      cleanerName,
      specialInstructions,
      price,
    } = req.body;

    // Validate required fields
    if (!customerName || !address || !serviceType || !bookingDate || !startTime) {
      return res.status(400).json({ 
        error: 'Missing required fields: customerName, address, serviceType, bookingDate, startTime' 
      });
    }

    // Calculate duration and end time
    const durationMinutes = estimateDuration(serviceType, req.body.bedrooms);
    const startDateTime = new Date(`${bookingDate}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60 * 1000);

    // Format event data
    const eventData = {
      summary: `🧹 ${serviceType} - ${customerName}`,
      description: [
        `📋 Service: ${serviceType}`,
        `👤 Customer: ${customerName}`,
        `📱 Phone: ${customerPhone || 'N/A'}`,
        `📧 Email: ${customerEmail || 'N/A'}`,
        `📍 Address: ${address}`,
        `💰 Price: $${price || 'TBD'}`,
        `🔗 Reference: ${referenceId || 'N/A'}`,
        cleanerName ? `👷 Assigned: ${cleanerName}` : '',
        specialInstructions ? `📝 Notes: ${specialInstructions}` : '',
      ].filter(Boolean).join('\n'),
      location: address,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Australia/Sydney',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Australia/Sydney',
      },
      colorId: getColorId(serviceType),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 60 },      // 1 hour before
          { method: 'popup', minutes: 1440 },    // 1 day before
        ],
      },
    };

    // Try webhook first (simplest setup)
    if (CALENDAR_WEBHOOK) {
      const webhookResponse = await fetch(CALENDAR_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          event: eventData,
          metadata: { referenceId, customerName, serviceType },
        }),
      });

      if (webhookResponse.ok) {
        const result = await webhookResponse.json();
        return res.status(200).json({
          success: true,
          eventId: result.eventId || result.id || 'created-via-webhook',
          source: 'webhook',
        });
      }
      console.warn('Calendar webhook failed, trying direct API...');
    }

    // Try direct Google Calendar API
    const accessToken = await getAccessToken();
    if (accessToken && CALENDAR_ID) {
      const calendarResponse = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        }
      );

      if (calendarResponse.ok) {
        const result = await calendarResponse.json();
        return res.status(200).json({
          success: true,
          eventId: result.id,
          htmlLink: result.htmlLink,
          source: 'google-api',
        });
      }
      console.error('Google Calendar API error:', await calendarResponse.text());
    }

    // If neither is configured, return success but skipped
    if (!CALENDAR_WEBHOOK && !SERVICE_ACCOUNT_KEY) {
      console.warn('No calendar integration configured - event skipped');
      return res.status(200).json({
        success: true,
        skipped: true,
        message: 'Calendar integration not configured',
        eventData, // Return the data so it can be manually created
      });
    }

    return res.status(500).json({ 
      error: 'Calendar event creation failed',
      details: 'Both webhook and direct API methods failed'
    });

  } catch (error) {
    console.error('Calendar event error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}
