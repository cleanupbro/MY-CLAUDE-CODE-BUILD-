import React from 'react';
import { ViewType } from '../types';

export const Footer: React.FC<{ navigateTo: (view: ViewType) => void }> = ({ navigateTo }) => {
  return (
    <footer className="bg-[#1A1A1A] text-white py-16 px-6">
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');

        .footer-dark {
          --lime: #C8FF00;
          --charcoal: #1A1A1A;
          --charcoal-light: #2D2D2D;
        }

        .footer-dark .font-clash {
          font-family: 'Clash Display', sans-serif;
        }

        .footer-dark .glow-badge {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(200, 255, 0, 0.2); }
          50% { box-shadow: 0 0 30px rgba(200, 255, 0, 0.4); }
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

        .footer-dark .cta-rainbow-pulse {
          animation: rainbow-pulse 2s ease-in-out infinite;
          border: 2px solid #C8FF00;
        }
      `}</style>

      <div className="footer-dark max-w-[1400px] mx-auto">
        {/* PROMINENT CTA Section */}
        <div className="text-center mb-16 pb-12 border-b border-white/10">
          <h3 className="font-clash text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Make Your Space Shine?
          </h3>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Get your instant quote in 60 seconds. No obligation, no hidden fees.
          </p>
          <button
            onClick={() => navigateTo('Services')}
            className="cta-rainbow-pulse inline-flex items-center gap-3 px-10 py-5 bg-[#C8FF00] text-[#1A1A1A] font-clash text-xl md:text-2xl font-bold rounded-xl hover:bg-[#D4FF33] transition-colors cursor-pointer"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            GET A QUOTE NOW
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <p className="text-white/40 text-sm mt-4">
            Free quotes for Liverpool & Western Sydney
          </p>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.png"
                alt="Clean Up Bros"
                className="h-12 w-auto object-contain"
              />
              <span className="font-clash text-2xl font-bold">Clean Up Bros</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-[280px]">
              Making spaces shine across Liverpool and Western Sydney since 2023. Family-run, community-focused.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              <div className="glow-badge flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-xs">
                <svg className="w-4 h-4 text-[#C8FF00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Fully Insured</span>
              </div>
              <div className="glow-badge flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 text-xs">
                <div className="flex">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className="w-3 h-3 text-[#C8FF00]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span>4.9 Rating</span>
              </div>
            </div>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-[#C8FF00] text-xs font-semibold uppercase tracking-wider mb-5">Services</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => navigateTo('Residential')}
                  className="text-white/70 hover:text-[#C8FF00] transition-colors text-sm"
                >
                  Residential Cleaning
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('Commercial')}
                  className="text-white/70 hover:text-[#C8FF00] transition-colors text-sm"
                >
                  Commercial Cleaning
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('Airbnb')}
                  className="text-white/70 hover:text-[#C8FF00] transition-colors text-sm"
                >
                  Airbnb Turnover
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('Services')}
                  className="text-white/70 hover:text-[#C8FF00] transition-colors text-sm"
                >
                  All Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('GiftCardPurchase')}
                  className="text-white/70 hover:text-[#C8FF00] transition-colors text-sm"
                >
                  Gift Cards
                </button>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-[#C8FF00] text-xs font-semibold uppercase tracking-wider mb-5">Company</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => navigateTo('About')}
                  className="text-white/70 hover:text-[#C8FF00] transition-colors text-sm"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('Reviews')}
                  className="text-white/70 hover:text-[#C8FF00] transition-colors text-sm"
                >
                  Reviews
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('Jobs')}
                  className="text-white/70 hover:text-[#C8FF00] transition-colors text-sm"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('Contact')}
                  className="text-white/70 hover:text-[#C8FF00] transition-colors text-sm"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('ClientFeedback')}
                  className="text-white/70 hover:text-[#C8FF00] transition-colors text-sm"
                >
                  Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-[#C8FF00] text-xs font-semibold uppercase tracking-wider mb-5">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+61406764585"
                  className="text-white/70 hover:text-[#C8FF00] transition-colors text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  0406 764 585
                </a>
              </li>
              <li>
                <a
                  href="mailto:cleanupbros.au@gmail.com"
                  className="text-white/70 hover:text-[#C8FF00] transition-colors text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  cleanupbros.au@gmail.com
                </a>
              </li>
              <li className="text-white/50 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Liverpool, NSW 2170
              </li>
              <li className="text-white/40 text-xs pt-2">
                ABN: 26 443 426 374
              </li>
            </ul>

            {/* NDIS Badge */}
            <div className="mt-6">
              <img
                src="/ndis-logo.jpg"
                alt="We Love NDIS"
                className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white/40 text-xs">
            © {new Date().getFullYear()} Clean Up Bros. All rights reserved.
          </div>

          <div className="text-white/60 text-sm">
            Making Your Space Shine ✨
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigateTo('CheckBalance')}
              className="text-white/40 hover:text-white/70 transition-colors text-xs"
            >
              Check Balance
            </button>
            <button
              onClick={() => navigateTo('AdminLogin')}
              className="text-white/40 hover:text-white/70 transition-colors text-xs"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
