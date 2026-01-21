/**
 * Gmail Service - Clean Up Bros
 * Handles email sending via N8N webhooks or direct Gmail API
 *
 * Created: January 22, 2026
 *
 * NOTE: For direct Gmail API integration, Google OAuth credentials are required:
 * - GOOGLE_CLIENT_ID: 413720620340-sjdjintjejfvc3uu6oo3g6usaldntj99.apps.googleusercontent.com
 * - GOOGLE_CLIENT_SECRET: (stored in .env.local)
 */

const N8N_BASE = 'https://nioctibinu.online';

// N8N Webhook endpoints for email operations
const EMAIL_WEBHOOKS = {
  BOOKING_CONFIRMATION: `${N8N_BASE}/webhook/email-booking-confirmation`,
  BOOKING_REMINDER: `${N8N_BASE}/webhook/email-booking-reminder`,
  INVOICE: `${N8N_BASE}/webhook/email-invoice`,
  WELCOME: `${N8N_BASE}/webhook/email-welcome`,
  REVIEW_REQUEST: `${N8N_BASE}/webhook/email-review-request`,
  GENERIC: `${N8N_BASE}/webhook/email-send`,
};

// Email template types
export type EmailTemplate =
  | 'booking_confirmation'
  | 'booking_reminder'
  | 'invoice'
  | 'welcome'
  | 'review_request'
  | 'generic';

export interface BookingEmailData {
  customerName: string;
  email: string;
  bookingDate: string;
  bookingTime: string;
  address: string;
  serviceType: string;
  price: number;
  referenceId: string;
  cleanerName?: string;
  specialInstructions?: string;
}

export interface ReminderEmailData {
  customerName: string;
  email: string;
  bookingDate: string;
  bookingTime: string;
  address: string;
  cleanerName?: string;
  cleanerPhone?: string;
}

export interface InvoiceEmailData {
  customerName: string;
  email: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  paymentLink?: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

export interface GenericEmailData {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
}

/**
 * Send a booking confirmation email
 */
export async function sendConfirmationEmail(
  to: string,
  bookingData: BookingEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(EMAIL_WEBHOOKS.BOOKING_CONFIRMATION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: 'booking_confirmation',
        recipient: to,
        data: {
          ...bookingData,
          businessName: 'Clean Up Bros',
          businessPhone: '+61 406 764 585',
          businessEmail: 'cleanupbros.au@gmail.com',
          websiteUrl: 'https://cleanupbros.com.au',
        },
        timestamp: new Date().toISOString(),
        source: 'cleanupbros-portal',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Email confirmation failed:', errorText);
      return { success: false, error: errorText };
    }

    const result = await response.json();
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send a booking reminder email (24h before service)
 */
export async function sendReminderEmail(
  to: string,
  reminderData: ReminderEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(EMAIL_WEBHOOKS.BOOKING_REMINDER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: 'booking_reminder',
        recipient: to,
        data: {
          ...reminderData,
          businessName: 'Clean Up Bros',
          businessPhone: '+61 406 764 585',
        },
        timestamp: new Date().toISOString(),
        source: 'cleanupbros-portal',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Reminder email failed:', errorText);
      return { success: false, error: errorText };
    }

    const result = await response.json();
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending reminder email:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send an invoice email
 */
export async function sendInvoiceEmail(
  to: string,
  invoiceData: InvoiceEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(EMAIL_WEBHOOKS.INVOICE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: 'invoice',
        recipient: to,
        data: {
          ...invoiceData,
          businessName: 'Clean Up Bros',
          businessABN: 'TBD', // Add actual ABN
          businessAddress: 'Liverpool, NSW 2170',
          businessPhone: '+61 406 764 585',
          businessEmail: 'cleanupbros.au@gmail.com',
        },
        timestamp: new Date().toISOString(),
        source: 'cleanupbros-portal',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Invoice email failed:', errorText);
      return { success: false, error: errorText };
    }

    const result = await response.json();
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send a welcome email to new customers
 */
export async function sendWelcomeEmail(
  to: string,
  customerName: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(EMAIL_WEBHOOKS.WELCOME, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: 'welcome',
        recipient: to,
        data: {
          customerName,
          businessName: 'Clean Up Bros',
          websiteUrl: 'https://cleanupbros.com.au',
          servicesUrl: 'https://cleanupbros.com.au/services',
        },
        timestamp: new Date().toISOString(),
        source: 'cleanupbros-portal',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Welcome email failed:', errorText);
      return { success: false, error: errorText };
    }

    const result = await response.json();
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send a review request email after service completion
 */
export async function sendReviewRequestEmail(
  to: string,
  customerName: string,
  serviceDate: string,
  serviceType: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(EMAIL_WEBHOOKS.REVIEW_REQUEST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: 'review_request',
        recipient: to,
        data: {
          customerName,
          serviceDate,
          serviceType,
          googleReviewUrl: 'https://g.page/r/CYourGoogleBusinessPageID/review',
          feedbackUrl: 'https://cleanupbros.com.au/client-feedback',
        },
        timestamp: new Date().toISOString(),
        source: 'cleanupbros-portal',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Review request email failed:', errorText);
      return { success: false, error: errorText };
    }

    const result = await response.json();
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending review request email:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Send a generic email (for custom messages)
 */
export async function sendGenericEmail(
  emailData: GenericEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(EMAIL_WEBHOOKS.GENERIC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: 'generic',
        recipient: emailData.to,
        subject: emailData.subject,
        body: emailData.body,
        replyTo: emailData.replyTo || 'cleanupbros.au@gmail.com',
        timestamp: new Date().toISOString(),
        source: 'cleanupbros-portal',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Generic email failed:', errorText);
      return { success: false, error: errorText };
    }

    const result = await response.json();
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending generic email:', error);
    return { success: false, error: String(error) };
  }
}

// ==================== EMAIL TEMPLATES (HTML) ====================

/**
 * Generate HTML for booking confirmation email
 * Used by N8N workflow to create professional emails
 */
export function generateBookingConfirmationHTML(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmed - Clean Up Bros</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0066CC 0%, #2997FF 100%); padding: 30px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Booking Confirmed!</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Reference: ${data.referenceId}</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 18px; color: #1D1D1F; margin: 0 0 20px 0;">Hi ${data.customerName},</p>
              <p style="font-size: 16px; color: #424245; margin: 0 0 30px 0; line-height: 1.6;">
                Great news! Your cleaning service has been confirmed. Here are the details:
              </p>

              <!-- Booking Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f7; border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 25px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #86868B; font-size: 14px;">Service</span><br>
                          <span style="color: #1D1D1F; font-size: 16px; font-weight: 500;">${data.serviceType}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #86868B; font-size: 14px;">Date & Time</span><br>
                          <span style="color: #1D1D1F; font-size: 16px; font-weight: 500;">${data.bookingDate} at ${data.bookingTime}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #86868B; font-size: 14px;">Location</span><br>
                          <span style="color: #1D1D1F; font-size: 16px; font-weight: 500;">${data.address}</span>
                        </td>
                      </tr>
                      ${data.cleanerName ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #86868B; font-size: 14px;">Your Cleaner</span><br>
                          <span style="color: #1D1D1F; font-size: 16px; font-weight: 500;">${data.cleanerName}</span>
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #86868B; font-size: 14px;">Total</span><br>
                          <span style="color: #30D158; font-size: 20px; font-weight: 600;">$${data.price.toFixed(2)}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${data.specialInstructions ? `
              <p style="font-size: 14px; color: #86868B; margin: 0 0 30px 0;">
                <strong>Special Instructions:</strong> ${data.specialInstructions}
              </p>
              ` : ''}

              <p style="font-size: 16px; color: #424245; margin: 0 0 10px 0; line-height: 1.6;">
                Need to make changes? Contact us at:
              </p>
              <p style="font-size: 16px; color: #0066CC; margin: 0 0 30px 0;">
                +61 406 764 585 | cleanupbros.au@gmail.com
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f5f5f7; padding: 25px 40px; text-align: center;">
              <p style="font-size: 14px; color: #86868B; margin: 0;">
                Clean Up Bros | Liverpool, NSW<br>
                <a href="https://cleanupbros.com.au" style="color: #0066CC; text-decoration: none;">cleanupbros.com.au</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export default {
  sendConfirmationEmail,
  sendReminderEmail,
  sendInvoiceEmail,
  sendWelcomeEmail,
  sendReviewRequestEmail,
  sendGenericEmail,
  generateBookingConfirmationHTML,
};
