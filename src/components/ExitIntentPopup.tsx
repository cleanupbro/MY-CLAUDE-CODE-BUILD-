import React, { useState, useEffect } from 'react';

interface ExitIntentPopupProps {
  onClose: () => void;
  onSubmit: (email: string) => void;
}

export const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Simulate submission - in production, this would send to your backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store that user has received discount
    localStorage.setItem('cleanupbros_discount_offered', 'true');
    localStorage.setItem('cleanupbros_discount_email', email);

    setIsSubmitting(false);
    setIsSubmitted(true);
    onSubmit(email);

    // Auto close after showing success
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-[#1C1C1E] to-[#0D0D0D] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-md animate-scaleIn shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              {/* Animated hand wave */}
              <div className="text-5xl mb-4 animate-wave">
                ✋
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Wait! Don't Leave Empty-Handed
              </h2>
              <p className="text-white/60 text-sm">
                Get <span className="text-[#FF9500] font-bold">10% OFF</span> your first clean
              </p>
            </div>

            {/* Discount Badge */}
            <div className="bg-gradient-to-r from-[#FF453A]/20 to-[#FF9500]/20 border border-[#FF9500]/30 rounded-2xl p-4 mb-6 text-center">
              <div className="text-4xl font-bold text-white mb-1">
                10% <span className="text-[#FF9500]">OFF</span>
              </div>
              <p className="text-white/60 text-xs">Your first cleaning service</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email for discount code"
                  className={`
                    w-full bg-white/5 border rounded-xl px-4 py-4 text-white
                    placeholder:text-white/30 focus:outline-none focus:ring-2 transition-all
                    ${error
                      ? 'border-[#FF453A] focus:border-[#FF453A] focus:ring-[#FF453A]/20'
                      : 'border-white/10 focus:border-[#2997FF] focus:ring-[#2997FF]/20'
                    }
                  `}
                />
                {error && (
                  <p className="text-[#FF453A] text-xs mt-1">{error}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300
                  ${isSubmitting
                    ? 'bg-[#FF9500]/50 text-white/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FF453A] to-[#FF9500] text-white hover:shadow-[0_0_30px_rgba(255,149,0,0.4)] active:scale-[0.98]'
                  }
                `}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send My Discount Code'
                )}
              </button>
            </form>

            {/* No thanks link */}
            <button
              onClick={onClose}
              className="w-full mt-4 text-white/40 text-sm hover:text-white/60 transition-colors"
            >
              No thanks, I'll pay full price
            </button>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-4">
            <div className="w-20 h-20 bg-[#30D158]/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <svg className="w-10 h-10 text-[#30D158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Discount Sent!</h3>
            <p className="text-white/60 mb-4">
              Check your email for code <span className="text-[#FF9500] font-bold">FIRST10</span>
            </p>
            <p className="text-white/40 text-sm">
              Use it when you book your clean
            </p>
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-white/30 text-[10px]">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out forwards;
        }
        .animate-wave {
          animation: wave 1s ease-in-out 2;
        }
      `}</style>
    </div>
  );
};

// Hook to detect exit intent
export const useExitIntent = () => {
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    // Check if already shown this session
    const hasShown = sessionStorage.getItem('cleanupbros_exit_intent_shown');
    if (hasShown) {
      setHasTriggered(true);
      return;
    }

    // Desktop: detect mouse leaving viewport toward top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        setShowExitPopup(true);
        setHasTriggered(true);
        sessionStorage.setItem('cleanupbros_exit_intent_shown', 'true');
      }
    };

    // Mobile: detect back button or tab switch (visibility change)
    const handleVisibilityChange = () => {
      if (document.hidden && !hasTriggered) {
        // Will show when user returns
        const willShowOnReturn = true;
        if (willShowOnReturn) {
          const handleReturn = () => {
            if (!hasTriggered) {
              setShowExitPopup(true);
              setHasTriggered(true);
              sessionStorage.setItem('cleanupbros_exit_intent_shown', 'true');
            }
            document.removeEventListener('visibilitychange', handleReturn);
          };
          document.addEventListener('visibilitychange', handleReturn);
        }
      }
    };

    // Add listeners after delay (don't trigger immediately on page load)
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }, 5000); // 5 second delay before enabling

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasTriggered]);

  const closeExitPopup = () => {
    setShowExitPopup(false);
  };

  return { showExitPopup, closeExitPopup };
};

export default ExitIntentPopup;
