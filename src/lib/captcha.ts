/**
 * Google reCAPTCHA v3 Integration
 * Prevents spam and bot submissions
 *
 * Setup Instructions:
 * 1. Go to https://www.google.com/recaptcha/admin
 * 2. Register your site with reCAPTCHA v3
 * 3. Add site key to .env.local as VITE_RECAPTCHA_SITE_KEY
 * 4. Add secret key to backend as RECAPTCHA_SECRET_KEY
 */

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

/**
 * Load reCAPTCHA script dynamically
 */
export const loadRecaptchaScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.getElementById('recaptcha-script')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(script);
  });
};

/**
 * Execute reCAPTCHA and get token
 * @param action - Action name (e.g., 'submit_quote', 'login')
 * @returns reCAPTCHA token
 */
export const executeRecaptcha = async (action: string): Promise<string> => {
  if (!RECAPTCHA_SITE_KEY) {
    console.warn('reCAPTCHA not configured, skipping verification');
    return 'dev_bypass_token';
  }

  try {
    await loadRecaptchaScript();

    return new Promise((resolve, reject) => {
      if (!window.grecaptcha) {
        reject(new Error('reCAPTCHA not loaded'));
        return;
      }

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(RECAPTCHA_SITE_KEY!, { action })
          .then(resolve)
          .catch(reject);
      });
    });
  } catch (error) {
    console.error('reCAPTCHA error:', error);
    throw error;
  }
};

/**
 * Verify reCAPTCHA token on backend
 * This should be called from your Supabase Edge Function or backend API
 *
 * @param token - Token from executeRecaptcha()
 * @param secretKey - Your reCAPTCHA secret key (backend only)
 * @returns Verification result with score
 */
export const verifyRecaptchaToken = async (
  token: string,
  secretKey: string
): Promise<{ success: boolean; score: number; action: string }> => {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      secret: secretKey,
      response: token,
    }),
  });

  const data = await response.json();

  return {
    success: data.success,
    score: data.score || 0,
    action: data.action || '',
  };
};

/**
 * Check if reCAPTCHA is configured
 */
export const isRecaptchaConfigured = (): boolean => {
  return !!RECAPTCHA_SITE_KEY && RECAPTCHA_SITE_KEY !== 'your_recaptcha_site_key_here';
};

// TypeScript declarations for grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}
