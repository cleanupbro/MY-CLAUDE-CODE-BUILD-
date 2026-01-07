import React, { useState } from 'react';
import { NavigationProps } from '../types';
import { Card } from '../components/Card';

interface CardPurchaseData {
  fullName: string;
  email: string;
  phone: string;
  amount: number;
  agreedToTerms: boolean;
}

const CleanUpCardView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const [formData, setFormData] = useState<CardPurchaseData>({
    fullName: '',
    email: '',
    phone: '',
    amount: 1000,
    agreedToTerms: false
  });

  const [currentStep, setCurrentStep] = useState<'info' | 'purchase'>('info');

  const cardOptions = [
    {
      amount: 500,
      bonus: 75,
      discount: 15,
      total: 425,
      popular: false,
      description: 'Perfect for trying our service'
    },
    {
      amount: 1000,
      bonus: 150,
      discount: 15,
      total: 850,
      popular: true,
      description: 'Most popular - Best value!'
    },
    {
      amount: 2000,
      bonus: 300,
      discount: 15,
      total: 1700,
      popular: false,
      description: 'For frequent cleaning needs'
    }
  ];

  const handlePurchase = async () => {
    try {
      // Import Stripe service
      const { createCleanUpCardCheckout } = await import('../services/stripeService');

      // Create checkout session
      const session = await createCleanUpCardCheckout(formData.amount, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      });

      // In production with backend, you would redirect to Stripe Checkout
      // window.location.href = session.url;

      // For now, show success message
      navigateTo('Success', `🎉 Clean Up Card Purchase Complete! You saved $${formData.amount * 0.15}! Check your email for your card details and invoice.`);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing error. Please try again or contact support.');
    }
  };

  if (currentStep === 'info') {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-navy via-brand-navy to-brand-gold p-16">
          <div className="relative z-10">
            <div className="inline-block mb-6">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-white/30">
                <span className="text-white font-bold text-lg">💳 Smart Savings Program</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Clean Up Card
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 mb-4 font-light">
              Pay Now, Save 15%, Clean Anytime
            </p>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Purchase credit in advance and enjoy 15% off all cleaning services—forever. No expiry, no hassle.
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-brand-navy text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Choose Amount</h3>
              <p className="text-gray-600">Select your credit amount ($500, $1000, or $2000)</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Pay Once</h3>
              <p className="text-gray-600">Get instant 15% discount on your purchase</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Book Anytime</h3>
              <p className="text-gray-600">Use your credit whenever you need cleaning</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">4️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Relax</h3>
              <p className="text-gray-600">No expiry date, use at your own pace</p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-brand-navy text-center mb-4">Choose Your Card</h2>
          <p className="text-xl text-gray-600 text-center mb-12">All cards include 15% instant savings</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {cardOptions.map((option, index) => (
              <Card key={index}>
                <div className={`relative ${option.popular ? 'border-4 border-brand-gold rounded-2xl -m-1 p-1' : ''}`}>
                  {option.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-brand-gold text-white px-4 py-1 rounded-full text-sm font-bold">
                        ⭐ MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="text-center pt-6">
                    <div className="text-5xl mb-4">💳</div>
                    <div className="text-4xl font-bold text-brand-navy mb-2">
                      ${option.amount}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">Credit Value</div>

                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                      <div className="text-green-800 font-bold text-lg mb-1">
                        Pay Only ${option.total}
                      </div>
                      <div className="text-green-600 text-sm">
                        Save ${option.bonus} (15% OFF)
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 min-h-[3rem]">{option.description}</p>

                    <button
                      onClick={() => {
                        setFormData({ ...formData, amount: option.amount });
                        setCurrentStep('purchase');
                      }}
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                        option.popular
                          ? 'bg-brand-gold text-white hover:bg-brand-gold/90'
                          : 'bg-brand-navy text-white hover:bg-brand-navy/90'
                      }`}
                    >
                      Get This Card
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-brand-navy/5 to-brand-gold/5 rounded-3xl p-12 mb-16">
          <h2 className="text-4xl font-bold text-brand-navy text-center mb-12">Why Clean Up Card?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Save 15% Always</h3>
              <p className="text-gray-600">Lock in 15% savings on every booking, forever</p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">No Expiry</h3>
              <p className="text-gray-600">Your credit never expires—use it at your pace</p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Transferable</h3>
              <p className="text-gray-600">Gift it to family or friends anytime</p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Easy Booking</h3>
              <p className="text-gray-600">Book online or call—credit applies automatically</p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Top Up Anytime</h3>
              <p className="text-gray-600">Add more credit whenever you need</p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">VIP Treatment</h3>
              <p className="text-gray-600">Priority booking and dedicated support</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-brand-navy text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <h3 className="font-bold text-brand-navy mb-2">Does the credit expire?</h3>
              <p className="text-gray-600">No! Your Clean Up Card credit never expires. Use it at your own pace.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-brand-navy mb-2">Can I use it for any service?</h3>
              <p className="text-gray-600">Yes! Use it for residential, commercial, Airbnb, or any cleaning service we offer.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-brand-navy mb-2">Can I share or gift my card?</h3>
              <p className="text-gray-600">Absolutely! You can transfer credit to friends or family anytime.</p>
            </Card>
            <Card>
              <h3 className="font-bold text-brand-navy mb-2">What if I need a refund?</h3>
              <p className="text-gray-600">Unused credit can be refunded within 30 days of purchase, no questions asked.</p>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => setCurrentStep('purchase')}
            className="bg-brand-gold text-white px-12 py-6 rounded-full font-bold text-2xl hover:bg-brand-gold/90 transition-all transform hover:scale-105 shadow-xl"
          >
            Get Your Clean Up Card Now
          </button>
        </div>
      </div>
    );
  }

  // Purchase Form
  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => setCurrentStep('info')}
        className="mb-8 text-brand-navy hover:text-brand-gold flex items-center gap-2"
      >
        ← Back to Options
      </button>

      <Card>
        <h2 className="text-3xl font-bold text-brand-navy mb-6">Complete Your Purchase</h2>

        <div className="bg-brand-gold/10 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Card Value:</span>
            <span className="text-2xl font-bold text-brand-navy">${formData.amount}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Discount (15%):</span>
            <span className="text-xl font-bold text-green-600">-${formData.amount * 0.15}</span>
          </div>
          <div className="border-t-2 border-brand-gold/30 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-brand-navy">You Pay:</span>
              <span className="text-3xl font-bold text-brand-gold">${formData.amount * 0.85}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-brand-navy font-semibold mb-2">Full Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-brand-gold focus:outline-none"
              placeholder="John Smith"
            />
          </div>

          <div>
            <label className="block text-brand-navy font-semibold mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-brand-gold focus:outline-none"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-brand-navy font-semibold mb-2">Phone *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-brand-gold focus:outline-none"
              placeholder="0400 000 000"
            />
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              💳 <strong>Payment Details:</strong> After submitting, you'll receive an invoice via email with secure payment options (Card, PayPal, Bank Transfer).
            </p>
          </div>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
              className="mt-1"
            />
            <span className="text-sm text-gray-700">
              I agree to the Clean Up Card terms and conditions. Credit never expires and can be used for any cleaning service.
            </span>
          </label>
        </div>

        <button
          onClick={handlePurchase}
          disabled={!formData.fullName || !formData.email || !formData.phone || !formData.agreedToTerms}
          className="w-full bg-brand-gold text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-gold/90 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Complete Purchase
        </button>
      </Card>
    </div>
  );
};

export default CleanUpCardView;
