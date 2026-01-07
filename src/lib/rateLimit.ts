/**
 * Client-Side Rate Limiting
 * Prevents abuse by tracking submission attempts locally
 *
 * NOTE: This is NOT a replacement for server-side rate limiting!
 * Always implement rate limiting on your backend/Edge Functions.
 *
 * This provides a better UX by preventing unnecessary API calls.
 */

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  key: string;
}

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const RATE_LIMIT_STORAGE_KEY = 'cleanupbros_rate_limits';

/**
 * Get all rate limit records from localStorage
 */
const getRateLimitRecords = (): Record<string, RateLimitRecord> => {
  try {
    const data = localStorage.getItem(RATE_LIMIT_STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

/**
 * Save rate limit records to localStorage
 */
const saveRateLimitRecords = (records: Record<string, RateLimitRecord>) => {
  try {
    localStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Failed to save rate limit data:', error);
  }
};

/**
 * Clean up expired rate limit records
 */
const cleanupExpiredRecords = (records: Record<string, RateLimitRecord>): Record<string, RateLimitRecord> => {
  const now = Date.now();
  const cleaned: Record<string, RateLimitRecord> = {};

  for (const [key, record] of Object.entries(records)) {
    if (record.resetTime > now) {
      cleaned[key] = record;
    }
  }

  return cleaned;
};

/**
 * Check if action is rate limited
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining attempts
 */
export const checkRateLimit = (config: RateLimitConfig): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
} => {
  const now = Date.now();
  let records = getRateLimitRecords();

  // Clean up expired records
  records = cleanupExpiredRecords(records);

  const record = records[config.key];

  // No record or expired
  if (!record || record.resetTime <= now) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + config.windowMs,
    };

    records[config.key] = newRecord;
    saveRateLimitRecords(records);

    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: newRecord.resetTime,
    };
  }

  // Check if limit exceeded
  if (record.count >= config.maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      retryAfter: Math.ceil((record.resetTime - now) / 1000), // seconds
    };
  }

  // Increment counter
  record.count++;
  records[config.key] = record;
  saveRateLimitRecords(records);

  return {
    allowed: true,
    remaining: config.maxAttempts - record.count,
    resetTime: record.resetTime,
  };
};

/**
 * Reset rate limit for a specific key
 */
export const resetRateLimit = (key: string): void => {
  const records = getRateLimitRecords();
  delete records[key];
  saveRateLimitRecords(records);
};

/**
 * Format retry-after time in human-readable format
 */
export const formatRetryAfter = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  }

  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

/**
 * Pre-configured rate limit checks for common actions
 */
export const RateLimits = {
  // Quote submissions: 5 per hour
  quoteSubmission: () =>
    checkRateLimit({
      key: 'quote_submission',
      maxAttempts: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
    }),

  // Job applications: 3 per day
  jobApplication: () =>
    checkRateLimit({
      key: 'job_application',
      maxAttempts: 3,
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
    }),

  // Login attempts: 5 per 15 minutes
  loginAttempt: () =>
    checkRateLimit({
      key: 'login_attempt',
      maxAttempts: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    }),

  // Contact form: 3 per hour
  contactForm: () =>
    checkRateLimit({
      key: 'contact_form',
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
    }),

  // Clean Up Card purchase: 10 per day
  cardPurchase: () =>
    checkRateLimit({
      key: 'card_purchase',
      maxAttempts: 10,
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
    }),
};

/**
 * HOW TO USE:
 *
 * import { RateLimits, formatRetryAfter } from '../lib/rateLimit';
 *
 * const handleSubmit = async () => {
 *   const rateLimit = RateLimits.quoteSubmission();
 *
 *   if (!rateLimit.allowed) {
 *     alert(`Too many requests. Please try again in ${formatRetryAfter(rateLimit.retryAfter!)}`);
 *     return;
 *   }
 *
 *   // Continue with submission...
 * };
 */
