import React, { useState, useEffect, useRef } from 'react';
import { NavigationProps } from '../types';
import {
  purchaseGiftCard,
  calculateBonus,
  PurchaseGiftCardData,
} from '../services/giftCardService';
import { createPaymentLink, PaymentLinkData } from '../services/squareService';
import { logGiftCardPurchase } from '../services/googleSheetsService';

// Scroll Reveal Hook
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

const GIFT_CARD_AMOUNTS = [
  { value: 100, label: '$100' },
  { value: 200, label: '$200' },
  { value: 500, label: '$500' },
  { value: 1000, label: '$1000' },
];

const formatPhoneNumber = (value: string) => {
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

export const GiftCardPurchaseView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [isGift, setIsGift] = useState(false);

  // Purchaser details
  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');
  const [purchaserPhone, setPurchaserPhone] = useState('');

  // Recipient details (if gift)
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [giftMessage, setGiftMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const heroSection = useScrollReveal();
  const benefitsSection = useScrollReveal();
  const formSection = useScrollReveal();

  const amount = useCustom ? parseFloat(customAmount) || 0 : selectedAmount;
  const bonusAmount = calculateBonus(amount);
  const totalValue = amount + bonusAmount;

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (amount < 50) {
        setError('Minimum gift card amount is $50');
        setLoading(false);
        return;
      }

      if (amount > 5000) {
        setError('Maximum gift card amount is $5000');
        setLoading(false);
        return;
      }

      if (!purchaserName || !purchaserEmail) {
        setError('Please fill in all your details');
        setLoading(false);
        return;
      }

      if (isGift && (!recipientName || !recipientEmail)) {
        setError('Please fill in recipient details');
        setLoading(false);
        return;
      }

      const giftCardData: PurchaseGiftCardData = {
        amount,
        isGift,
        purchaserName,
        purchaserEmail,
        purchaserPhone,
        recipientName: isGift ? recipientName : undefined,
        recipientEmail: isGift ? recipientEmail : undefined,
        giftMessage: isGift ? giftMessage : undefined,
      };

      const result = await purchaseGiftCard(giftCardData);

      if (!result.success || !result.giftCard) {
        setError(result.error || 'Failed to create gift card');
        setLoading(false);
        return;
      }

      logGiftCardPurchase({
        ...result.giftCard,
        purchaserName,
        purchaserEmail,
      }, result.giftCard.id).catch(err => console.warn('Google Sheets logging failed:', err));

      const paymentData: PaymentLinkData = {
        customerName: purchaserName,
        customerEmail: purchaserEmail,
        serviceType: 'Gift Card',
        amount: amount,
        referenceId: result.giftCard.id,
        description: `Clean Up Bros Gift Card - $${totalValue} total value (includes 15% bonus)`,
      };

      const paymentResult = await createPaymentLink(paymentData);

      if (paymentResult.success && paymentResult.paymentLink) {
        window.location.href = paymentResult.paymentLink;
      } else {
        navigateTo('Success', `Gift card created! Code: ${result.giftCard.code}. We'll send payment details to ${purchaserEmail}.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />

        {/* Animated Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#0066CC]/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#2997FF]/15 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Hero Content */}
        <div
          ref={heroSection.ref}
          className={`relative z-10 text-center px-6 py-16 max-w-4xl mx-auto transition-all duration-1000 ${
            heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Icon */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-[#0066CC]/20 border border-[#2997FF]/30 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-10 h-10 text-[#2997FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
            </span>
            <span className="text-[#30D158] text-sm font-semibold uppercase tracking-wider">
              15% Bonus Credit
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
            Gift Cards
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Give the gift of a spotless home. Never expires, any service.
          </p>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="bg-[#0D0D0D] py-16">
        <div
          ref={benefitsSection.ref}
          className={`max-w-5xl mx-auto px-6 transition-all duration-1000 ${
            benefitsSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '💰', title: 'Save 15%', desc: 'Get bonus credit on every purchase' },
              { icon: '⏰', title: 'Never Expires', desc: 'Use anytime, no rush' },
              { icon: '🎯', title: 'Any Service', desc: 'Fully flexible for all cleaning needs' }
            ].map((benefit, index) => (
              <div
                key={index}
                className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all text-center"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-white/60">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PURCHASE FORM SECTION */}
      <section className="bg-black py-16">
        <div
          ref={formSection.ref}
          className={`max-w-3xl mx-auto px-6 transition-all duration-1000 ${
            formSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <form onSubmit={handlePurchase}>
            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-xl flex items-center gap-3">
                <svg className="w-6 h-6 text-[#FF453A] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-[#FF453A] font-medium">{error}</p>
              </div>
            )}

            {/* Amount Selection */}
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-6">
              <h2 className="text-2xl font-semibold text-white mb-6">1. Select Amount</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {GIFT_CARD_AMOUNTS.map(option => {
                  const bonus = calculateBonus(option.value);
                  const isSelected = !useCustom && selectedAmount === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(option.value);
                        setUseCustom(false);
                      }}
                      className={`p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'border-[#2997FF] bg-[#2997FF]/10'
                          : 'border-white/10 hover:border-[#2997FF]/50 bg-[#2C2C2E]'
                      }`}
                    >
                      <div className="text-2xl font-semibold text-white">{option.label}</div>
                      <div className="text-sm text-[#30D158] mt-1">+${bonus.toFixed(0)} bonus</div>
                      <div className="text-lg font-medium text-[#2997FF] mt-1">= ${(option.value + bonus).toFixed(0)}</div>
                    </button>
                  );
                })}
              </div>

              <label className="flex items-center gap-3 mb-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                  className="w-5 h-5 rounded bg-[#2C2C2E] border-white/20 text-[#2997FF] focus:ring-[#2997FF]/30"
                />
                <span className="text-white font-medium">Enter custom amount</span>
              </label>

              {useCustom && (
                <div className="mt-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-semibold text-white/40">$</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 text-2xl font-semibold bg-[#2C2C2E] border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 outline-none"
                      placeholder="Enter amount"
                      min="50"
                      max="5000"
                    />
                  </div>
                  {customAmount && parseFloat(customAmount) >= 50 && (
                    <div className="mt-4 p-4 bg-[#30D158]/10 border border-[#30D158]/30 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-white/60">You Pay:</span>
                        <span className="font-semibold text-white">${customAmount}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white/60">Bonus (15%):</span>
                        <span className="font-semibold text-[#30D158]">+${calculateBonus(parseFloat(customAmount)).toFixed(2)}</span>
                      </div>
                      <div className="border-t border-[#30D158]/30 my-2"></div>
                      <div className="flex justify-between">
                        <span className="font-medium text-white">Total Value:</span>
                        <span className="text-xl font-semibold text-[#30D158]">
                          ${(parseFloat(customAmount) + calculateBonus(parseFloat(customAmount))).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Gift Option */}
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="w-5 h-5 mt-1 rounded bg-[#2C2C2E] border-white/20 text-[#2997FF] focus:ring-[#2997FF]/30"
                />
                <div>
                  <span className="text-lg font-semibold text-white block">This is a gift for someone else</span>
                  <p className="text-white/60 text-sm mt-1">We'll email the gift card directly to the recipient with your personalized message</p>
                </div>
              </label>
            </div>

            {/* Your Details */}
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-6">
              <h2 className="text-2xl font-semibold text-white mb-6">2. Your Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={purchaserName}
                    onChange={(e) => setPurchaserName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2C2C2E] border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 outline-none"
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Your Email *</label>
                  <input
                    type="email"
                    value={purchaserEmail}
                    onChange={(e) => setPurchaserEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2C2C2E] border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 outline-none"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Your Phone (Optional)</label>
                  <input
                    type="tel"
                    value={purchaserPhone}
                    onChange={(e) => setPurchaserPhone(formatPhoneNumber(e.target.value))}
                    className="w-full px-4 py-3 bg-[#2C2C2E] border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 outline-none"
                    placeholder="0412-345-678"
                  />
                </div>
              </div>
            </div>

            {/* Recipient Details (if gift) */}
            {isGift && (
              <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-[#2997FF]/30 mb-6">
                <h2 className="text-2xl font-semibold text-white mb-6">3. Recipient Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Recipient Name *</label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#2C2C2E] border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 outline-none"
                      placeholder="Jane Doe"
                      required={isGift}
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Recipient Email *</label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#2C2C2E] border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 outline-none"
                      placeholder="jane@example.com"
                      required={isGift}
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Gift Message (Optional)</label>
                    <textarea
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      className="w-full px-4 py-3 bg-[#2C2C2E] border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 outline-none resize-none"
                      rows={3}
                      placeholder="Happy Birthday! Enjoy a sparkling clean home!"
                      maxLength={500}
                    />
                    <p className="text-sm text-white/40 mt-2">{giftMessage.length}/500 characters</p>
                  </div>
                </div>
              </div>
            )}

            {/* Purchase Summary */}
            <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-2xl p-8 border border-white/10 mb-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Purchase Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Amount Paid:</span>
                  <span className="text-2xl font-semibold text-white">${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Bonus Credit (15%):</span>
                  <span className="text-2xl font-semibold text-[#30D158]">+${bonusAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-white/10 my-4"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-white">Total Gift Card Value:</span>
                  <span className="text-3xl font-semibold text-[#2997FF]">${totalValue.toFixed(2)}</span>
                </div>
              </div>

              {isGift && recipientEmail && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-white/60 text-sm">
                    Gift card will be emailed to: <strong className="text-white">{recipientEmail}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Purchase Button */}
            <button
              type="submit"
              disabled={loading || amount < 50}
              className="w-full px-8 py-4 bg-[#0066CC] text-white text-lg font-semibold rounded-xl hover:bg-[#0077ED] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,102,204,0.3)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Purchase Gift Card - $${amount.toFixed(2)}`
              )}
            </button>

            {/* Terms */}
            <div className="mt-6 p-4 bg-[#1C1C1E]/50 rounded-xl border border-white/5">
              <p className="text-sm text-white/40 leading-relaxed">
                <strong className="text-white/60">Terms:</strong> Gift cards never expire. Non-refundable.
                Can be used for any Clean Up Bros service. Card will be activated after payment confirmation.
                {isGift && ' The recipient will receive a separate email with the gift card details.'}
              </p>
            </div>
          </form>

          {/* Back Link */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigateTo('Landing')}
              className="text-[#2997FF] hover:text-white font-medium transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#0066CC] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Already Have a Gift Card?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Check your balance or book a cleaning service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigateTo('CheckBalance')}
              className="px-8 py-4 bg-white text-[#0066CC] text-lg font-semibold rounded-full hover:bg-white/90 transition-all"
            >
              Check Balance
            </button>
            <button
              onClick={() => navigateTo('Services')}
              className="px-8 py-4 bg-white/10 text-white text-lg font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-all"
            >
              Book a Service
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GiftCardPurchaseView;
