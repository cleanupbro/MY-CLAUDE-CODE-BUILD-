/**
 * Form Validation Utilities
 * 
 * Ensures all forms collect valid contact information
 * before allowing submission.
 * 
 * RULE: Never let a client proceed without phone OR email
 */

export interface ContactValidation {
  isValid: boolean;
  errors: string[];
  hasPhone: boolean;
  hasEmail: boolean;
}

/**
 * Validate Australian phone number
 * Accepts: 04XX XXX XXX, +61 4XX XXX XXX, etc.
 */
export const isValidAustralianPhone = (phone: string): boolean => {
  if (!phone) return false;
  
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Check for valid Australian mobile formats
  const patterns = [
    /^04\d{8}$/,           // 04XX XXX XXX (10 digits)
    /^\+614\d{8}$/,        // +61 4XX XXX XXX
    /^614\d{8}$/,          // 61 4XX XXX XXX
    /^0[2378]\d{8}$/,      // Landline: 02, 03, 07, 08
    /^\+61[2378]\d{8}$/,   // International landline
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
};

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Format phone number for display
 * Converts to: XXXX-XXX-XXX format
 */
export const formatPhoneNumber = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, '');
  const limitedDigits = digitsOnly.slice(0, 10);
  
  if (limitedDigits.length > 7) {
    return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 7)}-${limitedDigits.slice(7, 10)}`;
  }
  if (limitedDigits.length > 4) {
    return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 7)}`;
  }
  return limitedDigits;
};

/**
 * Validate contact info - MUST have phone OR email
 * 
 * @param phone - Phone number (optional)
 * @param email - Email address (optional)
 * @param requireBoth - If true, requires BOTH phone AND email
 * @returns Validation result with errors
 */
export const validateContact = (
  phone?: string,
  email?: string,
  requireBoth: boolean = false
): ContactValidation => {
  const errors: string[] = [];
  const hasPhone = phone ? isValidAustralianPhone(phone) : false;
  const hasEmail = email ? isValidEmail(email) : false;

  if (requireBoth) {
    if (!hasPhone) {
      errors.push('Valid Australian phone number is required');
    }
    if (!hasEmail) {
      errors.push('Valid email address is required');
    }
  } else {
    // At least one is required
    if (!hasPhone && !hasEmail) {
      errors.push('Please provide a valid phone number or email address');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    hasPhone,
    hasEmail,
  };
};

/**
 * Validate full form data
 * Use this before allowing form submission
 */
export const validateFormData = (data: {
  phone?: string;
  email?: string;
  fullName?: string;
  name?: string;
  contactName?: string;
  contactPerson?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check for name
  const name = data.fullName || data.name || data.contactName || data.contactPerson;
  if (!name || name.trim().length < 2) {
    errors.push('Name is required');
  }

  // Check for contact info (phone OR email)
  const contactValidation = validateContact(data.phone, data.email, false);
  if (!contactValidation.isValid) {
    errors.push(...contactValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Show validation error toast
 * Helper function to display errors consistently
 */
export const showValidationErrors = (
  errors: string[],
  showToast: (message: string, type: 'error' | 'success' | 'warning') => void
): void => {
  errors.forEach((error, index) => {
    setTimeout(() => {
      showToast(error, 'error');
    }, index * 300); // Stagger toasts
  });
};

/**
 * Check if form can proceed (has minimum contact info)
 */
export const canProceed = (data: { phone?: string; email?: string }): boolean => {
  const hasValidPhone = data.phone ? isValidAustralianPhone(data.phone) : false;
  const hasValidEmail = data.email ? isValidEmail(data.email) : false;
  return hasValidPhone || hasValidEmail;
};

export default {
  isValidAustralianPhone,
  isValidEmail,
  formatPhoneNumber,
  validateContact,
  validateFormData,
  showValidationErrors,
  canProceed,
};
