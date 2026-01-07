import React, { useState } from 'react';
import { NavigationProps } from '../types';
import { verifyGiftCard, getGiftCardByCode, GiftCard } from '../services/giftCardService';

export const CheckBalanceView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [giftCard, setGiftCard] = useState<GiftCard | null>(null);

  const formatCode = (value: string) => {
    // Format as CLEAN-XXXX-XXXX
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
    return cleaned.slice(0, 15);
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGiftCard(null);

    try {
      const result = await verifyGiftCard(code);

      if (result.success && result.giftCard) {
        setGiftCard(result.giftCard);
      } else {
        // Try to get the card anyway to show status
        const card = await getGiftCardByCode(code);
        if (card) {
          setGiftCard(card);
          if (card.status === 'pending') {
            setError('This gift card is pending payment activation.');
          } else if (card.status === 'redeemed') {
            setError('This gift card has been fully redeemed.');
          } else if (card.current_balance <= 0) {
            setError('This gift card has a zero balance.');
          }
        } else {
          setError(result.error || 'Gift card not found. Please check the code and try again.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'redeemed': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#F5F5F7] to-white">
      {/* GIFT CARD Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920)',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A]/90 via-[#1A1A1A]/80 to-[#C8FF00]/20" />

        {/* Floating Orbs */}
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-[#C8FF00]/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-[#C8FF00]/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 py-16">
          {/* Gift Card Icon */}
          <div className="mx-auto mb-6 w-20 h-20 rounded-2xl bg-[#C8FF00]/20 border border-[#C8FF00]/30 flex items-center justify-center backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#C8FF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8FF00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C8FF00]"></span>
            </span>
            <span className="text-[#C8FF00] font-bold tracking-widest text-sm uppercase">
              Check Balance
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Your Clean Up Bros <span className="text-[#C8FF00]">Credit</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Enter your gift card code below
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C8FF00]">10%</div>
              <div className="text-white/60 text-sm">Bonus Credit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C8FF00]">Never</div>
              <div className="text-white/60 text-sm">Expires</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C8FF00]">Instant</div>
              <div className="text-white/60 text-sm">Activation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Check Form */}
      <div className="max-w-2xl mx-auto px-4 py-12 -mt-8 relative z-20">
        <div className="apple-card p-8 shadow-2xl">
          <form onSubmit={handleCheck}>
            <div className="mb-6">
              <label className="block text-lg font-semibold text-[#1D1D1F] mb-3">
                Gift Card Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(formatCode(e.target.value))}
                placeholder="CLEAN-XXXX-XXXX"
                className="w-full px-6 py-4 text-2xl font-mono text-center tracking-widest bg-[#F5F5F7] border-2 border-transparent rounded-xl focus:bg-white focus:border-[#0071e3] focus:ring-0 outline-none transition-all uppercase"
                maxLength={15}
              />
              <p className="text-sm text-[#86868b] mt-2 text-center">
                Find your code in the gift card email
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length < 10}
              className="w-full bg-gradient-to-r from-[#F2B705] to-[#E5A600] text-[#1D1D1F] py-4 text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Balance'}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-700 font-medium text-center">{error}</p>
            </div>
          )}

          {/* Gift Card Result */}
          {giftCard && (
            <div className="mt-8 animate-fade-in-up">
              {/* Visual Gift Card */}
              <div className="bg-gradient-to-br from-[#1D1D1F] to-[#333] rounded-2xl p-8 shadow-2xl text-white mb-6">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-[#F2B705] font-bold text-sm">CLEAN UP BROS</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(giftCard.status)}`}>
                    {giftCard.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-center my-8">
                  <p className="text-white/60 text-sm mb-2">CURRENT BALANCE</p>
                  <p className="text-5xl md:text-6xl font-bold">
                    ${giftCard.current_balance.toFixed(2)}
                  </p>
                </div>

                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-white/60 text-xs mb-1">GIFT CARD CODE</p>
                  <p className="text-xl font-bold tracking-wider">{giftCard.code}</p>
                </div>
              </div>

              {/* Card Details */}
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-[#F5F5F7] rounded-xl">
                  <span className="text-[#86868b]">Original Amount</span>
                  <span className="font-bold text-[#1D1D1F]">${giftCard.original_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#F5F5F7] rounded-xl">
                  <span className="text-[#86868b]">Bonus Credit</span>
                  <span className="font-bold text-[#F2B705]">+${giftCard.bonus_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-[#F5F5F7] rounded-xl">
                  <span className="text-[#86868b]">Total Value</span>
                  <span className="font-bold text-[#1D1D1F]">${(giftCard.original_amount + giftCard.bonus_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <span className="text-green-700 font-medium">Available to Spend</span>
                  <span className="font-bold text-2xl text-green-700">${giftCard.current_balance.toFixed(2)}</span>
                </div>
              </div>

              {/* CTA */}
              {giftCard.status === 'active' && giftCard.current_balance > 0 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => navigateTo('Landing')}
                    className="bg-gradient-to-r from-[#0071e3] to-[#0077ED] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Book a Cleaning Service
                  </button>
                  <p className="text-sm text-[#86868b] mt-3">
                    Use code <strong className="text-[#1D1D1F]">{giftCard.code}</strong> at checkout
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigateTo('Landing')}
            className="text-[#0071e3] hover:text-[#0077ED] font-semibold transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-[#1D1D1F] text-center mb-8">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <div className="apple-card p-6">
            <h3 className="font-bold text-[#1D1D1F] mb-2">How do I redeem my gift card?</h3>
            <p className="text-[#86868b]">Book any cleaning service on our website and enter your gift card code at checkout. The balance will be automatically applied to your order.</p>
          </div>

          <div className="apple-card p-6">
            <h3 className="font-bold text-[#1D1D1F] mb-2">Does my gift card expire?</h3>
            <p className="text-[#86868b]">No! Clean Up Bros gift cards never expire. Use your balance whenever you're ready.</p>
          </div>

          <div className="apple-card p-6">
            <h3 className="font-bold text-[#1D1D1F] mb-2">What if my order costs more than my balance?</h3>
            <p className="text-[#86868b]">You can pay the remaining amount using any payment method. If your balance exceeds the order total, the remaining credit stays on your card for future use.</p>
          </div>

          <div className="apple-card p-6">
            <h3 className="font-bold text-[#1D1D1F] mb-2">Can I check my transaction history?</h3>
            <p className="text-[#86868b]">Contact us at cleanupbros.au@gmail.com or call 0406 764 585 for detailed transaction history.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckBalanceView;
