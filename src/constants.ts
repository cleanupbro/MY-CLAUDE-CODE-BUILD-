
import { ServiceType } from './types';

// Determine if we're in production or development
const isProd = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

// API Proxy endpoints (used in production)
// These hide the actual N8N webhook URLs from the client
const API_PROXY_URLS = {
  quote: '/api/webhooks/quote',
  jobApplication: '/api/webhooks/job-application',
  feedback: '/api/webhooks/feedback',
};

// Direct N8N URLs (only used for admin operations or development fallback)
// These are server-side only in production
const N8N_BASE = 'https://nioctibinu.online';
const N8N_ADMIN_URLS = {
  bookingConfirmation: `${N8N_BASE}/webhook/booking-confirmed`,
  squarePaymentLink: `${N8N_BASE}/webhook/create-payment-link`,
  aiChat: `${N8N_BASE}/webhook/cub-ai-chat`,
  smsFollowup: `${N8N_BASE}/webhook/cub-sms-followup`,
  inboundCall: `${N8N_BASE}/webhook/cub-inbound-call`,
  outboundCall: `${N8N_BASE}/webhook/cub-outbound-call`,
};

// Development fallback URLs (only used in localhost development)
const DEV_FALLBACK_URLS = {
  residential: `${N8N_BASE}/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c`,
  commercial: `${N8N_BASE}/webhook/bb5fdb61-31d7-4001-9dd1-44ef7dc64d32`,
  airbnb: `${N8N_BASE}/webhook/5d3f6ff4-5f08-4ccf-9b78-03b62ae6b72f`,
  jobs: `${N8N_BASE}/webhook/67f764f2-adff-481e-aa49-fd3de1feecde`,
  clientFeedback: `${N8N_BASE}/webhook/client-feedback`,
  landingLead: `${N8N_BASE}/webhook/8fe0b2c9-3d5b-44f5-84ff-0d0ef896e1fa`,
};

/**
 * Public webhook URLs
 * In production: Uses API proxy to hide N8N URLs
 * In development: Falls back to direct N8N URLs
 */
export const WEBHOOK_URLS = {
  // Quote submissions - routed through API proxy
  [ServiceType.Residential]: isProd ? API_PROXY_URLS.quote : DEV_FALLBACK_URLS.residential,
  [ServiceType.Commercial]: isProd ? API_PROXY_URLS.quote : DEV_FALLBACK_URLS.commercial,
  [ServiceType.Airbnb]: isProd ? API_PROXY_URLS.quote : DEV_FALLBACK_URLS.airbnb,
  [ServiceType.Jobs]: isProd ? API_PROXY_URLS.jobApplication : DEV_FALLBACK_URLS.jobs,
  [ServiceType.ClientFeedback]: isProd ? API_PROXY_URLS.feedback : DEV_FALLBACK_URLS.clientFeedback,
  LANDING_LEAD: isProd ? API_PROXY_URLS.quote : DEV_FALLBACK_URLS.landingLead,

  // Admin-only operations (require authentication)
  // These can use direct N8N URLs as they're protected by admin auth
  BOOKING_CONFIRMATION: N8N_ADMIN_URLS.bookingConfirmation,
  SQUARE_PAYMENT_LINK: N8N_ADMIN_URLS.squarePaymentLink,

  // AI & SMS Features (admin only)
  AI_CHAT: N8N_ADMIN_URLS.aiChat,
  SMS_FOLLOWUP: N8N_ADMIN_URLS.smsFollowup,

  // Voice Calling (admin only)
  INBOUND_CALL: N8N_ADMIN_URLS.inboundCall,
  OUTBOUND_CALL: N8N_ADMIN_URLS.outboundCall,
};

/**
 * Helper to get the quote type for API proxy
 * Used to tell the proxy which N8N workflow to use
 */
export const getQuoteType = (serviceType: ServiceType): string => {
  switch (serviceType) {
    case ServiceType.Residential:
      return 'residential';
    case ServiceType.Commercial:
      return 'commercial';
    case ServiceType.Airbnb:
      return 'airbnb';
    default:
      return 'residential';
  }
};

export const SUCCESS_MESSAGES = {
  [ServiceType.Residential]: "Quote Request Received! We've sent the details to your email.",
  [ServiceType.Commercial]: "Request Received. Our team will contact you within 24 hours.",
  [ServiceType.Airbnb]: "Turnover Request Received! We'll be in touch shortly.",
  [ServiceType.Jobs]: "Application Submitted. Good luck!",
  [ServiceType.ClientFeedback]: "Feedback Received. Thank you!",
};
