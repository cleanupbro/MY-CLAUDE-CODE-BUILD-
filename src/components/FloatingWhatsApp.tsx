import React, { useState, useEffect } from 'react';

export const FloatingWhatsApp: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  // Show button after scroll or delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Stop pulsing after a few seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsPulsing(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const whatsappUrl = "https://wa.me/61406764585?text=Hi!%20I%20need%20a%20cleaning%20quote";

  if (!isVisible) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-3
        bg-[#25D366] hover:bg-[#20BD5A]
        text-white font-semibold
        rounded-full
        shadow-[0_4px_20px_rgba(37,211,102,0.4)]
        hover:shadow-[0_6px_30px_rgba(37,211,102,0.6)]
        transition-all duration-300
        hover:scale-105
        group
        ${isPulsing ? 'animate-pulse-glow-whatsapp' : ''}
      `}
      style={{
        animation: isVisible ? 'slideInUp 0.5s ease-out' : 'none',
      }}
      aria-label="Chat on WhatsApp"
    >
      {/* Button with icon only on mobile, text on desktop */}
      <div className="flex items-center gap-2 px-4 py-3 md:px-5 md:py-3">
        {/* WhatsApp Icon */}
        <svg
          className="w-6 h-6 md:w-7 md:h-7"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>

        {/* Text - hidden on small screens */}
        <span className="hidden md:inline text-sm font-bold">
          Chat with us
        </span>
      </div>

      {/* Tooltip on hover (mobile only shows on long press) */}
      <div className="
        absolute bottom-full right-0 mb-2
        hidden group-hover:md:block
        bg-black/90 text-white text-xs
        px-3 py-2 rounded-lg
        whitespace-nowrap
        before:absolute before:top-full before:right-4
        before:border-4 before:border-transparent before:border-t-black/90
      ">
        Get instant quote via WhatsApp
      </div>

      {/* Pulse ring effect */}
      {isPulsing && (
        <>
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" style={{ animationDelay: '0.5s' }} />
        </>
      )}
    </a>
  );
};

// Add keyframes to global styles via a style tag
const WhatsAppStyles = () => (
  <style>{`
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse-glow-whatsapp {
      0%, 100% {
        box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
      }
      50% {
        box-shadow: 0 6px 35px rgba(37, 211, 102, 0.7);
      }
    }

    .animate-pulse-glow-whatsapp {
      animation: pulse-glow-whatsapp 2s ease-in-out infinite;
    }
  `}</style>
);

// Export with styles
export const FloatingWhatsAppWithStyles: React.FC = () => (
  <>
    <WhatsAppStyles />
    <FloatingWhatsApp />
  </>
);

export default FloatingWhatsApp;
