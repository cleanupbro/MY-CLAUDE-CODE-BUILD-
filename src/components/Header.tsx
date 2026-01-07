import React, { useState, useEffect } from 'react';
import { ViewType, ServiceType } from '../types';

interface HeaderProps {
  navigateTo: (view: ViewType) => void;
  isAdminLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ navigateTo, isAdminLoggedIn = false, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (view: ViewType) => {
    setMobileMenuOpen(false);
    navigateTo(view);
  };

  return (
    <>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');

        .header-dark {
          --lime: #C8FF00;
          --charcoal: #1A1A1A;
          --charcoal-light: #2D2D2D;
        }

        .header-dark .font-clash {
          font-family: 'Clash Display', sans-serif;
        }

        .header-dark .cta-glow {
          position: relative;
          overflow: hidden;
        }

        .header-dark .cta-glow::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }

        .header-dark .cta-glow:hover::before {
          left: 100%;
        }

        /* INTENSE Rainbow CTA Glow - Multi-Color Blinking */
        @keyframes rainbow-pulse {
          0% {
            box-shadow: 0 0 20px rgba(200, 255, 0, 0.8),
                        0 0 40px rgba(200, 255, 0, 0.5),
                        0 0 60px rgba(200, 255, 0, 0.3);
            transform: scale(1);
            border-color: #C8FF00;
          }
          25% {
            box-shadow: 0 0 25px rgba(255, 107, 74, 0.9),
                        0 0 50px rgba(255, 107, 74, 0.6),
                        0 0 75px rgba(255, 107, 74, 0.4);
            transform: scale(1.02);
            border-color: #FF6B4A;
          }
          50% {
            box-shadow: 0 0 30px rgba(0, 212, 255, 0.9),
                        0 0 60px rgba(0, 212, 255, 0.6),
                        0 0 90px rgba(0, 212, 255, 0.4);
            transform: scale(1.05);
            border-color: #00D4FF;
          }
          75% {
            box-shadow: 0 0 25px rgba(255, 0, 128, 0.9),
                        0 0 50px rgba(255, 0, 128, 0.6),
                        0 0 75px rgba(255, 0, 128, 0.4);
            transform: scale(1.02);
            border-color: #FF0080;
          }
          100% {
            box-shadow: 0 0 20px rgba(200, 255, 0, 0.8),
                        0 0 40px rgba(200, 255, 0, 0.5),
                        0 0 60px rgba(200, 255, 0, 0.3);
            transform: scale(1);
            border-color: #C8FF00;
          }
        }

        .header-dark .cta-rainbow-pulse {
          animation: rainbow-pulse 2s ease-in-out infinite;
          border: 2px solid #C8FF00;
        }
      `}</style>

      <header
        className={`header-dark fixed top-0 left-0 right-0 z-[100] bg-[#1A1A1A] border-b transition-all duration-300 ${
          isScrolled ? 'shadow-lg shadow-black/30 border-transparent' : 'border-white/10'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={() => navigateTo('Landing')}
            className="text-left focus:outline-none transition-colors flex items-center gap-3"
          >
            <img
              src="/logo.png"
              alt="Clean Up Bros"
              className="h-10 w-auto object-contain"
            />
            <span className="font-clash text-lg font-bold text-white tracking-tight hidden sm:inline">
              Clean Up Bros
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigateTo('Landing')}
              className="text-[15px] font-medium text-white/70 hover:text-[#C8FF00] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('Services')}
              className="text-[15px] font-medium text-white/70 hover:text-[#C8FF00] transition-colors"
            >
              Services
            </button>

            {/* Public navigation */}
            {!isAdminLoggedIn && (
              <>
                <button
                  onClick={() => navigateTo('GiftCardPurchase')}
                  className="text-[15px] font-semibold text-[#C8FF00] hover:text-[#9ACC00] transition-colors"
                >
                  Gift Cards
                </button>
                <button
                  onClick={() => navigateTo('About')}
                  className="text-[15px] font-medium text-white/70 hover:text-[#C8FF00] transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => navigateTo('Reviews')}
                  className="text-[15px] font-medium text-white/70 hover:text-[#C8FF00] transition-colors"
                >
                  Reviews
                </button>
                <button
                  onClick={() => navigateTo('Contact')}
                  className="hidden lg:block text-[15px] font-medium text-white/70 hover:text-[#C8FF00] transition-colors"
                >
                  Contact
                </button>
                <button
                  onClick={() => navigateTo('AdminLogin')}
                  className="hidden lg:block text-[15px] font-medium text-white/40 hover:text-white/70 transition-colors"
                >
                  Admin
                </button>
              </>
            )}

            {/* Admin navigation */}
            {isAdminLoggedIn && (
              <>
                <button
                  onClick={() => navigateTo('AdminDashboard')}
                  className="text-[15px] font-semibold text-[#C8FF00] hover:text-[#9ACC00] transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigateTo('AdminGiftCards')}
                  className="text-[15px] font-semibold text-[#00D4FF] hover:text-[#00A8CC] transition-colors"
                >
                  Gift Cards
                </button>
                <button
                  onClick={() => navigateTo('AdminContracts')}
                  className="hidden lg:block text-[15px] font-medium text-white/70 hover:text-[#C8FF00] transition-colors"
                >
                  Contracts
                </button>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="hidden lg:block text-[15px] font-medium text-[#FF6B4A] hover:text-[#FF4A2A] transition-colors"
                  >
                    Logout
                  </button>
                )}
              </>
            )}

            {/* CTA Button - RAINBOW PULSE */}
            <a
              href="tel:+61406764585"
              className="cta-glow cta-rainbow-pulse inline-flex items-center gap-2 bg-[#C8FF00] text-[#1A1A1A] text-[15px] font-bold px-6 py-3 hover:bg-[#9ACC00] transition-all hover:-translate-y-1 uppercase tracking-wide"
            >
              Get Quote
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </nav>

          {/* Mobile: CTA + Hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <a
              href="tel:+61406764585"
              className="cta-rainbow-pulse sm:inline-flex hidden items-center bg-[#C8FF00] text-[#1A1A1A] text-[14px] font-bold px-4 py-2 hover:bg-[#9ACC00] transition-all uppercase"
            >
              Quote
            </a>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[150] md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-16 right-0 w-[300px] h-[calc(100vh-64px)] bg-[#1A1A1A] border-l border-white/10 shadow-xl z-[200] transform transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col p-5 space-y-1">
          {/* Public Menu Items */}
          {!isAdminLoggedIn && (
            <>
              <button
                onClick={() => handleNavigate('Landing')}
                className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium text-white/80 hover:bg-white/5 hover:text-[#C8FF00] rounded-lg transition-colors text-left"
              >
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </button>
              <button
                onClick={() => handleNavigate('Services')}
                className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium text-white/80 hover:bg-white/5 hover:text-[#C8FF00] rounded-lg transition-colors text-left"
              >
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Services
              </button>
              <button
                onClick={() => handleNavigate('GiftCardPurchase')}
                className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-semibold text-[#C8FF00] hover:bg-[#C8FF00]/10 rounded-lg transition-colors text-left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                Gift Cards
              </button>
              <button
                onClick={() => handleNavigate('About')}
                className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium text-white/80 hover:bg-white/5 hover:text-[#C8FF00] rounded-lg transition-colors text-left"
              >
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About Us
              </button>
              <button
                onClick={() => handleNavigate('Reviews')}
                className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium text-white/80 hover:bg-white/5 hover:text-[#C8FF00] rounded-lg transition-colors text-left"
              >
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Reviews
              </button>
              <button
                onClick={() => handleNavigate('Contact')}
                className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium text-white/80 hover:bg-white/5 hover:text-[#C8FF00] rounded-lg transition-colors text-left"
              >
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact
              </button>

              <div className="border-t border-white/10 my-3" />

              <button
                onClick={() => handleNavigate('AdminLogin')}
                className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium text-white/40 hover:bg-white/5 hover:text-white/70 rounded-lg transition-colors text-left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Admin Login
              </button>
            </>
          )}

          {/* Admin Menu Items */}
          {isAdminLoggedIn && (
            <>
              <button
                onClick={() => handleNavigate('AdminDashboard')}
                className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-semibold text-[#C8FF00] hover:bg-[#C8FF00]/10 rounded-lg transition-colors text-left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Dashboard
              </button>
              <button
                onClick={() => handleNavigate('AdminGiftCards')}
                className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-semibold text-[#00D4FF] hover:bg-[#00D4FF]/10 rounded-lg transition-colors text-left"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                Gift Cards
              </button>
              <button
                onClick={() => handleNavigate('AdminContracts')}
                className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium text-white/80 hover:bg-white/5 hover:text-[#C8FF00] rounded-lg transition-colors text-left"
              >
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Contracts
              </button>
              <button
                onClick={() => handleNavigate('Services')}
                className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium text-white/80 hover:bg-white/5 hover:text-[#C8FF00] rounded-lg transition-colors text-left"
              >
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Services
              </button>

              <div className="border-t border-white/10 my-3" />

              {onLogout && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-3.5 text-[15px] font-medium text-[#FF6B4A] hover:bg-[#FF6B4A]/10 rounded-lg transition-colors text-left"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              )}
            </>
          )}

          {/* Call Now Button in Mobile Menu - RAINBOW PULSE */}
          <div className="pt-4 mt-2">
            <a
              href="tel:+61406764585"
              className="cta-rainbow-pulse flex items-center justify-center gap-2 w-full bg-[#C8FF00] text-[#1A1A1A] text-[15px] font-bold px-4 py-4 hover:bg-[#9ACC00] transition-colors uppercase tracking-wide"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Now
            </a>
          </div>
        </nav>
      </div>
    </>
  );
};
