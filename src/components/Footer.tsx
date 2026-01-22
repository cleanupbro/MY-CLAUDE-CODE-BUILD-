import React, { useEffect, useRef, useState } from 'react';
import { ViewType, ServiceType } from '../types';

// Scroll reveal hook for animations
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

export const Footer: React.FC<{ navigateTo: (view: ViewType) => void; onGetQuote?: () => void }> = ({ navigateTo, onGetQuote }) => {
  const ctaReveal = useScrollReveal();
  const linksReveal = useScrollReveal();

  return (
    <footer className="bg-black text-white relative z-20">
      {/* CTA Section - Apple Style with Animations */}
      <section ref={ctaReveal.ref} className="py-12 px-6 border-b border-white/10">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-700 ${ctaReveal.isVisible ? 'animate-slide-up' : ''}`}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-4">
            Ready to shine?
          </h2>
          <p className="text-xl md:text-2xl text-[#86868B] mb-8 max-w-2xl mx-auto">
            Get your instant quote in 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onGetQuote ? onGetQuote() : navigateTo('Services')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0066CC] text-white text-lg font-medium rounded-full hover:bg-[#0077ED] transition-all duration-300 hover:scale-[1.02] animate-pulse-subtle shadow-[0_0_30px_rgba(0,102,204,0.4)] hover:shadow-[0_0_50px_rgba(0,102,204,0.6)]"
            >
              Get a Quote
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <a
              href="tel:+61406764585"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[#2997FF] text-lg font-medium rounded-full hover:bg-white/5 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us
            </a>
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <div ref={linksReveal.ref} className="py-16 px-6">
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${linksReveal.isVisible ? 'animate-slide-up' : ''}`}>
          {/* Top Row - Logo & Navigation Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-white/10">

            {/* Brand Column - Wider on large screens */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 lg:row-span-1 mb-4 lg:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo.png"
                  alt="Clean Up Bros"
                  className="h-10 w-10 object-contain"
                />
                <span className="text-xl font-semibold">Clean Up Bros</span>
              </div>
              <p className="text-[#86868B] text-sm leading-relaxed max-w-xs">
                Professional cleaning services across Liverpool and Western Sydney. Family-run since 2023.
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Services</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => navigateTo(ServiceType.Residential)}
                    className="text-[#86868B] hover:text-white transition-colors text-sm"
                  >
                    Residential
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo(ServiceType.Commercial)}
                    className="text-[#86868B] hover:text-white transition-colors text-sm"
                  >
                    Commercial
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo(ServiceType.Airbnb)}
                    className="text-[#86868B] hover:text-white transition-colors text-sm"
                  >
                    Airbnb
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('GiftCardPurchase')}
                    className="text-[#86868B] hover:text-white transition-colors text-sm"
                  >
                    Gift Cards
                  </button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => navigateTo('About')}
                    className="text-[#86868B] hover:text-white transition-colors text-sm"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('Reviews')}
                    className="text-[#86868B] hover:text-white transition-colors text-sm"
                  >
                    Reviews
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo(ServiceType.Jobs)}
                    className="text-[#86868B] hover:text-white transition-colors text-sm"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('Contact')}
                    className="text-[#86868B] hover:text-white transition-colors text-sm"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigateTo('AdminLogin')}
                    className="text-[#86868B] hover:text-white transition-colors text-sm"
                  >
                    Admin Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Contact</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="tel:+61406764585"
                    className="text-[#86868B] hover:text-white transition-colors text-sm"
                  >
                    0406 764 585
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:cleanupbros.au@gmail.com"
                    className="text-[#86868B] hover:text-white transition-colors text-sm break-all"
                  >
                    cleanupbros.au@gmail.com
                  </a>
                </li>
                <li className="text-[#86868B] text-sm">
                  Liverpool, NSW 2170
                </li>
              </ul>
            </div>

            {/* Trust */}
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">Trust</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-[#86868B] text-sm">
                  <svg className="w-4 h-4 text-[#30D158]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Fully Insured
                </li>
                <li className="flex items-center gap-2 text-[#86868B] text-sm">
                  <svg className="w-4 h-4 text-[#FFD60A]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  4.9 Rating
                </li>
                <li className="flex items-center gap-2 text-[#86868B] text-sm">
                  <svg className="w-4 h-4 text-[#0066CC]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ABN Registered
                </li>
                <li className="pt-2">
                  <img
                    src="/ndis-logo.jpg"
                    alt="We Love NDIS"
                    className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[#6E6E73] text-xs">
              © {new Date().getFullYear()} Clean Up Bros. ABN 26 443 426 374.
            </div>

            <div className="text-[#6E6E73] text-xs">
              Liverpool & Western Sydney
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => navigateTo('CheckBalance')}
                className="text-[#6E6E73] hover:text-white transition-colors text-xs"
              >
                Check Gift Card
              </button>
              <button
                onClick={() => navigateTo('ClientFeedback')}
                className="text-[#6E6E73] hover:text-white transition-colors text-xs"
              >
                Feedback
              </button>
              <button
                onClick={() => navigateTo('AdminLogin')}
                className="text-[#6E6E73] hover:text-white transition-colors text-xs"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
