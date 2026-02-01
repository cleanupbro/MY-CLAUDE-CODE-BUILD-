/**
 * Gmail Service - Clean Up Bros
 * Handles email sending via direct API (no N8N required)
 *
 * Updated: February 2, 2026
 * Now uses /api/send-email endpoint with Resend
 */

// API endpoint for email sending
const EMAIL_API = '/api/send-email';

// Email template types
export type EmailTemplate =
  | 'booking_confirmation'
  | 'booking_reminder'
  | 'invoice'
  | 'welcome'
  | 'review_request'
  | 'quote_received'
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
  items?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

export interface ReviewEmailData {
  customerName: string;
  serviceType: string;
  completedDate: string;
  googleReviewUrl: string;
  facebookUrl?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  skipped?: boolean;
  error?: string;
}

/**
 * Send an email using the direct API
 */
async function sendEmail(
  to: string,
  template: EmailTemplate,
  data: Record<string, any>
): Promise<EmailResult> {
  try {
    const response = await fetch(EMAIL_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, template, data }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Email API error:', result);
      return { success: false, error: result.error || 'Email send failed' };
    }

    return {
      success: true,
      messageId: result.messageId,
      skipped: result.skipped,
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Send booking confirmation email
 */
export async function sendConfirmationEmail(
  to: string,
  data: BookingEmailData
): Promise<EmailResult> {
  return sendEmail(to, 'booking_confirmation', data);
}

/**
 * Send booking reminder email (24h before)
 */
export async function sendReminderEmail(
  to: string,
  data: ReminderEmailData
): Promise<EmailResult> {
  return sendEmail(to, 'booking_reminder', data);
}

/**
 * Send invoice email
 */
export async function sendInvoiceEmail(
  to: string,
  data: InvoiceEmailData
): Promise<EmailResult> {
  return sendEmail(to, 'invoice', data);
}

/**
 * Send welcome email to new customers
 */
export async function sendWelcomeEmail(
  to: string,
  data: { customerName: string; email: string }
): Promise<EmailResult> {
  return sendEmail(to, 'welcome', data);
}

/**
 * Send review request email (post-service)
 */
export async function sendReviewRequestEmail(
  to: string,
  data: ReviewEmailData
): Promise<EmailResult> {
  return sendEmail(to, 'review_request', data);
}

/**
 * Send quote acknowledgment email
 */
export async function sendQuoteReceivedEmail(
  to: string,
  data: {
    customerName: string;
    serviceType: string;
    address?: string;
    suburb?: string;
    price?: number;
    referenceId: string;
  }
): Promise<EmailResult> {
  return sendEmail(to, 'quote_received', data);
}

/**
 * Send a generic email (for custom messages)
 */
export async function sendGenericEmail(
  to: string,
  subject: string,
  body: string
): Promise<EmailResult> {
  return sendEmail(to, 'generic', { subject, body });
}

export default {
  sendConfirmationEmail,
  sendReminderEmail,
  sendInvoiceEmail,
  sendWelcomeEmail,
  sendReviewRequestEmail,
  sendQuoteReceivedEmail,
  sendGenericEmail,
};
