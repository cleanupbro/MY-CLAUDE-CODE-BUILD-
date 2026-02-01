/**
 * Direct Email API - No N8N Required
 * Uses Resend for transactional emails
 * 
 * Setup: Add RESEND_API_KEY to Vercel environment variables
 * Get free API key at: https://resend.com (3000 emails/month free)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'Clean Up Bros <hello@cleanupbros.com.au>';

// Email templates
const templates = {
  booking_confirmation: (data: any) => ({
    subject: `Booking Confirmed - ${data.referenceId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #14b8a6, #f59e0b); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">✅ Booking Confirmed!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p>Hi <strong>${data.customerName}</strong>,</p>
          <p>Great news! Your cleaning service has been confirmed.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #14b8a6;">📋 Booking Details</h3>
            <p><strong>📅 Date:</strong> ${data.bookingDate}</p>
            <p><strong>🕐 Time:</strong> ${data.bookingTime}</p>
            <p><strong>📍 Address:</strong> ${data.address}</p>
            <p><strong>🧹 Service:</strong> ${data.serviceType}</p>
            <p><strong>💰 Price:</strong> $${data.price}</p>
            <p><strong>🔗 Reference:</strong> ${data.referenceId}</p>
            ${data.cleanerName ? `<p><strong>👷 Team:</strong> ${data.cleanerName}</p>` : ''}
            ${data.specialInstructions ? `<p><strong>📝 Notes:</strong> ${data.specialInstructions}</p>` : ''}
          </div>
          
          <p>If you need to make any changes, please contact us at:</p>
          <p>📞 <a href="tel:0415429117">0415 429 117</a></p>
          <p>📧 <a href="mailto:hello@cleanupbros.com.au">hello@cleanupbros.com.au</a></p>
          
          <p style="margin-top: 30px;">Thank you for choosing Clean Up Bros!</p>
          <p><strong>The Clean Up Bros Team</strong></p>
        </div>
        <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0;">Clean Up Bros - Professional Cleaning Services</p>
          <p style="margin: 5px 0; font-size: 12px;">Western Sydney | Liverpool | Cabramatta | Casula</p>
        </div>
      </div>
    `,
  }),

  booking_reminder: (data: any) => ({
    subject: `Reminder: Cleaning Tomorrow - ${data.bookingDate}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #14b8a6, #f59e0b); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">⏰ Reminder: Cleaning Tomorrow!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p>Hi <strong>${data.customerName}</strong>,</p>
          <p>This is a friendly reminder that your cleaning service is scheduled for <strong>tomorrow</strong>.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #14b8a6;">📋 Your Appointment</h3>
            <p><strong>📅 Date:</strong> ${data.bookingDate}</p>
            <p><strong>🕐 Time:</strong> ${data.bookingTime}</p>
            <p><strong>📍 Address:</strong> ${data.address}</p>
            ${data.cleanerName ? `<p><strong>👷 Your cleaner:</strong> ${data.cleanerName}</p>` : ''}
            ${data.cleanerPhone ? `<p><strong>📱 Cleaner contact:</strong> ${data.cleanerPhone}</p>` : ''}
          </div>
          
          <p><strong>Please ensure:</strong></p>
          <ul>
            <li>Someone is available to let our team in</li>
            <li>Valuable items are secured</li>
            <li>Pets are safely contained if applicable</li>
          </ul>
          
          <p>Need to reschedule? Contact us ASAP:</p>
          <p>📞 <a href="tel:0415429117">0415 429 117</a></p>
          
          <p style="margin-top: 30px;">See you tomorrow!</p>
          <p><strong>The Clean Up Bros Team</strong></p>
        </div>
      </div>
    `,
  }),

  invoice: (data: any) => ({
    subject: `Invoice #${data.invoiceNumber} - Clean Up Bros`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #14b8a6, #f59e0b); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">💰 Invoice</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p>Hi <strong>${data.customerName}</strong>,</p>
          <p>Thank you for using Clean Up Bros! Here's your invoice:</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #14b8a6;">Invoice #${data.invoiceNumber}</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
              <thead>
                <tr style="border-bottom: 2px solid #e5e7eb;">
                  <th style="text-align: left; padding: 10px 0;">Description</th>
                  <th style="text-align: right; padding: 10px 0;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${data.items?.map((item: any) => `
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0;">${item.description}</td>
                    <td style="text-align: right; padding: 10px 0;">$${item.total}</td>
                  </tr>
                `).join('') || `
                  <tr style="border-bottom: 1px solid #e5e7eb;">
                    <td style="padding: 10px 0;">Cleaning Service</td>
                    <td style="text-align: right; padding: 10px 0;">$${data.amount}</td>
                  </tr>
                `}
              </tbody>
              <tfoot>
                <tr>
                  <td style="padding: 15px 0; font-weight: bold; font-size: 18px;">Total</td>
                  <td style="text-align: right; padding: 15px 0; font-weight: bold; font-size: 18px; color: #14b8a6;">$${data.amount}</td>
                </tr>
              </tfoot>
            </table>
            
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
          </div>
          
          ${data.paymentLink ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.paymentLink}" style="background: #14b8a6; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Pay Now</a>
            </div>
          ` : `
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Bank Transfer:</strong></p>
              <p style="margin: 5px 0;">BSB: 067873 | Account: 21358726</p>
              <p style="margin: 5px 0;">Name: Hafsah Nuzhat</p>
              <p style="margin: 5px 0;">Reference: ${data.invoiceNumber}</p>
            </div>
          `}
          
          <p>Questions about this invoice? Contact us:</p>
          <p>📞 <a href="tel:0415429117">0415 429 117</a></p>
          
          <p style="margin-top: 30px;">Thank you for your business!</p>
          <p><strong>The Clean Up Bros Team</strong></p>
        </div>
      </div>
    `,
  }),

  review_request: (data: any) => ({
    subject: `How did we do? - Clean Up Bros`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #14b8a6, #f59e0b); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">⭐ How Did We Do?</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p>Hi <strong>${data.customerName}</strong>,</p>
          <p>Thank you for choosing Clean Up Bros for your ${data.serviceType} on ${data.completedDate}!</p>
          <p>We'd love to hear about your experience. Your feedback helps us improve and helps others find reliable cleaning services.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.googleReviewUrl}" style="background: #14b8a6; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 10px;">⭐ Leave a Google Review</a>
            <br><br>
            <a href="${data.facebookUrl}" style="background: #1877f2; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 10px;">📘 Review on Facebook</a>
          </div>
          
          <p>Not satisfied? Please let us know directly so we can make it right:</p>
          <p>📞 <a href="tel:0415429117">0415 429 117</a></p>
          <p>📧 <a href="mailto:hello@cleanupbros.com.au">hello@cleanupbros.com.au</a></p>
          
          <p style="margin-top: 30px;">Thank you for your support!</p>
          <p><strong>The Clean Up Bros Team</strong></p>
        </div>
      </div>
    `,
  }),

  quote_received: (data: any) => ({
    subject: `Quote Request Received - ${data.referenceId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #14b8a6, #f59e0b); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">📩 Quote Request Received!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p>Hi <strong>${data.customerName}</strong>,</p>
          <p>Thank you for your quote request! We've received your details and will get back to you within <strong>24 hours</strong>.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #14b8a6;">📋 Your Request</h3>
            <p><strong>🧹 Service:</strong> ${data.serviceType}</p>
            <p><strong>📍 Location:</strong> ${data.address || data.suburb || 'To be confirmed'}</p>
            ${data.price ? `<p><strong>💰 Estimated Price:</strong> $${data.price}</p>` : ''}
            <p><strong>🔗 Reference:</strong> ${data.referenceId}</p>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <ol>
            <li>Our team reviews your request</li>
            <li>We'll call or email you to confirm details</li>
            <li>Schedule your cleaning at a time that works for you</li>
          </ol>
          
          <p>Need faster response? Call us directly:</p>
          <p>📞 <a href="tel:0415429117">0415 429 117</a></p>
          
          <p style="margin-top: 30px;">Talk soon!</p>
          <p><strong>The Clean Up Bros Team</strong></p>
        </div>
      </div>
    `,
  }),
};

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

  // Check if Resend is configured
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured - email skipped');
    return res.status(200).json({ 
      success: true, 
      skipped: true,
      message: 'Email service not configured' 
    });
  }

  try {
    const { to, template, data } = req.body;

    if (!to || !template) {
      return res.status(400).json({ error: 'Missing required fields: to, template' });
    }

    // Get template function
    const templateFn = templates[template as keyof typeof templates];
    if (!templateFn) {
      return res.status(400).json({ error: `Unknown template: ${template}` });
    }

    // Generate email content
    const { subject, html } = templateFn(data);

    // Send via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', result);
      return res.status(response.status).json({ error: result.message || 'Email send failed' });
    }

    return res.status(200).json({ 
      success: true, 
      messageId: result.id 
    });

  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}
