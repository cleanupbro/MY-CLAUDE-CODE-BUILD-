import React, { useState } from 'react';
import { NavigationProps } from '../types';
import {
  purchaseGiftCard,
  calculateBonus,
  PurchaseGiftCardData,
} from '../services/giftCardService';
import { createPaymentLink, PaymentLinkData } from '../services/squareService';
import { logGiftCardPurchase } from '../services/googleSheetsService';

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

  const amount = useCustom ? parseFloat(customAmount) || 0 : selectedAmount;
  const bonusAmount = calculateBonus(amount);
  const totalValue = amount + bonusAmount;

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
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

      // Create gift card in Supabase
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

      // Log to Google Sheets for backup
      logGiftCardPurchase({
        ...result.giftCard,
        purchaserName,
        purchaserEmail,
      }, result.giftCard.id).catch(err => console.warn('Google Sheets logging failed:', err));

      // Create Square payment link directly
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
        // Show success page if payment link fails - user can pay later
        navigateTo('Success', `Gift card created! Code: ${result.giftCard.code}. We'll send payment details to ${purchaserEmail}.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero-unit min-h-[600px] md:min-h-[700px] bg-black text-white mb-0 relative group overflow-hidden">
        <div className="hero-unit-text flex flex-col items-center">
          <div className="text-6xl md:text-7xl mb-6 animate-fade-in-up">🎁</div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-tight text-center drop-shadow-2xl text-white">
            Clean Up Bros Gift Cards
          </h1>
          <p className="text-2xl md:text-3xl font-medium mb-6 text-center drop-shadow-lg">
            Give the gift of a spotless home!
          </p>
          <div className="inline-block bg-brand-gold text-[#1D1D1F] px-8 py-4 rounded-full font-bold text-xl md:text-2xl shadow-2xl animate-fade-in-up">
            Get 15% Bonus Credit on All Gift Cards! 🎉
          </div>
        </div>
        <div
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1920&q=80)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-br from-[#F5F5F7] to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-2">Save 15%</h3>
              <p className="text-[#86868b] text-lg">Get bonus credit on every purchase</p>
            </div>
            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-2">Never Expires</h3>
              <p className="text-[#86868b] text-lg">Use anytime, no rush</p>
            </div>
            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-2">Any Service</h3>
              <p className="text-[#86868b] text-lg">Fully flexible for all cleaning needs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Form */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <form onSubmit={handlePurchase}>
          {error && (
            <div className="mb-8 apple-card bg-red-50 border-2 border-red-200 p-6 flex items-center gap-4">
              <svg className="w-8 h-8 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-semibold text-lg">{error}</p>
            </div>
          )}

          {/* Amount Selection */}
          <div className="apple-card p-8 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mb-6">
              1. Select Amount
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {GIFT_CARD_AMOUNTS.map(option => {
                const bonus = calculateBonus(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(option.value);
                      setUseCustom(false);
                    }}
                    className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                      !useCustom && selectedAmount === option.value
                        ? 'border-brand-gold bg-brand-gold/10 shadow-lg'
                        : 'border-gray-200 hover:border-brand-gold/50 bg-white shadow-sm'
                    }`}
                  >
                    <div className="text-3xl md:text-4xl font-bold text-[#1D1D1F]">
                      {option.label}
                    </div>
                    <div className="text-sm text-[#86868b] mt-2">
                      +${bonus.toFixed(2)} bonus
                    </div>
                    <div className="text-xl font-semibold text-brand-gold mt-2">
                      = ${(option.value + bonus).toFixed(2)}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="customAmount"
                checked={useCustom}
                onChange={(e) => setUseCustom(e.target.checked)}
                className="w-6 h-6 rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3]"
              />
              <label htmlFor="customAmount" className="font-semibold text-lg text-[#1D1D1F]">
                Enter custom amount
              </label>
            </div>

            {useCustom && (
              <div className="mt-6">
                <div className="relative">
                  <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-3xl font-bold text-[#86868b]">
                    $
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="input pl-12 text-3xl font-bold"
                    placeholder="Enter amount"
                    min="50"
                    max="5000"
                    step="10"
                  />
                </div>
                {customAmount && parseFloat(customAmount) >= 50 && (
                  <div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg text-[#1D1D1F] font-medium">You Pay:</span>
                      <span className="text-3xl font-bold text-[#1D1D1F]">${customAmount}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-lg text-[#1D1D1F] font-medium">Bonus (15%):</span>
                      <span className="text-2xl font-semibold text-brand-gold">
                        +${calculateBonus(parseFloat(customAmount)).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t-2 border-green-300 my-4"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-[#1D1D1F]">Total Value:</span>
                      <span className="text-4xl font-bold text-brand-gold">
                        ${(parseFloat(customAmount) + calculateBonus(parseFloat(customAmount))).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Gift Option */}
          <div className="apple-card p-8 mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <label className="flex items-start gap-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
                className="w-6 h-6 rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3] mt-1"
              />
              <div>
                <span className="text-2xl font-bold text-[#1D1D1F] block mb-2">
                  This is a gift for someone else
                </span>
                <p className="text-[#86868b] leading-relaxed">
                  We'll email the gift card directly to the recipient with your personalized message
                </p>
              </div>
            </label>
          </div>

          {/* Your Details */}
          <div className="apple-card p-8 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mb-6">
              2. Your Details
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-base font-semibold text-[#1D1D1F] mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={purchaserName}
                  onChange={(e) => setPurchaserName(e.target.value)}
                  className="input"
                  placeholder="John Smith"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-[#1D1D1F] mb-2">
                  Your Email *
                </label>
                <input
                  type="email"
                  value={purchaserEmail}
                  onChange={(e) => setPurchaserEmail(e.target.value)}
                  className="input"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-[#1D1D1F] mb-2">
                  Your Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={purchaserPhone}
                  onChange={(e) => setPurchaserPhone(formatPhoneNumber(e.target.value))}
                  className="input"
                  placeholder="0412-345-678"
                />
              </div>
            </div>
          </div>

          {/* Recipient Details (if gift) */}
          {isGift && (
            <div className="apple-card p-8 mb-8 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mb-6">
                3. Recipient Details
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-base font-semibold text-[#1D1D1F] mb-2">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="input"
                    placeholder="Jane Doe"
                    required={isGift}
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-[#1D1D1F] mb-2">
                    Recipient Email *
                  </label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="input"
                    placeholder="jane@example.com"
                    required={isGift}
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-[#1D1D1F] mb-2">
                    Gift Message (Optional)
                  </label>
                  <textarea
                    value={giftMessage}
                    onChange={(e) => setGiftMessage(e.target.value)}
                    className="input resize-none"
                    rows={4}
                    placeholder="Happy Birthday! Enjoy a sparkling clean home on me! ❤️"
                    maxLength={500}
                  />
                  <p className="text-sm text-[#86868b] mt-2">
                    {giftMessage.length}/500 characters
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Purchase Summary */}
          <div className="apple-card p-8 mb-8 bg-gradient-to-br from-[#1D1D1F] to-gray-900 text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Purchase Summary</h2>
            <div className="space-y-5">
              <div className="flex justify-between items-center text-lg md:text-xl">
                <span className="text-white/90">Amount Paid:</span>
                <span className="font-bold text-2xl md:text-3xl">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg md:text-xl">
                <span className="text-white/90">Bonus Credit (15%):</span>
                <span className="font-bold text-2xl md:text-3xl text-brand-gold">
                  +${bonusAmount.toFixed(2)}
                </span>
              </div>
              <div className="border-t-2 border-white/20 my-6"></div>
              <div className="flex justify-between items-center">
                <span className="text-xl md:text-2xl font-semibold">Total Gift Card Value:</span>
                <span className="text-4xl md:text-5xl font-bold text-brand-gold">
                  ${totalValue.toFixed(2)}
                </span>
              </div>
            </div>

            {isGift && (
              <div className="mt-8 pt-6 border-t-2 border-white/20">
                <p className="text-base text-white/90">
                  📧 Gift card will be emailed to:{' '}
                  <strong className="text-white">{recipientEmail || 'recipient@example.com'}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Purchase Button */}
          <button
            type="submit"
            disabled={loading || amount < 50}
            className="btn-primary w-full py-6 text-xl md:text-2xl font-bold shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-3xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-7 w-7" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `🎁 Purchase Gift Card - $${amount.toFixed(2)}`
            )}
          </button>

          {/* Terms */}
          <div className="mt-8 apple-card p-6 bg-[#F5F5F7]">
            <p className="text-sm text-[#86868b] leading-relaxed">
              <strong className="text-[#1D1D1F]">Terms & Conditions:</strong> Gift cards never expire. Non-refundable.
              Can be used for any Clean Up Bros service. Card will be activated after payment
              confirmation. You'll receive a confirmation email with the gift card code.
              {isGift && ' The recipient will receive a separate email with the gift card details.'}
            </p>
          </div>
        </form>

        {/* Back Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigateTo('Landing')}
            className="text-[#0071e3] hover:text-[#0077ED] font-semibold text-lg transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftCardPurchaseView;
