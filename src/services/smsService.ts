/**
 * SMS Service - Clean Up Bros
 * Sends SMS notifications via Twilio
 * 
 * Admin Phone: 0415 429 117
 */

// Vercel API route for SMS (safer than exposing Twilio creds in frontend)
const SMS_API_URL = '/api/send-sms';

// Admin phone number for notifications
const ADMIN_PHONE = '+61415429117';

export interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send SMS via Vercel API route
 */
export const sendSMS = async (
  to: string,
  message: string
): Promise<SMSResult> => {
  try {
    // Use toAdmin flag to send to admin phone
    const isAdminNumber = to === ADMIN_PHONE;
    
    const response = await fetch(SMS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: isAdminNumber ? undefined : to,
        toAdmin: isAdminNumber,
        message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `SMS API failed: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('SMS send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Send SMS notification to admin for new leads
 */
export const notifyAdminNewLead = async (data: {
  type: string;
  name: string;
  phone: string;
  suburb?: string;
  price?: number;
  referenceId: string;
}): Promise<SMSResult> => {
  const message = `🧹 NEW ${data.type.toUpperCase()} LEAD!
${data.name}
📱 ${data.phone}
${data.suburb ? `📍 ${data.suburb}` : ''}
${data.price ? `💰 $${data.price}` : ''}
Ref: ${data.referenceId}`;

  return sendSMS(ADMIN_PHONE, message);
};

/**
 * Send SMS notification for residential quote
 */
export const sendResidentialLeadSMS = async (data: {
  name: string;
  phone: string;
  suburb: string;
  bedrooms: number;
  bathrooms: number;
  serviceType: string;
  price?: number;
  referenceId: string;
}): Promise<SMSResult> => {
  const message = `🏠 RESIDENTIAL LEAD
${data.name}
📱 ${data.phone}
📍 ${data.suburb}
🛏️ ${data.bedrooms}BR/${data.bathrooms}BA
🧹 ${data.serviceType}
${data.price ? `💰 $${data.price}` : ''}
Ref: ${data.referenceId}`;

  return sendSMS(ADMIN_PHONE, message);
};

/**
 * Send SMS notification for commercial quote
 */
export const sendCommercialLeadSMS = async (data: {
  company: string;
  contact: string;
  phone: string;
  price?: number;
  referenceId: string;
}): Promise<SMSResult> => {
  const message = `🏢 COMMERCIAL LEAD
${data.company}
👤 ${data.contact}
📱 ${data.phone}
${data.price ? `💰 $${data.price}` : ''}
Ref: ${data.referenceId}`;

  return sendSMS(ADMIN_PHONE, message);
};

/**
 * Send SMS notification for Airbnb quote
 */
export const sendAirbnbLeadSMS = async (data: {
  name: string;
  phone: string;
  bedrooms?: string;
  price?: number;
  referenceId: string;
}): Promise<SMSResult> => {
  const message = `🏨 AIRBNB LEAD
${data.name}
📱 ${data.phone}
${data.bedrooms ? `🛏️ ${data.bedrooms} beds` : ''}
${data.price ? `💰 $${data.price}` : ''}
Ref: ${data.referenceId}`;

  return sendSMS(ADMIN_PHONE, message);
};

/**
 * Send SMS notification for job application
 */
export const sendJobApplicationSMS = async (data: {
  name: string;
  phone: string;
  experience?: string;
  referenceId: string;
}): Promise<SMSResult> => {
  const message = `👷 JOB APPLICATION
${data.name}
📱 ${data.phone}
${data.experience ? `🔧 ${data.experience}` : ''}
Ref: ${data.referenceId}`;

  return sendSMS(ADMIN_PHONE, message);
};

/**
 * Send SMS notification for landing page lead
 */
export const sendLandingLeadSMS = async (data: {
  phone: string;
  suburb?: string;
  serviceType?: string;
  price?: number;
  referenceId: string;
}): Promise<SMSResult> => {
  const message = `🎯 HOT LANDING LEAD!
📱 ${data.phone}
${data.suburb ? `📍 ${data.suburb}` : ''}
${data.serviceType ? `🧹 ${data.serviceType}` : ''}
${data.price ? `💰 $${data.price}` : ''}
Ref: ${data.referenceId}
⚡ Call back ASAP!`;

  return sendSMS(ADMIN_PHONE, message);
};

export default {
  sendSMS,
  notifyAdminNewLead,
  sendResidentialLeadSMS,
  sendCommercialLeadSMS,
  sendAirbnbLeadSMS,
  sendJobApplicationSMS,
  sendLandingLeadSMS,
};
