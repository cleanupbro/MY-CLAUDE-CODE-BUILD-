import React, { useState, useEffect, useRef } from 'react';
import { NavigationProps } from '../types';
import { verifyGiftCard, getGiftCardByCode, GiftCard } from '../services/giftCardService';

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

export const CheckBalanceView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [giftCard, setGiftCard] = useState<GiftCard | null>(null);

  const heroSection = useScrollReveal();
  const formSection = useScrollReveal();
  const faqSection = useScrollReveal();

  const formatCode = (value: string) => {
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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/30';
      case 'pending': return 'bg-[#FFD60A]/20 text-[#FFD60A] border-[#FFD60A]/30';
      case 'redeemed': return 'bg-white/10 text-white/60 border-white/20';
      default: return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920)' }}
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
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-[#0066CC]/20 border border-[#2997FF]/30 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-8 h-8 text-[#2997FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
            </span>
            <span className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider">
              Gift Card Balance
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
            Check Your <span className="text-[#2997FF]">Balance</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Enter your gift card code to see your available credit
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#2997FF]">10%</div>
              <div className="text-white/40 text-sm">Bonus Credit</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#2997FF]">Never</div>
              <div className="text-white/40 text-sm">Expires</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#2997FF]">Instant</div>
              <div className="text-white/40 text-sm">Lookup</div>
            </div>
          </div>
        </div>
      </section>

      {/* CHECK FORM SECTION */}
      <section className="bg-[#0D0D0D] py-16">
        <div
          ref={formSection.ref}
          className={`max-w-xl mx-auto px-6 transition-all duration-1000 delay-200 ${
            formSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Form Container */}
          <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <form onSubmit={handleCheck}>
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">
                  Gift Card Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(formatCode(e.target.value))}
                  placeholder="CLEAN-XXXX-XXXX"
                  className="w-full px-6 py-4 text-xl font-mono text-center tracking-widest bg-[#2C2C2E] border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 outline-none transition-all uppercase"
                  maxLength={15}
                />
                <p className="text-sm text-white/40 mt-3 text-center">
                  Find your code in the gift card email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || code.length < 10}
                className="w-full px-8 py-4 bg-[#0066CC] text-white text-lg font-semibold rounded-xl hover:bg-[#0077ED] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,102,204,0.3)]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Checking...
                  </span>
                ) : 'Check Balance'}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-xl">
                <p className="text-[#FF453A] font-medium text-center">{error}</p>
              </div>
            )}

            {/* Gift Card Result */}
            {giftCard && (
              <div className="mt-8 animate-fade-in-up">
                {/* Visual Gift Card */}
                <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-2xl p-6 border border-white/10 mb-6">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[#2997FF] font-semibold text-sm">CLEAN UP BROS</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(giftCard.status)}`}>
                      {giftCard.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-center my-8">
                    <p className="text-white/40 text-sm mb-2">CURRENT BALANCE</p>
                    <p className="text-5xl font-semibold text-white">
                      ${giftCard.current_balance.toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-white/40 text-xs mb-1">GIFT CARD CODE</p>
                    <p className="text-lg font-semibold text-white tracking-wider">{giftCard.code}</p>
                  </div>
                </div>

                {/* Card Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-4 bg-[#2C2C2E] rounded-xl">
                    <span className="text-white/60">Original Amount</span>
                    <span className="font-semibold text-white">${giftCard.original_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-[#2C2C2E] rounded-xl">
                    <span className="text-white/60">Bonus Credit</span>
                    <span className="font-semibold text-[#30D158]">+${giftCard.bonus_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-[#2C2C2E] rounded-xl">
                    <span className="text-white/60">Total Value</span>
                    <span className="font-semibold text-white">${(giftCard.original_amount + giftCard.bonus_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-[#30D158]/10 border border-[#30D158]/30 rounded-xl">
                    <span className="text-[#30D158] font-medium">Available to Spend</span>
                    <span className="font-semibold text-2xl text-[#30D158]">${giftCard.current_balance.toFixed(2)}</span>
                  </div>
                </div>

                {/* CTA */}
                {giftCard.status === 'active' && giftCard.current_balance > 0 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => navigateTo('Landing')}
                      className="px-8 py-4 bg-[#0066CC] text-white text-lg font-semibold rounded-full hover:bg-[#0077ED] transition-all shadow-[0_0_30px_rgba(0,102,204,0.4)]"
                    >
                      Book a Cleaning Service
                    </button>
                    <p className="text-sm text-white/40 mt-3">
                      Use code <strong className="text-white">{giftCard.code}</strong> at checkout
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
              className="text-[#2997FF] hover:text-white font-medium transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-black py-20">
        <div
          ref={faqSection.ref}
          className={`max-w-3xl mx-auto px-6 transition-all duration-1000 ${
            faqSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Help</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          {/* FAQ Cards */}
          <div className="space-y-4">
            {[
              {
                question: 'How do I redeem my gift card?',
                answer: 'Book any cleaning service on our website and enter your gift card code at checkout. The balance will be automatically applied to your order.'
              },
              {
                question: 'Does my gift card expire?',
                answer: 'No! Clean Up Bros gift cards never expire. Use your balance whenever you\'re ready.'
              },
              {
                question: 'What if my order costs more than my balance?',
                answer: 'You can pay the remaining amount using any payment method. If your balance exceeds the order total, the remaining credit stays on your card for future use.'
              },
              {
                question: 'Can I check my transaction history?',
                answer: 'Contact us at cleanupbros.au@gmail.com or call 0406 764 585 for detailed transaction history.'
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all"
              >
                <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-white/60 text-[15px] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#0066CC] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Don't Have a Gift Card?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Purchase one for yourself or as a perfect gift for someone special.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigateTo('GiftCardPurchase')}
              className="px-8 py-4 bg-white text-[#0066CC] text-lg font-semibold rounded-full hover:bg-white/90 transition-all"
            >
              Buy a Gift Card
            </button>
            <button
              onClick={() => navigateTo('Landing')}
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

export default CheckBalanceView;
