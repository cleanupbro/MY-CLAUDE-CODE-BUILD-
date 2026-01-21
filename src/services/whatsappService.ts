/**
 * WhatsApp Service
 * Sends notifications via Meta Business API (Cloud API)
 *
 * Phone Number ID: 92512258402625
 * Business Account ID: 880203244738731
 */

const WHATSAPP_PHONE_NUMBER_ID = '92512258402625';
const WHATSAPP_API_VERSION = 'v18.0';
const WHATSAPP_API_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

// System user token for WhatsApp Business API
const WHATSAPP_ACCESS_TOKEN = 'EAAZAo7ucsqF8BQixIpX6k9LMbI9vvoGrkmdI3vNtrbLhLRO9nt8xrsnxfgKkpGJ0mve8yIETClouZAsIdJ3WtpIIjHCrLDt6VgTEcCQU2nvdEynq9I9onZBOQeCrNp71ZAkySMnSjl1ISTxbx9JMUolXi2xgKafQ2sQAhTqIPOkncQjyHBfzmbvbxEzXS1IzAAZDZD';

// Business phone number to receive notifications
const BUSINESS_PHONE = '61406764585';

export interface WhatsAppResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Format phone number for WhatsApp (remove + and spaces)
 */
const formatPhoneNumber = (phone: string): string => {
  return phone.replace(/[^0-9]/g, '');
};

/**
 * Send a text message via WhatsApp
 */
export const sendWhatsAppMessage = async (
  to: string,
  text: string
): Promise<WhatsAppResponse> => {
  try {
    const formattedPhone = formatPhoneNumber(to);

    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: {
          body: text,
        },
      }),
    });

    const data = await response.json();

    if (response.ok && data.messages?.[0]?.id) {
      return { success: true, messageId: data.messages[0].id };
    } else {
      console.error('WhatsApp API error:', data);
      return {
        success: false,
        error: data.error?.message || 'Unknown error',
      };
    }
  } catch (error) {
    console.error('WhatsApp send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
};

/**
 * Send notification to business phone
 */
export const sendBusinessNotification = async (
  text: string
): Promise<WhatsAppResponse> => {
  return sendWhatsAppMessage(BUSINESS_PHONE, text);
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
}): Promise<WhatsAppResponse> => {
  const message = `
🏠 *NEW RESIDENTIAL QUOTE*

👤 *Customer:* ${data.fullName}
📱 *Phone:* ${data.phone}
📧 *Email:* ${data.email}
📍 *Suburb:* ${data.suburb}
🧹 *Service:* ${data.serviceType}
🛏️ *Bedrooms:* ${data.bedrooms} | 🚿 *Bathrooms:* ${data.bathrooms}
📅 *Date:* ${data.preferredDate || 'TBD'}
💰 *Est. Price:* $${data.priceEstimate || 'Quote needed'}

🔗 *Reference:* ${data.referenceId}
`.trim();

  return sendBusinessNotification(message);
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
}): Promise<WhatsAppResponse> => {
  const message = `
🏢 *NEW COMMERCIAL QUOTE*

🏛️ *Company:* ${data.companyName}
👤 *Contact:* ${data.contactPerson}
📱 *Phone:* ${data.phone}
📧 *Email:* ${data.email}
🏗️ *Facility:* ${data.facilityType || 'Not specified'}
📐 *Size:* ${data.squareMeters || 'TBD'} sqm
📆 *Frequency:* ${data.cleaningFrequency || 'TBD'}
💰 *Est. Price:* $${data.priceEstimate || 'Quote needed'}

🔗 *Reference:* ${data.referenceId}
`.trim();

  return sendBusinessNotification(message);
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
}): Promise<WhatsAppResponse> => {
  const message = `
🏨 *NEW AIRBNB QUOTE*

👤 *Host:* ${data.contactName}
📱 *Phone:* ${data.phone}
📧 *Email:* ${data.email}
🏠 *Property:* ${data.propertyType || 'Not specified'}
🛏️ *Bedrooms:* ${data.bedrooms || 'TBD'} | 🚿 *Bathrooms:* ${data.bathrooms || 'TBD'}
📆 *Frequency:* ${data.cleaningFrequency || 'TBD'}
📅 *Start Date:* ${data.preferredStartDate || 'TBD'}
💰 *Est. Price:* $${data.priceEstimate || 'Quote needed'}

🔗 *Reference:* ${data.referenceId}
`.trim();

  return sendBusinessNotification(message);
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
}): Promise<WhatsAppResponse> => {
  const message = `
👷 *NEW JOB APPLICATION*

👤 *Applicant:* ${data.fullName}
📱 *Phone:* ${data.phone}
📧 *Email:* ${data.email}
🔧 *Experience:* ${data.experience || 'Not specified'}
📅 *Available:* ${data.availability?.join(', ') || 'TBD'}
📍 *Suburbs:* ${data.serviceSuburbs || 'Not specified'}

🔗 *Reference:* ${data.referenceId}
`.trim();

  return sendBusinessNotification(message);
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
}): Promise<WhatsAppResponse> => {
  const msg = `
📩 *NEW CONTACT MESSAGE*

👤 *Name:* ${data.name}
📱 *Phone:* ${data.phone}
📧 *Email:* ${data.email}
📋 *Subject:* ${data.subject}

💬 *Message:*
${data.message}
`.trim();

  return sendBusinessNotification(msg);
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
}): Promise<WhatsAppResponse> => {
  const stars = '⭐'.repeat(data.rating);
  const message = `
📝 *NEW CLIENT FEEDBACK*

👤 *Client:* ${data.name}
📧 *Email:* ${data.email}
${data.bookingReference ? `🔗 *Booking:* ${data.bookingReference}` : ''}
📊 *Rating:* ${stars} (${data.rating}/5)
📋 *Type:* ${data.feedbackType || 'General'}

💬 *Feedback:*
${data.message}
`.trim();

  return sendBusinessNotification(message);
};

/**
 * Send a test message to verify integration
 */
export const sendTestMessage = async (): Promise<WhatsAppResponse> => {
  const message = `
🧪 *TEST MESSAGE*

✅ WhatsApp integration is working!
📅 *Time:* ${new Date().toISOString()}

_This is a test from Clean Up Bros portal._
`.trim();

  return sendBusinessNotification(message);
};

export default {
  sendWhatsAppMessage,
  sendBusinessNotification,
  sendResidentialQuoteNotification,
  sendCommercialQuoteNotification,
  sendAirbnbQuoteNotification,
  sendJobApplicationNotification,
  sendContactNotification,
  sendFeedbackNotification,
  sendTestMessage,
};
