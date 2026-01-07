
import React from 'react';
import { Card } from '../components/Card';
import { NavigationProps } from '../types';

interface SubmissionSuccessProps extends NavigationProps {
  message: string;
  referenceId?: string;
}

const SubmissionSuccessView: React.FC<SubmissionSuccessProps> = ({ navigateTo, message, referenceId }) => {
  // Use passed reference ID or fallback to a generated one if missing (shouldn't happen with new logic)
  const displayId = referenceId || `REF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  const referralLink = `https://cleanupbros.com.au?ref=${displayId}`;
  const [copied, setCopied] = React.useState(false);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full">
      {/* CELEBRATION Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1920)',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A]/90 via-[#1A1A1A]/70 to-[#C8FF00]/20" />

        {/* Floating Orbs */}
        <div className="absolute top-10 left-20 w-40 h-40 rounded-full bg-[#C8FF00]/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-[#C8FF00]/25 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#C8FF00]/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 py-16">
          {/* Large Animated Checkmark */}
          <div className="relative mx-auto mb-8">
            {/* Glow Effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-[#C8FF00]/30 blur-2xl animate-pulse"></div>
            </div>
            {/* Outer Ring */}
            <div className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-[#C8FF00] to-[#9ACD32] p-1 animate-bounce" style={{ animationDuration: '2s' }}>
              <div className="w-full h-full rounded-full bg-[#1A1A1A] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-14 w-14 text-[#C8FF00]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8FF00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C8FF00]"></span>
            </span>
            <span className="text-[#C8FF00] font-bold tracking-widest text-sm uppercase">
              Success!
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            You're All <span className="text-[#C8FF00]">Set</span>!
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Your request has been received successfully
          </p>
        </div>
      </section>

      {/* Card Section */}
      <div className="max-w-xl mx-auto px-4 py-12 -mt-8 relative z-20">
        <Card className="bg-white border-t-4 border-green-500 shadow-2xl">
          <div className="animate-fade-in-up">
            <h2 className="text-3xl font-bold text-brand-navy mb-2 text-center">
              Booking Confirmed
            </h2>

            <p className="text-gray-500 text-sm uppercase tracking-wide font-semibold mb-6 text-center">
              REQUEST RECEIVED SUCCESSFULLY
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
               <p className="text-gray-700 font-medium text-lg mb-2 text-center">
                 {message}
               </p>
               <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">
                 <p className="mb-2">A confirmation email has been sent to your inbox.</p>
                 <p className="bg-white inline-block px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                    Reference ID: <span className="font-mono font-bold text-brand-navy text-base">{displayId}</span>
                 </p>
               </div>
            </div>

            {/* Referral Program */}
            <div className="bg-gradient-to-r from-brand-gold/10 to-brand-navy/10 rounded-xl p-6 mb-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🎁</div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Get $50 Credit!</h3>
                <p className="text-gray-700 text-sm">
                  Refer a friend and you BOTH get $50 off your next clean!
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 mb-3 flex items-center gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 text-sm text-gray-700 bg-transparent outline-none select-all"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button
                  onClick={copyReferralLink}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-brand-gold text-white hover:bg-brand-gold/90'
                  }`}
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Share this link with friends. When they book, you both save $50!
              </p>
            </div>

            <button
              onClick={() => navigateTo('Landing')}
              className="w-full btn-primary"
            >
              Return to Home
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SubmissionSuccessView;
