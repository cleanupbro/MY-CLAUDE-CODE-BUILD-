/**
 * Telegram Service - Clean Up Bros
 * Sends notifications via secure API (token never exposed to browser)
 *
 * Updated: February 2, 2026
 * Security: Token moved to server-side API
 */

// Use API endpoint - token is hidden server-side
const NOTIFY_API = '/api/notify';

export interface TelegramResponse {
  success: boolean;
  error?: string;
}

/**
 * Send a notification via secure API
 */
const sendNotification = async (
  type: string,
  message: string,
  data?: Record<string, any>
): Promise<TelegramResponse> => {
  try {
    const response = await fetch(NOTIFY_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, message, data }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { success: false, error: error.error || 'Notification failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Notification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
};

/**
 * Send a text message
 */
export const sendTelegramMessage = async (
  text: string,
  parseMode: 'HTML' | 'Markdown' = 'HTML'
): Promise<TelegramResponse> => {
  return sendNotification('system', text);
};

/**
 * Send a residential quote notification
 */
export const sendResidentialQuoteNotification = async (data: {
  fullName: string;
  phone: string;
  email: string;
  suburb: string;
  serviceType: string;
  bedrooms: number;
  bathrooms: number;
  preferredDate?: string;
  priceEstimate?: number;
  referenceId: string;
}): Promise<TelegramResponse> => {
  const message = `
<b>NEW RESIDENTIAL QUOTE</b>

👤 <b>Customer:</b> ${data.fullName}
📱 <b>Phone:</b> ${data.phone}
📧 <b>Email:</b> ${data.email}
📍 <b>Suburb:</b> ${data.suburb}
🧹 <b>Service:</b> ${data.serviceType}
🛏️ <b>Bedrooms:</b> ${data.bedrooms} | 🚿 <b>Bathrooms:</b> ${data.bathrooms}
📅 <b>Date:</b> ${data.preferredDate || 'TBD'}
💰 <b>Est. Price:</b> $${data.priceEstimate || 'Quote needed'}

🔗 <b>Reference:</b> <code>${data.referenceId}</code>
`.trim();

  return sendNotification('residential', message, data);
};

/**
 * Send a commercial quote notification
 */
export const sendCommercialQuoteNotification = async (data: {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  facilityType?: string;
  squareMeters?: string;
  cleaningFrequency?: string;
  priceEstimate?: number;
  referenceId: string;
}): Promise<TelegramResponse> => {
  const message = `
<b>NEW COMMERCIAL QUOTE</b>

🏛️ <b>Company:</b> ${data.companyName}
👤 <b>Contact:</b> ${data.contactPerson}
📱 <b>Phone:</b> ${data.phone}
📧 <b>Email:</b> ${data.email}
🏗️ <b>Facility:</b> ${data.facilityType || 'Not specified'}
📐 <b>Size:</b> ${data.squareMeters || 'TBD'} sqm
📆 <b>Frequency:</b> ${data.cleaningFrequency || 'TBD'}
💰 <b>Est. Price:</b> $${data.priceEstimate || 'Quote needed'}

🔗 <b>Reference:</b> <code>${data.referenceId}</code>
`.trim();

  return sendNotification('commercial', message, data);
};

/**
 * Send an Airbnb quote notification
 */
export const sendAirbnbQuoteNotification = async (data: {
  contactName: string;
  phone: string;
  email: string;
  propertyType?: string;
  bedrooms?: string;
  bathrooms?: string;
  cleaningFrequency?: string;
  preferredStartDate?: string;
  priceEstimate?: number;
  referenceId: string;
}): Promise<TelegramResponse> => {
  const message = `
<b>NEW AIRBNB QUOTE</b>

👤 <b>Host:</b> ${data.contactName}
📱 <b>Phone:</b> ${data.phone}
📧 <b>Email:</b> ${data.email}
🏠 <b>Property:</b> ${data.propertyType || 'Not specified'}
🛏️ <b>Bedrooms:</b> ${data.bedrooms || 'TBD'} | 🚿 <b>Bathrooms:</b> ${data.bathrooms || 'TBD'}
📆 <b>Frequency:</b> ${data.cleaningFrequency || 'TBD'}
📅 <b>Start Date:</b> ${data.preferredStartDate || 'TBD'}
💰 <b>Est. Price:</b> $${data.priceEstimate || 'Quote needed'}

🔗 <b>Reference:</b> <code>${data.referenceId}</code>
`.trim();

  return sendNotification('airbnb', message, data);
};

/**
 * Send a job application notification
 */
export const sendJobApplicationNotification = async (data: {
  fullName: string;
  phone: string;
  email: string;
  experience?: string;
  availability?: string[];
  serviceSuburbs?: string;
  referenceId: string;
}): Promise<TelegramResponse> => {
  const message = `
<b>NEW JOB APPLICATION</b>

👤 <b>Applicant:</b> ${data.fullName}
📱 <b>Phone:</b> ${data.phone}
📧 <b>Email:</b> ${data.email}
🔧 <b>Experience:</b> ${data.experience || 'Not specified'}
📅 <b>Available:</b> ${data.availability?.join(', ') || 'TBD'}
📍 <b>Suburbs:</b> ${data.serviceSuburbs || 'Not specified'}

🔗 <b>Reference:</b> <code>${data.referenceId}</code>
`.trim();

  return sendNotification('job', message, data);
};

/**
 * Send a contact form notification
 */
export const sendContactNotification = async (data: {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}): Promise<TelegramResponse> => {
  const msg = `
<b>NEW CONTACT MESSAGE</b>

👤 <b>Name:</b> ${data.name}
📱 <b>Phone:</b> ${data.phone}
📧 <b>Email:</b> ${data.email}
📋 <b>Subject:</b> ${data.subject}

💬 <b>Message:</b>
${data.message}
`.trim();

  return sendNotification('contact', msg, data);
};

/**
 * Send a client feedback notification
 */
export const sendFeedbackNotification = async (data: {
  name: string;
  email: string;
  rating: number;
  feedbackType?: string;
  message: string;
  bookingReference?: string;
}): Promise<TelegramResponse> => {
  const stars = '⭐'.repeat(data.rating);
  const message = `
<b>NEW CLIENT FEEDBACK</b>

👤 <b>Client:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
${data.bookingReference ? `🔗 <b>Booking:</b> ${data.bookingReference}` : ''}
📊 <b>Rating:</b> ${stars} (${data.rating}/5)
📋 <b>Type:</b> ${data.feedbackType || 'General'}

💬 <b>Feedback:</b>
${data.message}
`.trim();

  return sendNotification('feedback', message, data);
};

export default {
  sendTelegramMessage,
  sendResidentialQuoteNotification,
  sendCommercialQuoteNotification,
  sendAirbnbQuoteNotification,
  sendJobApplicationNotification,
  sendContactNotification,
  sendFeedbackNotification,
};
