import React, { useState, useEffect } from 'react';

interface StickyMobileCTAProps {
  onQuoteClick: () => void;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({ onQuoteClick }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show after scrolling 300px
      if (currentScrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`
        fixed bottom-0 left-0 right-0 z-40
        md:hidden
        bg-black/95 backdrop-blur-lg
        border-t border-white/10
        transform transition-transform duration-300 ease-out
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}
      style={{
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex items-stretch h-16 px-3 gap-2">
        {/* Main CTA - Get Quote */}
        <button
          onClick={onQuoteClick}
          className="
            flex-1 flex items-center justify-center gap-2
            bg-[#0066CC] text-white font-semibold
            rounded-xl
            hover:bg-[#0077ED]
            active:scale-[0.98]
            transition-all duration-200
            shadow-[0_0_20px_rgba(0,102,204,0.3)]
          "
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Get Free Quote
        </button>

        {/* Phone Call Button */}
        <a
          href="tel:+61406764585"
          className="
            w-16 flex items-center justify-center
            bg-[#30D158] text-white
            rounded-xl
            hover:bg-[#34C759]
            active:scale-[0.98]
            transition-all duration-200
          "
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      </div>

      {/* Micro urgency text */}
      <div className="text-center py-1 text-[10px] text-white/40 font-medium tracking-wide">
        <span className="inline-flex items-center gap-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#30D158]"></span>
          </span>
          3 teams available now
        </span>
      </div>
    </div>
  );
};

export default StickyMobileCTA;
