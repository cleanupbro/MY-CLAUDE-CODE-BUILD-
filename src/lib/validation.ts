import { z } from 'zod';

// Australian phone number validation
const australianPhoneRegex = /^(\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;

// Email validation (basic)
const emailSchema = z.string().email('Please enter a valid email address');

// Phone validation
const phoneSchema = z.string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(australianPhoneRegex, 'Please enter a valid Australian phone number');

// Residential Quote Schema
export const residentialQuoteSchema = z.object({
  suburb: z.string().min(2, 'Please enter your suburb'),
  propertyType: z.enum(['Apartment', 'Townhouse', 'House'], {
    errorMap: () => ({ message: 'Please select a property type' })
  }),
  bedrooms: z.number().min(1).max(10, 'Maximum 10 bedrooms'),
  bathrooms: z.number().min(1).max(10, 'Maximum 10 bathrooms'),
  serviceType: z.enum(['General', 'Deep', 'End-of-Lease', 'Post-Construction'], {
    errorMap: () => ({ message: 'Please select a service type' })
  }),
  condition: z.enum(['Standard', 'Moderate', 'Heavy', 'Extreme']),
  frequency: z.enum(['One-time', 'Weekly', 'Bi-weekly', 'Monthly'], {
    errorMap: () => ({ message: 'Please select frequency' })
  }),
  subscribedToOneYearPlan: z.boolean(),
  addOns: z.array(z.string()),
  preferredDate: z.string().min(1, 'Please select a preferred date'),
  preferredTime: z.enum(['Morning', 'Afternoon', 'Flexible'], {
    errorMap: () => ({ message: 'Please select a preferred time' })
  }),
  notes: z.string().optional(),
  fullName: z.string().min(2, 'Please enter your full name'),
  email: emailSchema,
  phone: phoneSchema,
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  })
});

// Commercial Quote Schema
export const commercialQuoteSchema = z.object({
  companyName: z.string().min(2, 'Please enter your company name'),
  contactPerson: z.string().min(2, 'Please enter contact person name'),
  email: emailSchema,
  phone: phoneSchema,
  facilityType: z.string().min(2, 'Please specify facility type'),
  squareMeters: z.string().min(1, 'Please enter square meters'),
  cleaningFrequency: z.string().min(1, 'Please select cleaning frequency'),
  complianceNeeds: z.array(z.string()),
  painPoints: z.string().optional(),
  preferredStartDate: z.string().min(1, 'Please select a start date'),
  contractTerm: z.enum(['Month-to-Month', '6 Months', '1 Year'], {
    errorMap: () => ({ message: 'Please select contract term' })
  })
});

// Airbnb Quote Schema
export const airbnbQuoteSchema = z.object({
  listingUrl: z.string().url('Please enter a valid listing URL').or(z.string().min(5)),
  propertyType: z.string().min(2, 'Please specify property type'),
  bedrooms: z.string().min(1, 'Please enter number of bedrooms'),
  bathrooms: z.string().min(1, 'Please enter number of bathrooms'),
  turnoverRequirements: z.array(z.string()),
  accessMethod: z.string().min(2, 'Please specify access method'),
  preferredTurnoverTime: z.string().min(1, 'Please specify turnaround time'),
  preferredStartDate: z.string().min(1, 'Please select a start date'),
  cleaningFrequency: z.enum(['On Checkout', 'Weekly', 'Bi-weekly'], {
    errorMap: () => ({ message: 'Please select cleaning frequency' })
  }),
  contactName: z.string().min(2, 'Please enter contact name'),
  email: emailSchema,
  phone: phoneSchema
});

// Job Application Schema
export const jobApplicationSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: emailSchema,
  phone: phoneSchema,
  hasWorkRights: z.boolean().refine(val => val === true, {
    message: 'You must have Australian work rights to apply'
  }),
  experience: z.string().min(10, 'Please describe your cleaning experience'),
  hasOwnEquipment: z.boolean(),
  availability: z.array(z.string()).min(1, 'Please select at least one day'),
  serviceSuburbs: z.string().min(2, 'Please enter service suburbs'),
  preferredStartDate: z.string().min(1, 'Please select a start date'),
  referenceName: z.string().min(2, 'Please enter reference name'),
  referenceContact: z.string().min(10, 'Please enter reference contact'),
  agreedToChecks: z.boolean().refine(val => val === true, {
    message: 'You must agree to background checks'
  })
});

// Client Feedback Schema
export const clientFeedbackSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comments: z.string().min(10, 'Please provide at least 10 characters of feedback'),
  fullName: z.string().optional(),
  email: z.string().email().optional().or(z.literal(''))
});

// Helper function to validate and get errors
export const validateForm = <T,>(schema: z.ZodSchema<T>, data: any) => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, errors: null };
  }
  const errors: Record<string, string> = {};
  result.error.errors.forEach(err => {
    if (err.path[0]) {
      errors[err.path[0].toString()] = err.message;
    }
  });
  return { success: false, data: null, errors };
};
