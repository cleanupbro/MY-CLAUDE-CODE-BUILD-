import React, { useState, useEffect } from 'react';

interface NewsletterPopupProps {
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export const NewsletterPopup: React.FC<NewsletterPopupProps> = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit(email);
      setIsSubmitted(true);
      // Auto-close after showing success
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  return (
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-300
        ${isExiting ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`
          relative bg-gradient-to-br from-[#1C1C1E] to-[#0D0D0D] rounded-[28px] p-8 max-w-md w-full
          border border-white/10
          shadow-[0_20px_60px_rgba(0,0,0,0.5)]
          transition-all duration-300
          ${isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        `}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0066CC] to-[#2997FF] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-white mb-2">
                Get Exclusive Deals 🎉
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Subscribe to our newsletter and get <span className="text-[#30D158] font-semibold">10% OFF</span> your first clean, plus exclusive tips and offers!
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="
                    w-full px-5 py-4
                    bg-white/5 border border-white/10 rounded-xl
                    text-white placeholder-white/40
                    focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20
                    transition-all duration-200
                  "
                  required
                />
              </div>

              <button
                type="submit"
                className="
                  w-full py-4
                  bg-[#0066CC] text-white
                  font-semibold rounded-xl
                  hover:bg-[#0077ED]
                  transition-all duration-200
                  hover:shadow-[0_0_30px_rgba(0,102,204,0.4)]
                "
              >
                Subscribe & Get 10% Off
              </button>
            </form>

            {/* Privacy note */}
            <p className="text-white/40 text-xs text-center mt-4">
              🔒 No spam, ever. Unsubscribe anytime.
            </p>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#30D158]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#30D158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">You're In! 🎉</h3>
            <p className="text-white/60 text-sm">
              Check your email for your 10% discount code!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Form pages where popup should NOT appear
const FORM_PAGES = [
  'Residential', 'Commercial', 'Airbnb', 'Jobs',
  'ClientFeedback', 'GiftCardPurchase', 'Success',
  'AdminLogin', 'AdminDashboard', 'AdminGiftCards',
  'AirbnbContract', 'BasicContract', 'CommercialInvoice', 'AdminContracts'
];

// Hook to manage recurring newsletter popup (every 2-3 minutes)
// Does NOT show on form pages
export const useNewsletterPopup = (currentView: string) => {
  const [showPopup, setShowPopup] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(Date.now());

  // Check if user is on a form page
  const isOnFormPage = FORM_PAGES.includes(currentView);

  useEffect(() => {
    // Check if user already subscribed
    const subscribed = localStorage.getItem('newsletterSubscribed');
    if (subscribed) {
      setHasSubscribed(true);
      return;
    }

    // Don't run timer if on form page or already subscribed
    if (isOnFormPage || hasSubscribed) return;

    // Random delay between 2-3 minutes (120000 - 180000ms)
    const getRandomDelay = () => 120000 + Math.random() * 60000;

    let timer: NodeJS.Timeout;

    const schedulePopup = () => {
      timer = setTimeout(() => {
        // Only show if user has been active (scrolled in last 5 minutes)
        // and not on a form page
        const timeSinceScroll = Date.now() - lastScrollTime;
        if (timeSinceScroll < 300000 && !isOnFormPage) {
          setShowPopup(true);
        } else {
          // Reschedule if inactive
          schedulePopup();
        }
      }, getRandomDelay());
    };

    // Track scroll activity
    const handleScroll = () => {
      setLastScrollTime(Date.now());
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    schedulePopup();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOnFormPage, hasSubscribed, lastScrollTime]);

  // Reset timer and close popup when view changes to form
  useEffect(() => {
    if (isOnFormPage && showPopup) {
      setShowPopup(false);
    }
  }, [isOnFormPage, showPopup]);

  const closePopup = () => setShowPopup(false);

  const markSubscribed = () => {
    setHasSubscribed(true);
    localStorage.setItem('newsletterSubscribed', 'true');
    setShowPopup(false);
  };

  return { showPopup, closePopup, markSubscribed };
};

export default NewsletterPopup;
