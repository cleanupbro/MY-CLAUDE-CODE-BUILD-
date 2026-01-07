import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.error('Stripe publishable key not found');
      return null;
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

// Create checkout session for Clean Up Card
export const createCleanUpCardCheckout = async (amount: number, customerData: {
  fullName: string;
  email: string;
  phone: string;
}) => {
  try {
    // In production, this would call your backend API to create a Stripe Checkout Session
    // For now, we'll simulate the flow

    const discountedPrice = amount * 0.85; // 15% discount

    // This would be replaced with actual Stripe Checkout Session creation
    const mockSession = {
      id: `cs_${Date.now()}`,
      amount: discountedPrice * 100, // Stripe uses cents
      currency: 'aud',
      customer_email: customerData.email,
      metadata: {
        card_value: amount,
        customer_name: customerData.fullName,
        customer_phone: customerData.phone,
        product_type: 'clean_up_card'
      }
    };

    return mockSession;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Verify payment status
export const verifyPayment = async (sessionId: string) => {
  try {
    // In production, this would verify with your backend
    return {
      success: true,
      sessionId,
      status: 'paid'
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      success: false,
      error: 'Payment verification failed'
    };
  }
};
