/**
 * Analytics & Event Tracking
 * Centralized analytics for Google Analytics 4
 */

/**
 * Check if Google Analytics is loaded
 */
const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Track page view
 * Called automatically by GA4, but can be triggered manually for SPA navigation
 */
export const trackPageView = (pagePath: string, pageTitle: string) => {
  if (!isGALoaded()) return;

  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

/**
 * Track quote request
 */
export const trackQuoteRequest = (serviceType: string, estimatedValue?: number) => {
  if (!isGALoaded()) return;

  window.gtag('event', 'generate_lead', {
    event_category: 'Lead Generation',
    event_label: serviceType,
    value: estimatedValue || 0,
    currency: 'AUD',
  });

  // Also track as custom event
  window.gtag('event', 'quote_request', {
    service_type: serviceType,
    estimated_value: estimatedValue,
  });
};

/**
 * Track Clean Up Card purchase
 */
export const trackCardPurchase = (amount: number) => {
  if (!isGALoaded()) return;

  const discountedAmount = amount * 0.85; // 15% discount

  window.gtag('event', 'purchase', {
    event_category: 'Clean Up Card',
    value: discountedAmount,
    currency: 'AUD',
    items: [
      {
        item_name: 'Clean Up Card',
        item_category: 'Prepaid Credit',
        price: discountedAmount,
        quantity: 1,
      },
    ],
  });
};

/**
 * Track form step completion
 */
export const trackFormStep = (formType: string, stepNumber: number, stepName: string) => {
  if (!isGALoaded()) return;

  window.gtag('event', 'form_step_complete', {
    form_type: formType,
    step_number: stepNumber,
    step_name: stepName,
  });
};

/**
 * Track form abandonment
 */
export const trackFormAbandon = (formType: string, stepNumber: number) => {
  if (!isGALoaded()) return;

  window.gtag('event', 'form_abandon', {
    form_type: formType,
    last_step: stepNumber,
  });
};

/**
 * Track referral link copy
 */
export const trackReferralCopy = (referralCode: string) => {
  if (!isGALoaded()) return;

  window.gtag('event', 'referral_copied', {
    referral_code: referralCode,
  });
};

/**
 * Track live chat start
 */
export const trackChatStarted = () => {
  if (!isGALoaded()) return;

  window.gtag('event', 'chat_started', {
    event_category: 'Engagement',
  });
};

/**
 * Track file upload
 */
export const trackFileUpload = (fileType: string, fileSize: number) => {
  if (!isGALoaded()) return;

  window.gtag('event', 'file_upload', {
    file_type: fileType,
    file_size: Math.round(fileSize / 1024), // KB
  });
};

/**
 * Track error events
 */
export const trackError = (errorType: string, errorMessage: string) => {
  if (!isGALoaded()) return;

  window.gtag('event', 'error', {
    error_type: errorType,
    error_message: errorMessage,
  });
};

/**
 * Track custom event
 */
export const trackCustomEvent = (
  eventName: string,
  parameters?: Record<string, string | number | boolean>
) => {
  if (!isGALoaded()) return;

  window.gtag('event', eventName, parameters);
};

/**
 * Track outbound link clicks
 */
export const trackOutboundLink = (url: string, label?: string) => {
  if (!isGALoaded()) return;

  window.gtag('event', 'outbound_link', {
    link_url: url,
    link_text: label,
  });
};

/**
 * Track button clicks
 */
export const trackButtonClick = (buttonName: string, location: string) => {
  if (!isGALoaded()) return;

  window.gtag('event', 'button_click', {
    button_name: buttonName,
    location: location,
  });
};

/**
 * Set user properties
 */
export const setUserProperty = (propertyName: string, propertyValue: string) => {
  if (!isGALoaded()) return;

  window.gtag('set', 'user_properties', {
    [propertyName]: propertyValue,
  });
};

// TypeScript declarations for gtag
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'config' | 'set',
      targetOrAction: string,
      parameters?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}
