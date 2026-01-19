
import React, { useState, useEffect, useRef } from 'react';
import { NavigationProps } from '../types';

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

interface SubmissionSuccessProps extends NavigationProps {
  message: string;
  referenceId?: string;
}

const SubmissionSuccessView: React.FC<SubmissionSuccessProps> = ({ navigateTo, message, referenceId }) => {
  const displayId = referenceId || `REF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  const referralLink = `https://cleanupbros.com.au?ref=${displayId}`;
  const [copied, setCopied] = useState(false);

  const heroSection = useScrollReveal();
  const cardSection = useScrollReveal();
  const ctaSection = useScrollReveal();

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-black min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1920)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />

        {/* Animated Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#30D158]/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#0066CC]/15 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Hero Content */}
        <div
          ref={heroSection.ref}
          className={`relative z-10 text-center px-6 py-16 max-w-4xl mx-auto transition-all duration-1000 ${
            heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Animated Success Icon */}
          <div className="relative mx-auto mb-8">
            {/* Glow Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-[#30D158]/30 blur-2xl animate-pulse"></div>
            </div>
            {/* Success Circle */}
            <div className="relative w-24 h-24 mx-auto rounded-full bg-[#30D158]/20 border-2 border-[#30D158] flex items-center justify-center">
              <svg className="w-12 h-12 text-[#30D158]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
            </span>
            <span className="text-[#30D158] text-sm font-semibold uppercase tracking-wider">
              Success!
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
            You're All <span className="text-[#30D158]">Set</span>!
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Your request has been received successfully
          </p>
        </div>
      </section>

      {/* CONFIRMATION CARD SECTION */}
      <section className="bg-[#0D0D0D] py-16 -mt-8 relative z-20">
        <div
          ref={cardSection.ref}
          className={`max-w-xl mx-auto px-6 transition-all duration-1000 ${
            cardSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Main Confirmation Card */}
          <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 border-t-4 border-t-[#30D158]">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">Booking Confirmed</h2>
              <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider">
                Request Received Successfully
              </p>
            </div>

            {/* Message Box */}
            <div className="bg-[#2C2C2E] rounded-xl p-6 mb-6 border border-white/10">
              <p className="text-white text-center mb-4">{message}</p>
              <div className="pt-4 border-t border-white/10 text-center">
                <p className="text-white/60 text-sm mb-3">A confirmation email has been sent to your inbox.</p>
                <div className="inline-block bg-[#1C1C1E] px-4 py-3 rounded-xl border border-white/10">
                  <span className="text-white/60 text-sm">Reference ID: </span>
                  <span className="font-mono font-bold text-[#2997FF]">{displayId}</span>
                </div>
              </div>
            </div>

            {/* Referral Program */}
            <div className="bg-gradient-to-br from-[#0066CC]/20 to-[#30D158]/10 rounded-xl p-6 border border-[#2997FF]/20">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-[#FFD60A]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#FFD60A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Get $50 Credit!</h3>
                <p className="text-white/60 text-sm">
                  Refer a friend and you BOTH get $50 off your next clean!
                </p>
              </div>

              <div className="bg-[#2C2C2E] rounded-xl p-3 mb-3 flex items-center gap-2 border border-white/10">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 text-sm text-white/70 bg-transparent outline-none select-all"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button
                  onClick={copyReferralLink}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    copied
                      ? 'bg-[#30D158] text-white'
                      : 'bg-[#0066CC] text-white hover:bg-[#0077ED]'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <p className="text-xs text-white/40 text-center">
                Share this link with friends. When they book, you both save $50!
              </p>
            </div>

            {/* Return Button */}
            <button
              onClick={() => navigateTo('Landing')}
              className="w-full mt-6 px-8 py-4 bg-[#0066CC] text-white text-lg font-semibold rounded-xl hover:bg-[#0077ED] transition-all shadow-[0_0_30px_rgba(0,102,204,0.3)]"
            >
              Return to Home
            </button>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        ref={ctaSection.ref}
        className={`bg-[#0066CC] py-16 transition-all duration-1000 ${
          ctaSection.isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Need Help or Have Questions?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Our team is here to assist you with anything you need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+61406764585"
              className="px-8 py-4 bg-white text-[#0066CC] text-lg font-semibold rounded-full hover:bg-white/90 transition-all"
            >
              Call Us: 0406 764 585
            </a>
            <button
              onClick={() => navigateTo('Contact')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SubmissionSuccessView;
