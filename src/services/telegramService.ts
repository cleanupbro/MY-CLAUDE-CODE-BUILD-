/**
 * Telegram Service
 * Sends notifications to Clean Up Bros Telegram group
 *
 * Bot: @CLEANUPBROSBOT
 * Group ID: -1003155659527
 */

const TELEGRAM_BOT_TOKEN = '7851141818:AAE7KnPJUL5QW82OhaLN2aaE7Shpq1tQQbk';
const TELEGRAM_CHAT_ID = '-1003155659527';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export interface TelegramResponse {
  success: boolean;
  messageId?: number;
  error?: string;
}

/**
 * Send a text message to the Telegram group
 */
export const sendTelegramMessage = async (
  text: string,
  parseMode: 'HTML' | 'Markdown' = 'HTML'
): Promise<TelegramResponse> => {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: parseMode,
      }),
    });

    const data = await response.json();

    if (data.ok) {
      return { success: true, messageId: data.result?.message_id };
    } else {
      console.error('Telegram API error:', data);
      return { success: false, error: data.description || 'Unknown error' };
    }
  } catch (error) {
    console.error('Telegram send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
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
🏠 <b>NEW RESIDENTIAL QUOTE</b>

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

  return sendTelegramMessage(message);
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
🏢 <b>NEW COMMERCIAL QUOTE</b>

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

  return sendTelegramMessage(message);
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
🏨 <b>NEW AIRBNB QUOTE</b>

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

  return sendTelegramMessage(message);
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
👷 <b>NEW JOB APPLICATION</b>

👤 <b>Applicant:</b> ${data.fullName}
📱 <b>Phone:</b> ${data.phone}
📧 <b>Email:</b> ${data.email}
🔧 <b>Experience:</b> ${data.experience || 'Not specified'}
📅 <b>Available:</b> ${data.availability?.join(', ') || 'TBD'}
📍 <b>Suburbs:</b> ${data.serviceSuburbs || 'Not specified'}

🔗 <b>Reference:</b> <code>${data.referenceId}</code>
`.trim();

  return sendTelegramMessage(message);
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
📩 <b>NEW CONTACT MESSAGE</b>

👤 <b>Name:</b> ${data.name}
📱 <b>Phone:</b> ${data.phone}
📧 <b>Email:</b> ${data.email}
📋 <b>Subject:</b> ${data.subject}

💬 <b>Message:</b>
${data.message}
`.trim();

  return sendTelegramMessage(msg);
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
📝 <b>NEW CLIENT FEEDBACK</b>

👤 <b>Client:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
${data.bookingReference ? `🔗 <b>Booking:</b> ${data.bookingReference}` : ''}
📊 <b>Rating:</b> ${stars} (${data.rating}/5)
📋 <b>Type:</b> ${data.feedbackType || 'General'}

💬 <b>Feedback:</b>
${data.message}
`.trim();

  return sendTelegramMessage(message);
};

/**
 * Send a test message to verify integration
 */
export const sendTestMessage = async (): Promise<TelegramResponse> => {
  const message = `
🧪 <b>TEST MESSAGE</b>

✅ Telegram integration is working!
📅 <b>Time:</b> ${new Date().toISOString()}
🤖 <b>Bot:</b> @CLEANUPBROSBOT

<i>This is a test from Clean Up Bros portal.</i>
`.trim();

  return sendTelegramMessage(message);
};

export default {
  sendTelegramMessage,
  sendResidentialQuoteNotification,
  sendCommercialQuoteNotification,
  sendAirbnbQuoteNotification,
  sendJobApplicationNotification,
  sendContactNotification,
  sendFeedbackNotification,
  sendTestMessage,
};
