
// FIX: Moved ViewType from App.tsx to here to resolve a circular dependency and fix an export error.
export enum ServiceType {
  Residential = 'Residential Cleaning',
  Commercial = 'Commercial Cleaning',
  Airbnb = 'Airbnb Cleaning',
  Jobs = 'Job Application',
  ClientFeedback = 'Client Feedback',
}

// Admin/CRM Types
export enum SubmissionStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Canceled = 'Canceled',
}

export enum PipelineStage {
  New = 'New',
  Contacted = 'Contacted',
  Quoted = 'Quoted',
  Booked = 'Booked',
  Completed = 'Completed',
}

export type SubmissionType = ServiceType | 'Landing Lead';

export interface Submission {
  id: string;
  timestamp: number;
  type: SubmissionType;
  status: SubmissionStatus;
  data: SubmissionData;
  summary?: string;
  leadScore?: number;
  leadReasoning?: string;
  pipelineStage?: PipelineStage;
  pipelineUpdatedAt?: string;
}

// Email Template Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'quote_follow_up' | 'booking_confirmation' | 'reminder' | 'thank_you' | 'custom';
  placeholders?: { key: string; label: string }[];
  created_at?: string;
  updated_at?: string;
}

// Customer Notes Types
export interface CustomerNote {
  id: string;
  customer_email: string;
  note: string;
  note_type: 'call' | 'email' | 'meeting' | 'internal';
  created_by?: string;
  created_at: string;
}

// Invoice Types
export interface Invoice {
  id: string;
  submission_id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  due_date?: string;
  paid_at?: string;
  square_invoice_id?: string;
  pdf_url?: string;
  created_at: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export type ViewType = ServiceType | 'Landing' | 'Success' | 'AdminLogin' | 'AdminDashboard' | 'ClientFeedback' | 'About' | 'Reviews' | 'Contact' | 'Services' | 'CleanUpCard' | 'GiftCardPurchase' | 'CheckBalance' | 'AdminGiftCards' | 'AirbnbContract' | 'BasicContract' | 'CommercialInvoice' | 'AdminContracts';

export interface NavigationProps {
  navigateTo: (view: ViewType, message?: string, initialState?: any) => void;
  onSubmissionFail?: () => void;
}

// FIX: Added UploadedFile interface to resolve 'has no exported member' error.
export interface UploadedFile {
    name: string;
    type: string;
    data: string; // base64 encoded data URL
}

export interface LandingLeadData {
  suburb: string;
  bedrooms: number;
  bathrooms: number;
  serviceType: ResidentialQuoteData['serviceType'];
  referenceId?: string;
}

export interface ResidentialQuoteData {
  // Step 1
  suburb: string;
  propertyType: 'Apartment' | 'Townhouse' | 'House' | '';
  bedrooms: number;
  bathrooms: number;
  // Step 2
  serviceType: 'General' | 'Deep' | 'End-of-Lease' | 'Post-Construction' | '';
  condition: 'Standard' | 'Moderate' | 'Heavy' | 'Extreme';
  frequency: 'One-time' | 'Weekly' | 'Bi-weekly' | 'Monthly' | '';
  subscribedToOneYearPlan: boolean;
  addOns: string[];
  // Step 3
  preferredDate: string;
  preferredTime: 'Morning' | 'Afternoon' | 'Flexible' | '';
  notes: string;
  // Step 4
  fullName: string;
  email: string;
  phone: string;
  agreedToTerms: boolean;
  referenceId?: string;
}

export interface CommercialQuoteData {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    facilityType: string;
    squareMeters: string;
    cleaningFrequency: string;
    complianceNeeds: string[];
    painPoints: string;
    preferredStartDate: string;
    contractTerm: 'Month-to-Month' | '6 Months' | '1 Year' | '';
    referenceId?: string;
}

export interface AirbnbQuoteData {
    listingUrl: string;
    propertyType: string;
    bedrooms: string;
    bathrooms: string;
    turnoverRequirements: string[];
    accessMethod: string;
    preferredTurnoverTime: string;
    preferredStartDate: string;
    cleaningFrequency: 'On Checkout' | 'Weekly' | 'Bi-weekly' | '';
    contactName: string;
    email: string;
    phone: string;
    referenceId?: string;
}

export interface JobApplicationData {
    fullName: string;
    email: string;
    phone: string;
    hasWorkRights: boolean;
    experience: string;
    hasOwnEquipment: boolean;
    availability: string[];
    serviceSuburbs: string;
    preferredStartDate: string;
    referenceName: string;
    referenceContact: string;
    attachments: UploadedFile[];
    photos?: UploadedFile[];
    agreedToChecks: boolean;
    referenceId?: string;
}

export interface ClientFeedbackData {
    rating: number;
    comments: string;
    fullName: string;
    email: string;
    referenceId?: string;
}

export type SubmissionData = (ResidentialQuoteData | CommercialQuoteData | AirbnbQuoteData | JobApplicationData | LandingLeadData | ClientFeedbackData) & { priceEstimate?: number };
