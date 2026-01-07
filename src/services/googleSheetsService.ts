import { WEBHOOK_URLS } from '../constants';

export interface GoogleSheetsLogEntry {
  timestamp: string;
  formType: string;
  referenceId?: string;
  customerName: string;
  email: string;
  phone?: string;
  data: Record<string, any>;
  status: 'submitted' | 'confirmed' | 'failed';
}

/**
 * Logs a form submission to Google Sheets via n8n webhook
 * This serves as a backup logging system in case the primary flow fails
 */
export const logToGoogleSheets = async (entry: GoogleSheetsLogEntry): Promise<boolean> => {
  try {
    const response = await fetch(WEBHOOK_URLS.GOOGLE_SHEETS_LOG, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...entry,
        timestamp: entry.timestamp || new Date().toISOString(),
        appVersion: '1.0.0',
        source: 'cleanupbros-portal',
      }),
    });

    if (!response.ok) {
      console.error('Google Sheets logging failed:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error logging to Google Sheets:', error);
    // Don't throw - this is a backup system and shouldn't break the main flow
    return false;
  }
};

/**
 * Logs a residential quote submission
 */
export const logResidentialQuote = async (data: any, referenceId?: string) => {
  return logToGoogleSheets({
    timestamp: new Date().toISOString(),
    formType: 'Residential Cleaning',
    referenceId,
    customerName: data.fullName,
    email: data.email,
    phone: data.phone,
    data: {
      suburb: data.suburb,
      propertyType: data.propertyType,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      serviceType: data.serviceType,
      condition: data.condition,
      frequency: data.frequency,
      subscribedToOneYearPlan: data.subscribedToOneYearPlan,
      addOns: data.addOns?.join(', ') || '',
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      notes: data.notes,
      priceEstimate: data.priceEstimate,
    },
    status: 'submitted',
  });
};

/**
 * Logs a commercial quote submission
 */
export const logCommercialQuote = async (data: any, referenceId?: string) => {
  return logToGoogleSheets({
    timestamp: new Date().toISOString(),
    formType: 'Commercial Cleaning',
    referenceId,
    customerName: data.contactPerson,
    email: data.email,
    phone: data.phone,
    data: {
      companyName: data.companyName,
      facilityType: data.facilityType,
      squareMeters: data.squareMeters,
      cleaningFrequency: data.cleaningFrequency,
      complianceNeeds: data.complianceNeeds?.join(', ') || '',
      painPoints: data.painPoints,
      preferredStartDate: data.preferredStartDate,
      contractTerm: data.contractTerm,
    },
    status: 'submitted',
  });
};

/**
 * Logs an Airbnb quote submission
 */
export const logAirbnbQuote = async (data: any, referenceId?: string) => {
  return logToGoogleSheets({
    timestamp: new Date().toISOString(),
    formType: 'Airbnb Cleaning',
    referenceId,
    customerName: data.contactName,
    email: data.email,
    phone: data.phone,
    data: {
      listingUrl: data.listingUrl,
      propertyType: data.propertyType,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      turnoverRequirements: data.turnoverRequirements?.join(', ') || '',
      accessMethod: data.accessMethod,
      preferredTurnoverTime: data.preferredTurnoverTime,
      preferredStartDate: data.preferredStartDate,
      cleaningFrequency: data.cleaningFrequency,
    },
    status: 'submitted',
  });
};

/**
 * Logs a job application submission
 */
export const logJobApplication = async (data: any, referenceId?: string) => {
  return logToGoogleSheets({
    timestamp: new Date().toISOString(),
    formType: 'Job Application',
    referenceId,
    customerName: data.fullName,
    email: data.email,
    phone: data.phone,
    data: {
      hasWorkRights: data.hasWorkRights,
      experience: data.experience,
      hasOwnEquipment: data.hasOwnEquipment,
      availability: data.availability?.join(', ') || '',
      serviceSuburbs: data.serviceSuburbs,
      preferredStartDate: data.preferredStartDate,
      referenceName: data.referenceName,
      referenceContact: data.referenceContact,
      agreedToChecks: data.agreedToChecks,
      attachmentCount: data.attachments?.length || 0,
      photoCount: data.photos?.length || 0,
    },
    status: 'submitted',
  });
};

/**
 * Logs client feedback submission
 */
export const logClientFeedback = async (data: any, referenceId?: string) => {
  return logToGoogleSheets({
    timestamp: new Date().toISOString(),
    formType: 'Client Feedback',
    referenceId,
    customerName: data.fullName,
    email: data.email,
    data: {
      rating: data.rating,
      comments: data.comments,
    },
    status: 'submitted',
  });
};

/**
 * Logs a landing page lead
 */
export const logLandingLead = async (data: any, referenceId?: string) => {
  return logToGoogleSheets({
    timestamp: new Date().toISOString(),
    formType: 'Landing Lead',
    referenceId,
    customerName: 'Landing Lead',
    email: '',
    data: {
      suburb: data.suburb,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      serviceType: data.serviceType,
    },
    status: 'submitted',
  });
};

/**
 * Logs a gift card purchase
 */
export const logGiftCardPurchase = async (data: any, referenceId?: string) => {
  return logToGoogleSheets({
    timestamp: new Date().toISOString(),
    formType: 'Gift Card Purchase',
    referenceId,
    customerName: data.purchaserName || data.customerName,
    email: data.purchaserEmail || data.email,
    data: {
      code: data.code,
      amount: data.originalAmount || data.amount,
      bonusAmount: data.bonusAmount,
      totalValue: data.currentBalance || data.totalValue,
      isGift: data.type === 'digital',
      recipientName: data.recipientName,
      recipientEmail: data.recipientEmail,
      giftMessage: data.giftMessage,
      status: data.status,
    },
    status: 'submitted',
  });
};

/**
 * Logs a gift card redemption
 */
export const logGiftCardRedemption = async (data: any, referenceId?: string) => {
  return logToGoogleSheets({
    timestamp: new Date().toISOString(),
    formType: 'Gift Card Redemption',
    referenceId,
    customerName: data.customerName || 'Gift Card User',
    email: data.customerEmail || '',
    data: {
      code: data.code,
      originalBalance: data.originalBalance,
      amountRedeemed: data.amountRedeemed,
      remainingBalance: data.remainingBalance,
      bookingTotal: data.bookingTotal,
      serviceType: data.serviceType,
    },
    status: 'submitted',
  });
};
