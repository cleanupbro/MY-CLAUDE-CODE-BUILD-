/**
 * Vercel Serverless Function: Send SMS via Twilio
 * POST /api/send-sms
 * 
 * Body: { to: string, message: string }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Twilio credentials (from Vercel environment variables)
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Admin phone number
const ADMIN_PHONE = '+61415429117';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for Twilio configuration
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.error('Twilio credentials not configured');
    return res.status(500).json({ error: 'SMS service not configured' });
  }

  try {
    const { to, message, toAdmin } = req.body;

    // Determine recipient
    const recipient = toAdmin ? ADMIN_PHONE : to;

    if (!recipient || !message) {
      return res.status(400).json({ error: 'Missing required fields: to, message' });
    }

    // Format phone number (ensure + prefix)
    const formattedTo = recipient.startsWith('+') ? recipient : `+${recipient}`;

    // Send via Twilio REST API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    
    const authHeader = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    const response = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: formattedTo,
        From: TWILIO_PHONE_NUMBER,
        Body: message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Twilio error:', result);
      return res.status(500).json({ 
        error: 'Failed to send SMS',
        details: result.message || result.error_message,
      });
    }

    return res.status(200).json({
      success: true,
      messageId: result.sid,
      to: formattedTo,
    });

  } catch (error) {
    console.error('SMS send error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
