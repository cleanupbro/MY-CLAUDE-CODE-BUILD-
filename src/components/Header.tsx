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
      setIsScrolled(window.scrollY > 20);
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
      {/* Apple iPhone 17 Pro Style - Floating Pill Navigation */}
      <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4 px-4">
        <nav
          className={`
            flex items-center gap-1 px-2 py-2
            bg-black/80 backdrop-blur-2xl
            rounded-full
            border transition-all duration-500
            ${isScrolled
              ? 'border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
              : 'border-white/10'
            }
          `}
        >
          {/* Logo */}
          <button
            onClick={() => navigateTo('Landing')}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5 transition-colors"
          >
            <img
              src="/logo.png"
              alt="Clean Up Bros"
              className="h-8 w-8 object-contain"
            />
            <span className="hidden sm:inline font-semibold text-white text-sm tracking-tight">
              Clean Up Bros
            </span>
          </button>

          {/* Desktop Navigation Pills */}
          <div className="hidden md:flex items-center gap-1">
            {/* Public Navigation */}
            {!isAdminLoggedIn && (
              <>
                <NavPill onClick={() => navigateTo('Services')}>Services</NavPill>
                <NavPill onClick={() => navigateTo('About')}>About</NavPill>
                <NavPill onClick={() => navigateTo('Reviews')}>Reviews</NavPill>

                {/* We're Hiring Badge with Live Blinker */}
                <button
                  onClick={() => navigateTo(ServiceType.Jobs)}
                  className="
                    flex items-center gap-2 px-4 py-2
                    rounded-full text-sm font-medium
                    text-[#30D158] hover:bg-[#30D158]/10
                    transition-all duration-200
                  "
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
                  </span>
                  We're Hiring!
                </button>

                <NavPill
                  onClick={() => navigateTo('GiftCardPurchase')}
                  highlight
                >
                  Gift Cards
                </NavPill>
              </>
            )}

            {/* Admin Navigation */}
            {isAdminLoggedIn && (
              <>
                <NavPill onClick={() => navigateTo('AdminDashboard')} highlight>
                  Dashboard
                </NavPill>
                <NavPill onClick={() => navigateTo('AdminGiftCards')}>
                  Gift Cards
                </NavPill>
                <NavPill onClick={() => navigateTo('AdminContracts')}>
                  Contracts
                </NavPill>
                {onLogout && (
                  <NavPill onClick={onLogout} danger>
                    Logout
                  </NavPill>
                )}
              </>
            )}
          </div>

          {/* CTA Button - Primary Action */}
          <button
            onClick={() => navigateTo('Services')}
            className="
              ml-1 px-5 py-2.5
              bg-[#0066CC] text-white
              text-sm font-semibold
              rounded-full
              hover:bg-[#0077ED]
              transition-all duration-200
              hover:scale-[1.02]
              active:scale-[0.98]
              shadow-[0_0_20px_rgba(0,102,204,0.3)]
              hover:shadow-[0_0_30px_rgba(0,102,204,0.5)]
            "
          >
            Get Quote
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors ml-1"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[150] md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer - Apple Style */}
      <div
        className={`
          fixed top-20 left-4 right-4
          bg-black/95 backdrop-blur-2xl
          rounded-3xl
          border border-white/10
          shadow-[0_16px_64px_rgba(0,0,0,0.5)]
          z-[200]
          transform transition-all duration-300 ease-out
          md:hidden
          ${mobileMenuOpen
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
          }
        `}
      >
        <nav className="flex flex-col p-4">
          {/* Public Menu Items */}
          {!isAdminLoggedIn && (
            <>
              <MobileNavItem
                icon={<HomeIcon />}
                onClick={() => handleNavigate('Landing')}
              >
                Home
              </MobileNavItem>
              <MobileNavItem
                icon={<ServicesIcon />}
                onClick={() => handleNavigate('Services')}
              >
                Services
              </MobileNavItem>
              <MobileNavItem
                icon={<GiftIcon />}
                onClick={() => handleNavigate('GiftCardPurchase')}
                highlight
              >
                Gift Cards
              </MobileNavItem>
              <MobileNavItem
                icon={<InfoIcon />}
                onClick={() => handleNavigate('About')}
              >
                About Us
              </MobileNavItem>
              <MobileNavItem
                icon={<StarIcon />}
                onClick={() => handleNavigate('Reviews')}
              >
                Reviews
              </MobileNavItem>
              <MobileNavItem
                icon={<MailIcon />}
                onClick={() => handleNavigate('Contact')}
              >
                Contact
              </MobileNavItem>

              {/* We're Hiring - Mobile */}
              <button
                onClick={() => handleNavigate(ServiceType.Jobs)}
                className="
                  flex items-center gap-3 px-4 py-3.5
                  text-[15px] font-medium
                  rounded-xl text-left
                  text-[#30D158] hover:bg-[#30D158]/10
                  transition-colors
                "
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#30D158]"></span>
                </span>
                We're Hiring!
              </button>

              <div className="h-px bg-white/10 my-3" />

              <MobileNavItem
                icon={<LockIcon />}
                onClick={() => handleNavigate('AdminLogin')}
                muted
              >
                Admin Login
              </MobileNavItem>
            </>
          )}

          {/* Admin Menu Items */}
          {isAdminLoggedIn && (
            <>
              <MobileNavItem
                icon={<DashboardIcon />}
                onClick={() => handleNavigate('AdminDashboard')}
                highlight
              >
                Dashboard
              </MobileNavItem>
              <MobileNavItem
                icon={<GiftIcon />}
                onClick={() => handleNavigate('AdminGiftCards')}
              >
                Gift Cards
              </MobileNavItem>
              <MobileNavItem
                icon={<ContractIcon />}
                onClick={() => handleNavigate('AdminContracts')}
              >
                Contracts
              </MobileNavItem>
              <MobileNavItem
                icon={<ServicesIcon />}
                onClick={() => handleNavigate('Services')}
              >
                Services
              </MobileNavItem>

              <div className="h-px bg-white/10 my-3" />

              {onLogout && (
                <MobileNavItem
                  icon={<LogoutIcon />}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  danger
                >
                  Logout
                </MobileNavItem>
              )}
            </>
          )}

          {/* Call Now Button */}
          <a
            href="tel:+61406764585"
            className="
              mt-4 flex items-center justify-center gap-2
              w-full py-4
              bg-[#0066CC] text-white
              font-semibold text-base
              rounded-2xl
              hover:bg-[#0077ED]
              transition-colors
              shadow-[0_0_30px_rgba(0,102,204,0.3)]
            "
          >
            <PhoneIcon />
            Call Now
          </a>
        </nav>
      </div>
    </>
  );
};

// Nav Pill Component - Desktop
interface NavPillProps {
  children: React.ReactNode;
  onClick: () => void;
  highlight?: boolean;
  danger?: boolean;
}

const NavPill: React.FC<NavPillProps> = ({ children, onClick, highlight, danger }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-full text-sm font-medium
      transition-all duration-200
      ${highlight
        ? 'text-[#2997FF] hover:bg-[#2997FF]/10'
        : danger
          ? 'text-[#FF453A] hover:bg-[#FF453A]/10'
          : 'text-white/70 hover:text-white hover:bg-white/5'
      }
    `}
  >
    {children}
  </button>
);

// Mobile Nav Item Component
interface MobileNavItemProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  highlight?: boolean;
  danger?: boolean;
  muted?: boolean;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({
  children, icon, onClick, highlight, danger, muted
}) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-3 px-4 py-3.5
      text-[15px] font-medium
      rounded-xl
      transition-colors text-left
      ${highlight
        ? 'text-[#2997FF] hover:bg-[#2997FF]/10'
        : danger
          ? 'text-[#FF453A] hover:bg-[#FF453A]/10'
          : muted
            ? 'text-white/40 hover:text-white/60 hover:bg-white/5'
            : 'text-white/80 hover:text-white hover:bg-white/5'
      }
    `}
  >
    <span className={highlight ? 'text-[#2997FF]' : danger ? 'text-[#FF453A]' : 'text-white/50'}>
      {icon}
    </span>
    {children}
  </button>
);

// Icons
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ServicesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const GiftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ContractIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
