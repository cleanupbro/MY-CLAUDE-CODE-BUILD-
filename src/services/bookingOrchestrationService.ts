/**
 * Booking Orchestration Service - Clean Up Bros
 * 
 * This service ties together all the individual services to create
 * a complete end-to-end booking workflow:
 * 
 * 1. Quote Submitted → Save to DB → Notify Team → Send Customer Email
 * 2. Quote Approved → Create Calendar Event → Send Confirmation
 * 3. Booking Completed → Create Invoice → Request Review
 * 
 * Created: February 2, 2026
 */

import { saveSubmission, updateSubmissionStatus, updateSubmissionData } from './submissionService';
import { sendConfirmationEmail, sendReminderEmail, sendInvoiceEmail, sendReviewRequestEmail } from './gmailService';
import { createBookingEvent, updateBookingEvent, deleteBookingEvent } from './googleCalendarService';
import { createSquareInvoice, createPaymentLink, SquareInvoiceData } from './squareService';
import {
  sendTelegramMessage,
  sendResidentialQuoteNotification,
  sendCommercialQuoteNotification,
  sendAirbnbQuoteNotification,
  sendJobApplicationNotification,
} from './telegramService';
import { SubmissionStatus, SubmissionType, ServiceType, SubmissionData } from '../types';

// N8N webhook for centralized processing
const N8N_WEBHOOK_BASE = 'https://nioctibinu.online/webhook';

export interface BookingResult {
  success: boolean;
  referenceId?: string;
  error?: string;
  notifications?: {
    database: boolean;
    telegram: boolean;
    email: boolean;
    n8n: boolean;
  };
}

export interface ApprovalResult {
  success: boolean;
  calendarEventId?: string;
  emailSent?: boolean;
  error?: string;
}

export interface InvoiceResult {
  success: boolean;
  invoiceId?: string;
  invoiceUrl?: string;
  paymentLink?: string;
  error?: string;
}

/**
 * STEP 1: Process a new quote/booking submission
 * This is called when a customer submits a quote form
 */
export async function processNewSubmission(
  type: SubmissionType,
  data: SubmissionData
): Promise<BookingResult> {
  const notifications = {
    database: false,
    telegram: false,
    email: false,
    n8n: false,
  };

  try {
    // 1. Save to Supabase
    const referenceId = await saveSubmission({ type, data });
    notifications.database = true;
    console.log(`✅ Submission saved: ${referenceId}`);

    // 2. Send Telegram notification to team
    try {
      await sendTeamNotification(type, data, referenceId);
      notifications.telegram = true;
      console.log(`✅ Telegram notification sent`);
    } catch (err) {
      console.warn('⚠️ Telegram notification failed:', err);
    }

    // 3. Trigger N8N webhook for additional processing
    try {
      await triggerN8NWebhook(type, data, referenceId);
      notifications.n8n = true;
      console.log(`✅ N8N webhook triggered`);
    } catch (err) {
      console.warn('⚠️ N8N webhook failed:', err);
    }

    // 4. Send customer acknowledgment email (for quotes)
    try {
      if (isQuoteType(type) && hasEmail(data)) {
        await sendQuoteAcknowledgmentEmail(type, data, referenceId);
        notifications.email = true;
        console.log(`✅ Customer acknowledgment email sent`);
      }
    } catch (err) {
      console.warn('⚠️ Customer email failed:', err);
    }

    return {
      success: true,
      referenceId,
      notifications,
    };
  } catch (error) {
    console.error('❌ Submission processing failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      notifications,
    };
  }
}

/**
 * STEP 2: Approve a booking (admin action)
 * Creates calendar event & sends confirmation to customer
 */
export async function approveBooking(
  submissionId: string,
  bookingDetails: {
    scheduledDate: string;
    scheduledTime: string;
    assignedTeam?: string;
    finalPrice: number;
    notes?: string;
  },
  customerData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    serviceType: string;
  }
): Promise<ApprovalResult> {
  try {
    // 1. Update submission status to Approved
    await updateSubmissionStatus(submissionId, SubmissionStatus.Approved);
    console.log(`✅ Submission ${submissionId} approved`);

    // 2. Create Google Calendar event
    let calendarEventId: string | undefined;
    try {
      const eventResult = await createBookingEvent({
        referenceId: submissionId,
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        address: customerData.address,
        serviceType: customerData.serviceType,
        bookingDate: bookingDetails.scheduledDate,
        startTime: bookingDetails.scheduledTime,
        cleanerName: bookingDetails.assignedTeam,
        specialInstructions: bookingDetails.notes,
        price: bookingDetails.finalPrice,
      });
      calendarEventId = eventResult.eventId;
      console.log(`✅ Calendar event created: ${calendarEventId}`);
    } catch (err) {
      console.warn('⚠️ Calendar event creation failed:', err);
    }

    // 3. Send confirmation email to customer
    let emailSent = false;
    try {
      await sendConfirmationEmail(customerData.email, {
        customerName: customerData.name,
        email: customerData.email,
        bookingDate: bookingDetails.scheduledDate,
        bookingTime: bookingDetails.scheduledTime,
        address: customerData.address,
        serviceType: customerData.serviceType,
        price: bookingDetails.finalPrice,
        referenceId: submissionId,
        cleanerName: bookingDetails.assignedTeam,
        specialInstructions: bookingDetails.notes,
      });
      emailSent = true;
      console.log(`✅ Confirmation email sent to ${customerData.email}`);
    } catch (err) {
      console.warn('⚠️ Confirmation email failed:', err);
    }

    // 4. Notify team on Telegram
    try {
      await sendTelegramMessage(`
✅ <b>BOOKING APPROVED</b>

📅 <b>Date:</b> ${bookingDetails.scheduledDate} at ${bookingDetails.scheduledTime}
👤 <b>Customer:</b> ${customerData.name}
📍 <b>Address:</b> ${customerData.address}
🧹 <b>Service:</b> ${customerData.serviceType}
💰 <b>Price:</b> $${bookingDetails.finalPrice}
👷 <b>Team:</b> ${bookingDetails.assignedTeam || 'TBD'}
🔗 <b>Ref:</b> <code>${submissionId}</code>
      `.trim());
    } catch (err) {
      console.warn('⚠️ Telegram approval notification failed:', err);
    }

    return {
      success: true,
      calendarEventId,
      emailSent,
    };
  } catch (error) {
    console.error('❌ Booking approval failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * STEP 3: Mark booking as completed & create invoice
 */
export async function completeBooking(
  submissionId: string,
  invoiceDetails: {
    items: Array<{
      name: string;
      description?: string;
      quantity: number;
      amount: number;
    }>;
    dueDate?: string;
    notes?: string;
  },
  customerData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  }
): Promise<InvoiceResult> {
  try {
    // 1. Update submission status to Completed
    await updateSubmissionStatus(submissionId, SubmissionStatus.Completed);
    console.log(`✅ Submission ${submissionId} marked complete`);

    // 2. Create Square Invoice
    let invoiceId: string | undefined;
    let invoiceUrl: string | undefined;
    
    try {
      const totalAmount = invoiceDetails.items.reduce(
        (sum, item) => sum + (item.amount * item.quantity), 0
      );
      
      const invoiceResult = await createSquareInvoice({
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerPhone: customerData.phone,
        customerCompany: customerData.company,
        items: invoiceDetails.items,
        dueDate: invoiceDetails.dueDate,
        referenceId: submissionId,
        note: invoiceDetails.notes,
      });

      if (invoiceResult.success) {
        invoiceId = invoiceResult.invoiceId;
        invoiceUrl = invoiceResult.publicUrl || invoiceResult.invoiceUrl;
        console.log(`✅ Invoice created: ${invoiceId}`);
      }
    } catch (err) {
      console.warn('⚠️ Square invoice creation failed:', err);
    }

    // 3. Create payment link as backup
    let paymentLink: string | undefined;
    if (!invoiceUrl) {
      try {
        const totalAmount = invoiceDetails.items.reduce(
          (sum, item) => sum + (item.amount * item.quantity), 0
        );
        
        const paymentResult = await createPaymentLink({
          customerName: customerData.name,
          customerEmail: customerData.email,
          serviceType: invoiceDetails.items[0]?.name || 'Cleaning Service',
          amount: totalAmount,
          referenceId: submissionId,
          description: invoiceDetails.notes,
        });

        if (paymentResult.success) {
          paymentLink = paymentResult.paymentLink;
          console.log(`✅ Payment link created: ${paymentLink}`);
        }
      } catch (err) {
        console.warn('⚠️ Payment link creation failed:', err);
      }
    }

    // 4. Send invoice email to customer
    try {
      const totalAmount = invoiceDetails.items.reduce(
        (sum, item) => sum + (item.amount * item.quantity), 0
      );
      
      await sendInvoiceEmail(customerData.email, {
        customerName: customerData.name,
        email: customerData.email,
        invoiceNumber: invoiceId || submissionId,
        amount: totalAmount,
        dueDate: invoiceDetails.dueDate || getDefaultDueDate(),
        paymentLink: invoiceUrl || paymentLink,
        items: invoiceDetails.items.map(item => ({
          description: item.name,
          quantity: item.quantity,
          unitPrice: item.amount,
          total: item.amount * item.quantity,
        })),
      });
      console.log(`✅ Invoice email sent to ${customerData.email}`);
    } catch (err) {
      console.warn('⚠️ Invoice email failed:', err);
    }

    // 5. Notify team on Telegram
    try {
      const totalAmount = invoiceDetails.items.reduce(
        (sum, item) => sum + (item.amount * item.quantity), 0
      );
      
      await sendTelegramMessage(`
💰 <b>JOB COMPLETED & INVOICED</b>

👤 <b>Customer:</b> ${customerData.name}
📧 <b>Email:</b> ${customerData.email}
💵 <b>Total:</b> $${totalAmount}
🧾 <b>Invoice:</b> ${invoiceId || 'Payment link sent'}
🔗 <b>Ref:</b> <code>${submissionId}</code>

${invoiceUrl ? `<a href="${invoiceUrl}">View Invoice</a>` : ''}
      `.trim());
    } catch (err) {
      console.warn('⚠️ Telegram completion notification failed:', err);
    }

    return {
      success: true,
      invoiceId,
      invoiceUrl,
      paymentLink,
    };
  } catch (error) {
    console.error('❌ Booking completion failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Request a review from customer (post-completion)
 */
export async function requestReview(
  submissionId: string,
  customerData: {
    name: string;
    email: string;
    serviceType: string;
    completedDate: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await sendReviewRequestEmail(customerData.email, {
      customerName: customerData.name,
      serviceType: customerData.serviceType,
      completedDate: customerData.completedDate,
      googleReviewUrl: 'https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review',
      facebookUrl: 'https://facebook.com/cleanupbros/reviews',
    });
    
    console.log(`✅ Review request sent to ${customerData.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Review request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send 24h reminder before booking
 */
export async function sendBookingReminder(
  customerData: {
    name: string;
    email: string;
    phone: string;
    bookingDate: string;
    bookingTime: string;
    address: string;
    cleanerName?: string;
    cleanerPhone?: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await sendReminderEmail(customerData.email, {
      customerName: customerData.name,
      email: customerData.email,
      bookingDate: customerData.bookingDate,
      bookingTime: customerData.bookingTime,
      address: customerData.address,
      cleanerName: customerData.cleanerName,
      cleanerPhone: customerData.cleanerPhone,
    });
    
    console.log(`✅ Reminder sent to ${customerData.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Reminder failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============== HELPER FUNCTIONS ==============

function sendTeamNotification(
  type: SubmissionType,
  data: SubmissionData,
  referenceId: string
): Promise<any> {
  const d = data as any;
  
  switch (type) {
    case ServiceType.Residential:
      return sendResidentialQuoteNotification({
        fullName: d.fullName || d.name || 'Unknown',
        phone: d.phone || 'N/A',
        email: d.email || 'N/A',
        suburb: d.suburb || d.address || 'N/A',
        serviceType: d.serviceType || 'Residential',
        bedrooms: d.bedrooms || 0,
        bathrooms: d.bathrooms || 0,
        preferredDate: d.preferredDate,
        priceEstimate: d.estimatedPrice || d.price,
        referenceId,
      });
      
    case ServiceType.Commercial:
      return sendCommercialQuoteNotification({
        companyName: d.companyName || d.company || 'Unknown',
        contactPerson: d.contactPerson || d.fullName || d.name || 'Unknown',
        phone: d.phone || 'N/A',
        email: d.email || 'N/A',
        facilityType: d.facilityType,
        squareMeters: d.squareMeters || d.size,
        cleaningFrequency: d.frequency,
        priceEstimate: d.estimatedPrice || d.price,
        referenceId,
      });
      
    case ServiceType.Airbnb:
      return sendAirbnbQuoteNotification({
        contactName: d.contactName || d.fullName || d.name || 'Unknown',
        phone: d.phone || 'N/A',
        email: d.email || 'N/A',
        propertyType: d.propertyType,
        bedrooms: d.bedrooms?.toString(),
        bathrooms: d.bathrooms?.toString(),
        cleaningFrequency: d.frequency,
        preferredStartDate: d.startDate || d.preferredDate,
        priceEstimate: d.estimatedPrice || d.price,
        referenceId,
      });
      
    case ServiceType.Jobs:
      return sendJobApplicationNotification({
        fullName: d.fullName || d.name || 'Unknown',
        phone: d.phone || 'N/A',
        email: d.email || 'N/A',
        experience: d.experience,
        availability: d.availability,
        serviceSuburbs: d.suburbs,
        referenceId,
      });
      
    default:
      // Generic notification for other types
      return sendTelegramMessage(`
📩 <b>NEW SUBMISSION</b>

📋 <b>Type:</b> ${type}
👤 <b>Name:</b> ${d.fullName || d.name || d.contactName || 'Unknown'}
📱 <b>Phone:</b> ${d.phone || 'N/A'}
📧 <b>Email:</b> ${d.email || 'N/A'}
🔗 <b>Ref:</b> <code>${referenceId}</code>
      `.trim());
  }
}

async function triggerN8NWebhook(
  type: SubmissionType,
  data: SubmissionData,
  referenceId: string
): Promise<void> {
  const webhookUrl = getN8NWebhookUrl(type);
  
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type,
      data,
      referenceId,
      timestamp: new Date().toISOString(),
      source: 'cleanupbros-portal',
    }),
  });

  if (!response.ok) {
    throw new Error(`N8N webhook failed: ${response.statusText}`);
  }
}

function getN8NWebhookUrl(type: SubmissionType): string {
  const webhooks: Record<string, string> = {
    [ServiceType.Residential]: `${N8N_WEBHOOK_BASE}/residential-quote`,
    [ServiceType.Commercial]: `${N8N_WEBHOOK_BASE}/commercial-quote`,
    [ServiceType.Airbnb]: `${N8N_WEBHOOK_BASE}/airbnb-quote`,
    [ServiceType.Jobs]: `${N8N_WEBHOOK_BASE}/job-application`,
    'EndOfLease': `${N8N_WEBHOOK_BASE}/end-of-lease-quote`,
    'Client Feedback': `${N8N_WEBHOOK_BASE}/client-feedback`,
    'Landing Lead': `${N8N_WEBHOOK_BASE}/landing-lead`,
  };
  
  return webhooks[type] || `${N8N_WEBHOOK_BASE}/generic-submission`;
}

async function sendQuoteAcknowledgmentEmail(
  type: SubmissionType,
  data: SubmissionData,
  referenceId: string
): Promise<void> {
  const d = data as any;
  const email = d.email;
  const name = d.fullName || d.name || d.contactName || 'Customer';
  
  // Use the confirmation email with "quote received" context
  await sendConfirmationEmail(email, {
    customerName: name,
    email,
    bookingDate: 'Pending confirmation',
    bookingTime: 'We will contact you shortly',
    address: d.address || d.suburb || 'To be confirmed',
    serviceType: type,
    price: d.estimatedPrice || d.price || 0,
    referenceId,
    specialInstructions: 'Thank you for your quote request! Our team will review and get back to you within 24 hours.',
  });
}

function isQuoteType(type: SubmissionType): boolean {
  return [
    ServiceType.Residential,
    ServiceType.Commercial,
    ServiceType.Airbnb,
    'EndOfLease',
    'Landing Lead',
  ].includes(type as any);
}

function hasEmail(data: SubmissionData): boolean {
  return !!(data as any).email;
}

function estimateJobDuration(serviceType: string): number {
  const durations: Record<string, number> = {
    'Residential': 180, // 3 hours
    'End of Lease': 300, // 5 hours
    'Bond Clean': 300,
    'Airbnb': 120, // 2 hours
    'Commercial': 240, // 4 hours
    'Office': 120,
    'Deep Clean': 240,
  };
  
  for (const [key, duration] of Object.entries(durations)) {
    if (serviceType.toLowerCase().includes(key.toLowerCase())) {
      return duration;
    }
  }
  
  return 180; // Default 3 hours
}

function getServiceColorId(serviceType: string): string {
  // Google Calendar color IDs
  const colors: Record<string, string> = {
    'Residential': '2', // Green
    'End of Lease': '6', // Orange
    'Bond': '6',
    'Airbnb': '3', // Purple
    'Commercial': '1', // Blue
    'Office': '1',
  };
  
  for (const [key, colorId] of Object.entries(colors)) {
    if (serviceType.toLowerCase().includes(key.toLowerCase())) {
      return colorId;
    }
  }
  
  return '2'; // Default green
}

function getDefaultDueDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 14); // 14 days from now
  return date.toISOString().split('T')[0];
}

export default {
  processNewSubmission,
  approveBooking,
  completeBooking,
  requestReview,
  sendBookingReminder,
};
