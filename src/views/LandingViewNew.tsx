import React, { useState, useEffect, useRef } from 'react';
import { ViewType, ServiceType } from '../types';
import { QuickQuoteModal } from '../components/QuickQuoteModal';
import { StickyMobileCTA } from '../components/StickyMobileCTA';
import { ExitIntentPopup, useExitIntent } from '../components/ExitIntentPopup';
import { RecentBookingToast } from '../components/RecentBookingToast';
// Newsletter popup moved to App.tsx for cross-page functionality
import { getAvailableSlots, subscribeToSlots } from '../utils/slotsManager';

interface LandingViewProps {
  navigateTo: (view: ViewType) => void;
  setServiceType?: (type: ServiceType) => void;
  onSubmissionFail?: () => void;
}

// Animated counter component with intersection observer
const Counter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({
  end, suffix = '', duration = 2000
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Scroll reveal hook
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

export const LandingViewNew: React.FC<LandingViewProps> = ({ navigateTo, setServiceType }) => {
  const [showQuickQuote, setShowQuickQuote] = useState(false);
  const { showExitPopup, closeExitPopup } = useExitIntent();
  // Newsletter popup handled in App.tsx

  // Slots left counter - synced with booking popup via shared manager
  const [slotsLeft, setSlotsLeft] = useState(() => getAvailableSlots());

  useEffect(() => {
    // Subscribe to slot changes from other components (like booking popup)
    const unsubscribe = subscribeToSlots((newSlots) => {
      setSlotsLeft(newSlots);
    });

    // Also check periodically in case localStorage was updated elsewhere
    const interval = setInterval(() => {
      setSlotsLeft(getAvailableSlots());
    }, 10000); // Check every 10 seconds

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Testimonials are now displayed in a grid, no rotation needed

  const handleServiceClick = (type: ServiceType, view: ViewType) => {
    if (setServiceType) setServiceType(type);
    navigateTo(view);
  };

  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'Liverpool',
      text: 'Got my entire bond back. These guys are absolute legends! The team was professional and thorough.',
      rating: 5,
      service: 'End of Lease',
      verified: true,
      avatar: 'S'
    },
    {
      name: 'James K.',
      location: 'Parramatta',
      text: 'Our office has never looked this good. Staff love coming to work now. Highly recommend!',
      rating: 5,
      service: 'Commercial',
      verified: true,
      avatar: 'J'
    },
    {
      name: 'Emma L.',
      location: 'Cabramatta',
      text: 'Same-day Airbnb turnover. 5-star reviews from guests ever since. Reliable and fast!',
      rating: 5,
      service: 'Airbnb',
      verified: true,
      avatar: 'E'
    },
  ];

  const services = [
    {
      title: 'Residential',
      subtitle: 'Home Cleaning',
      description: 'Regular, deep clean, or end-of-lease. We make homes sparkle.',
      type: ServiceType.Residential,
      view: ServiceType.Residential,
      icon: HomeIcon,
      price: 'From $120',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      badge: null,
      availability: 'Available Today',
    },
    {
      title: 'Commercial',
      subtitle: 'Office & Business',
      description: 'Daily, weekly, or contract-based cleaning for any workspace.',
      type: ServiceType.Commercial,
      view: ServiceType.Commercial,
      icon: BuildingIcon,
      price: 'From $150',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      badge: null,
      availability: 'Available Today',
    },
    {
      title: 'Airbnb',
      subtitle: 'Turnover Service',
      description: 'Same-day turnovers. 5-star guest ready, every time.',
      type: ServiceType.Airbnb,
      view: ServiceType.Airbnb,
      icon: PlaneIcon,
      price: 'From $80',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
      badge: 'MOST POPULAR',
      availability: 'Available Today',
    },
  ];

  const whyChooseUs = [
    { emoji: '🛡️', title: 'Fully Insured', description: 'Complete peace of mind with comprehensive coverage' },
    { emoji: '✅', title: 'Police Checked', description: 'Every team member is verified and trustworthy' },
    { emoji: '⚡', title: 'Same Day Service', description: 'Need us today? We\'re there.' },
    { emoji: '💯', title: 'Bond Back Guarantee', description: '100% of your bond back or we re-clean free' },
    { emoji: '❤️', title: 'Family Owned', description: 'Local Liverpool business, community focused' },
    { emoji: '⭐', title: '4.9 Star Rating', description: '500+ happy customers can\'t be wrong' },
  ];

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Before/After gallery - now showing all 3 in grid

  const beforeAfterImages = [
    {
      title: 'Living Room Transformation',
      image: '/images/before-after/living-room-1-before-after.webp',
      type: 'split', // Single image with before/after split
    },
    {
      title: 'Bedroom Revival',
      image: '/images/before-after/bedroom-before-after.webp',
      type: 'split',
    },
    {
      title: 'Deep Clean Makeover',
      image: '/images/before-after/living-room-3-before-after.webp',
      type: 'split',
    },
  ];

  const pricingData = [
    { service: '1BR End of Lease', price: '$250', originalPrice: '$295', includes: 'Full clean + oven + windows', badge: '15% OFF' },
    { service: '2BR End of Lease', price: '$350', originalPrice: '$412', includes: 'Everything + carpet steam', badge: '15% OFF' },
    { service: '3BR End of Lease', price: '$450', originalPrice: '$530', includes: 'Complete bond clean package', badge: '15% OFF' },
    { service: 'Airbnb Turnover', price: '$120', includes: 'Linen change + restock ready', badge: 'POPULAR' },
    { service: 'Office (Weekly)', price: '$200', includes: 'Custom schedule available', badge: null },
  ];

  const faqData = [
    {
      question: "What's included in end-of-lease cleaning?",
      answer: "Our end-of-lease clean includes all rooms dusted and vacuumed, floors mopped, kitchen deep clean (oven, rangehood, appliances), bathroom sanitisation, window sills and tracks, light switches and door handles, cobweb removal, and skirting boards. Add-ons like carpet steam cleaning and window cleaning are available."
    },
    {
      question: "Do you bring your own supplies?",
      answer: "Yes! We bring all professional-grade cleaning supplies and equipment. You don't need to provide anything. Our eco-friendly products are safe for families and pets."
    },
    {
      question: "What if I don't get my bond back?",
      answer: "We offer a 100% bond back guarantee. If your real estate agent isn't satisfied with the clean, we'll re-clean for FREE within 24 hours. We've helped hundreds of tenants get their full bond back."
    },
    {
      question: "How quickly can you come?",
      answer: "We offer same-day and next-day service when availability permits. For guaranteed availability, we recommend booking 2-3 days in advance. Call us on 0406 764 585 for urgent bookings."
    },
    {
      question: "Do you do same-day Airbnb turnovers?",
      answer: "Absolutely! We specialize in same-day Airbnb turnovers. Our team can have your property 5-star guest-ready in as little as 2-3 hours, including linen change and restocking."
    },
  ];

  // Scroll reveal refs
  const heroReveal = useScrollReveal();
  const urgencyReveal = useScrollReveal();
  const servicesReveal = useScrollReveal();
  const howItWorksReveal = useScrollReveal();
  const beforeAfterReveal = useScrollReveal();
  const pricingReveal = useScrollReveal();
  const valueAddReveal = useScrollReveal();
  // statsReveal removed - stats now in hero section
  const testimonialsReveal = useScrollReveal();
  const whyUsReveal = useScrollReveal();
  const trustBadgesReveal = useScrollReveal();
  const faqReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  return (
    <div className="bg-black min-h-screen">

      {/* ==================== HERO SECTION ==================== */}
      <section
        ref={heroReveal.ref}
        className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden bg-mesh"
      >
        {/* Floating gradient orbs */}
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>
        {/* Background image with Ken Burns effect */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 ken-burns-bg"
          style={{ backgroundImage: 'url(/images/living-room/hero.jpeg)' }}
        />
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#0D0D0D]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(0,102,204,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(0,201,167,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(175,82,222,0.08),transparent_60%)]" />

        <div className={`relative z-10 text-center max-w-5xl mx-auto transition-all duration-1000 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#30D158]/10 border border-[#30D158]/30 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
            </span>
            <span className="text-[#30D158] text-sm font-medium">Liverpool's #1 Rated Cleaning Service</span>
          </div>

          {/* Main Headline - Gradient Style */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] mb-4">
            <span className="text-white">Clean Up</span>{' '}
            <span className="text-gradient">Bros</span>
          </h1>
          <p className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-6">
            <span className="text-white">Clean.</span>{' '}
            <span className="text-gradient-gold">Beyond.</span>
          </p>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Premium cleaning for homes, offices, and Airbnbs across Western Sydney.
            Same-day quotes. Bond-back guarantee. No excuses.
          </p>

          {/* Urgency Message */}
          <div className="mb-6 animate-pulse-subtle">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-full text-sm">
              <span className="text-[#FF453A] font-bold">🔥 Only {slotsLeft} slots left this week</span>
            </span>
          </div>

          {/* CTA Buttons - Vibrant Gradient Style */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button
              onClick={() => setShowQuickQuote(true)}
              className="
                btn-gradient
                px-10 py-5
                text-lg font-bold
                rounded-full
                transition-all duration-300
                hover:scale-[1.05]
                active:scale-[0.98]
                click-feedback
              "
            >
              ✨ Get My Free Quote Now →
            </button>
            <a
              href="tel:+61406764585"
              className="
                px-8 py-4
                text-[#2997FF] text-lg font-medium
                hover:underline
                transition-colors
                flex items-center gap-2
              "
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Now
            </a>
          </div>

          {/* No credit card micro-copy */}
          <p className="text-white/40 text-sm mb-10">No credit card required · Free quote in 60 seconds</p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-12 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-semibold text-white">
                <Counter end={500} suffix="+" />
              </div>
              <div className="text-sm text-[#86868B] uppercase tracking-wider mt-1">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-semibold text-white">
                <Counter end={100} suffix="%" />
              </div>
              <div className="text-sm text-[#86868B] uppercase tracking-wider mt-1">Bond Back Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-semibold text-white">
                4.9<span className="text-[#2997FF]">★</span>
              </div>
              <div className="text-sm text-[#86868B] uppercase tracking-wider mt-1">Google Rating</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-semibold text-white">
                <Counter end={24} />h
              </div>
              <div className="text-sm text-[#86868B] uppercase tracking-wider mt-1">Response Time</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ==================== URGENCY BANNER ==================== */}
      <section
        ref={urgencyReveal.ref}
        className="py-4 px-6 bg-gradient-to-r from-[#FF453A] via-[#FF6B35] to-[#FF453A] relative overflow-hidden"
      >
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />

        <div className={`relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 text-center transition-all duration-700 ${urgencyReveal.isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <span className="text-white font-bold text-lg md:text-xl">THIS WEEK ONLY:</span>
            <span className="text-white/90 font-semibold text-lg md:text-xl">15% OFF End-of-Lease Cleaning</span>
          </div>
          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span className="text-white font-bold">Only 3 Slots Left This Week</span>
          </div>
        </div>
      </section>

      {/* ==================== TRUST STRIP (NEW) ==================== */}
      <section className="py-4 px-6 bg-[#0A0A0A] border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 text-white/70">
            <span className="text-[#FFD60A] text-lg">★</span>
            <span className="font-semibold">4.9</span>
            <span className="text-white/50 text-sm">Google</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-white/70">
            <span className="text-[#30D158] text-lg">✓</span>
            <span className="font-semibold">500+</span>
            <span className="text-white/50 text-sm">Cleans</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-white/70">
            <span className="text-[#2997FF] text-lg">🛡️</span>
            <span className="font-semibold">100%</span>
            <span className="text-white/50 text-sm">Bond Back</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-white/70">
            <span className="text-[#FF9500] text-lg">⚡</span>
            <span className="font-semibold">Same-Day</span>
            <span className="text-white/50 text-sm">Available</span>
          </div>
        </div>
      </section>

      {/* ==================== LIVE ACTIVITY INDICATOR ==================== */}
      <section className="py-3 px-6 bg-[#0D0D0D] border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
            </span>
            <span className="text-white/60"><span className="text-white font-semibold">12 cleans</span> completed today</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="text-[#2997FF]">👥</span>
            <span className="text-white/60"><span className="text-white font-semibold">3 teams</span> available now</span>
          </div>
          <div className="hidden md:block w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="text-[#FFD60A]">⚡</span>
            <span className="text-white/60">Same-day service <span className="text-white font-semibold">available</span></span>
          </div>
        </div>
      </section>

      {/* ==================== SERVICES SECTION ==================== */}
      <section
        ref={servicesReveal.ref}
        className="py-16 px-6 bg-black"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-100 ${servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="badge-gradient text-sm mb-4">Our Services</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              Pick Your <span className="text-gradient">Clean.</span>
            </h2>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <button
                key={service.title}
                onClick={() => handleServiceClick(service.type, service.view)}
                className={`
                  group relative
                  card-neon
                  bg-[#1C1C1E] rounded-[20px] overflow-hidden
                  text-left
                  border
                  transition-all duration-300
                  hover:scale-[1.03]
                  hover-lift
                  ${service.badge
                    ? 'border-[#2997FF]/40 hover:border-[#2997FF]/60'
                    : 'border-[#2997FF]/20 hover:border-[#2997FF]/40'
                  }
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Badge */}
                {service.badge && (
                  <div className="absolute top-3 right-3 z-10 px-3 py-1 bg-[#FF9500] text-black text-[10px] font-bold rounded-full shadow-lg">
                    {service.badge}
                  </div>
                )}

                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={service.image}
                    alt={`${service.title} cleaning service`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] to-transparent" />
                  {/* Icon overlay */}
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-[#0066CC]/90 rounded-xl flex items-center justify-center">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  {/* Availability badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur rounded-full">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#30D158]"></span>
                    </span>
                    <span className="text-[10px] text-white/80 font-medium">{service.availability}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-1">{service.title}</h3>
                  <p className="text-[#86868B] text-sm mb-3">{service.subtitle}</p>
                  <p className="text-white/60 text-[15px] leading-relaxed mb-5">{service.description}</p>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <span className="text-[#2997FF] font-semibold">{service.price}</span>
                    <span className="flex items-center gap-2 text-white/60 group-hover:text-[#2997FF] transition-colors">
                      Get Quote
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section
        ref={howItWorksReveal.ref}
        className="py-20 px-6 bg-[#0D0D0D]"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-100 ${howItWorksReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="badge-gradient text-sm mb-4">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              <span className="text-gradient">3</span> Simple Steps.
            </h2>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="card-glass hover-lift p-8 text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0066CC] to-[#00C9A7] rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6 group-hover:scale-110 transition-transform shadow-glow-blue">
                1
              </div>
              <div className="w-12 h-12 bg-[#0066CC]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-6 h-6 text-[#2997FF]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Get Instant Quote</h3>
              <p className="text-white/60 text-sm leading-relaxed">Fill out our quick form in 60 seconds. No phone calls needed.</p>
            </div>

            {/* Step 2 */}
            <div className="card-glass hover-lift p-8 text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#5856D6] to-[#AF52DE] rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6 group-hover:scale-110 transition-transform shadow-glow-blue">
                2
              </div>
              <div className="w-12 h-12 bg-[#5856D6]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TruckIcon className="w-6 h-6 text-[#AF52DE]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">We Come to You</h3>
              <p className="text-white/60 text-sm leading-relaxed">Same-day service available. Our professional team arrives on time.</p>
            </div>

            {/* Step 3 */}
            <div className="card-glass hover-lift p-8 text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-[#30D158] to-[#00C9A7] rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6 group-hover:scale-110 transition-transform shadow-glow-success">
                ✓
              </div>
              <div className="w-12 h-12 bg-[#30D158]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldIcon className="w-6 h-6 text-[#30D158]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">100% Bond Back</h3>
              <p className="text-white/60 text-sm leading-relaxed">Guaranteed satisfaction or we re-clean for FREE. No questions asked.</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <button
              onClick={() => navigateTo('Services')}
              className="btn-gradient px-10 py-5 text-lg font-bold rounded-full hover:scale-[1.05] transition-all duration-300 click-feedback"
            >
              ✨ Start Your Quote Now
            </button>
          </div>
        </div>
      </section>

      {/* ==================== BEFORE / AFTER GALLERY ==================== */}
      <section
        ref={beforeAfterReveal.ref}
        className="py-20 px-6 bg-black"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-100 ${beforeAfterReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Real Results</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">
              See the Transformation.
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Don't just take our word for it. See actual before and after photos from our recent cleans.
            </p>
          </div>

          {/* Before/After Cards - Using actual cleaning transformation images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {beforeAfterImages.map((item, index) => (
              <div
                key={index}
                className="group bg-[#1C1C1E] rounded-2xl overflow-hidden border border-white/10 hover:border-[#2997FF]/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
              >
                <div className="relative h-72 overflow-hidden">
                  {/* Single split before/after image */}
                  <img
                    src={item.image}
                    alt={`${item.title} before and after cleaning`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay labels */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs font-medium text-white/90">
                    Before
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-[#30D158]/90 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                    After
                  </div>
                  {/* Center divider indicator */}
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/30 transform -translate-x-1/2" />
                </div>
                <div className="p-4 text-center bg-gradient-to-t from-[#1C1C1E] to-transparent">
                  <h3 className="text-white font-semibold">{item.title}</h3>
                  <p className="text-[#30D158] text-sm font-medium mt-1">Real Results ✓</p>
                </div>
              </div>
            ))}
          </div>

          {/* See More CTA */}
          <div className="text-center mt-10">
            <button
              onClick={() => navigateTo('Reviews')}
              className="px-6 py-3 border border-white/20 text-white font-medium rounded-full hover:border-[#2997FF] hover:text-[#2997FF] transition-all duration-300"
            >
              See More Transformations →
            </button>
          </div>
        </div>
      </section>

      {/* ==================== PRICING PREVIEW ==================== */}
      <section
        ref={pricingReveal.ref}
        className="py-20 px-6 bg-[#0D0D0D]"
      >
        <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-100 ${pricingReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Transparent Pricing</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">
              No Surprises. No Hidden Fees.
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Know what you're paying before you book. Final price confirmed after quick property assessment.
            </p>
          </div>

          {/* Pricing Table */}
          <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-6 text-white/60 text-sm font-semibold uppercase tracking-wider">Service Type</th>
                  <th className="text-center py-4 px-6 text-white/60 text-sm font-semibold uppercase tracking-wider">Starting From</th>
                  <th className="text-left py-4 px-6 text-white/60 text-sm font-semibold uppercase tracking-wider hidden md:table-cell">What's Included</th>
                </tr>
              </thead>
              <tbody>
                {pricingData.map((item, index) => (
                  <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{item.service}</span>
                        {item.badge && (
                          <span className={`
                            px-2 py-0.5 text-[10px] font-bold rounded-full
                            ${item.badge === '15% OFF'
                              ? 'bg-[#FF453A]/20 text-[#FF453A] border border-[#FF453A]/30'
                              : 'bg-[#30D158]/20 text-[#30D158] border border-[#30D158]/30'
                            }
                          `}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {item.originalPrice && (
                          <span className="text-white/40 line-through text-sm">{item.originalPrice}</span>
                        )}
                        <span className="text-[#2997FF] font-bold text-xl group-hover:text-[#30D158] transition-colors">{item.price}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white/60 text-sm hidden md:table-cell">{item.includes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA */}
          <div className="text-center mt-10">
            <button
              onClick={() => navigateTo('Services')}
              className="px-8 py-4 bg-[#0066CC] text-white text-lg font-semibold rounded-full hover:bg-[#0077ED] transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(0,102,204,0.4)]"
            >
              Get Your Exact Price
            </button>
          </div>
        </div>
      </section>

      {/* ==================== VALUE-ADD SECTION ==================== */}
      <section
        ref={valueAddReveal.ref}
        className="py-16 px-6 bg-black"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-100 ${valueAddReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Every Clean Includes <span className="text-[#30D158]">FREE</span> Extras
            </h2>
          </div>

          {/* Value Items Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#30D158]/10 border border-[#30D158]/30 rounded-2xl p-5 text-center hover:bg-[#30D158]/20 transition-colors">
              <span className="text-2xl mb-2 block">✅</span>
              <h3 className="text-white font-semibold mb-1">FREE Re-Clean</h3>
              <p className="text-white/60 text-xs">If needed within 24hrs</p>
            </div>
            <div className="bg-[#30D158]/10 border border-[#30D158]/30 rounded-2xl p-5 text-center hover:bg-[#30D158]/20 transition-colors">
              <span className="text-2xl mb-2 block">🔥</span>
              <h3 className="text-white font-semibold mb-1">FREE Oven Clean</h3>
              <p className="text-white/60 text-xs">$80 value included</p>
            </div>
            <div className="bg-[#30D158]/10 border border-[#30D158]/30 rounded-2xl p-5 text-center hover:bg-[#30D158]/20 transition-colors">
              <span className="text-2xl mb-2 block">🪟</span>
              <h3 className="text-white font-semibold mb-1">FREE Windows</h3>
              <p className="text-white/60 text-xs">Inside window cleaning</p>
            </div>
            <div className="bg-[#30D158]/10 border border-[#30D158]/30 rounded-2xl p-5 text-center hover:bg-[#30D158]/20 transition-colors">
              <span className="text-2xl mb-2 block">🧹</span>
              <h3 className="text-white font-semibold mb-1">ALL Supplies</h3>
              <p className="text-white/60 text-xs">Pro-grade included</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US - DARK GLASS SECTION ==================== */}
      <section
        ref={whyUsReveal.ref}
        className="py-16 px-6 bg-black"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-100 ${whyUsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Why Choose Us</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              We're Not Your Average Cleaners.
            </h2>
          </div>

          {/* Features Grid - Dark Glass Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {whyChooseUs.map((feature, index) => (
              <div
                key={feature.title}
                className="
                  bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-5 md:p-6
                  border border-white/10
                  hover:border-[#2997FF]/30
                  hover:bg-[#1C1C1E]
                  transition-all duration-300
                "
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0066CC]/20 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                  <span className="text-2xl md:text-3xl">{feature.emoji}</span>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">{feature.title}</h3>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section
        ref={testimonialsReveal.ref}
        className="py-16 px-6 bg-black"
      >
        <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-100 ${testimonialsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              What Our Clients Say.
            </h2>
          </div>

          {/* Total Reviews Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-[#1C1C1E]/80 border border-white/10 rounded-full">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-[#FFD60A] fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-white font-semibold">4.9</span>
              <span className="text-white/60 text-sm">from 500+ reviews</span>
            </div>
          </div>

          {/* 3-Card Testimonial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#1C1C1E] to-[#0D0D0D] rounded-[20px] p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all duration-300 hover:transform hover:-translate-y-1 group"
              >
                {/* Service Badge & Stars */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 text-xs font-semibold bg-[#0066CC]/20 text-[#2997FF] rounded-full border border-[#0066CC]/30">
                    {testimonial.service}
                  </span>
                  <div className="flex gap-0.5">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-[#FFD60A] fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <span className="absolute -top-2 -left-1 text-4xl text-[#2997FF] opacity-30 font-serif">"</span>
                  <p className="text-white/90 text-[15px] leading-relaxed pl-4">
                    {testimonial.text}
                  </p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-11 h-11 bg-gradient-to-br from-[#2997FF] to-[#0066CC] rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-semibold text-sm">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <span className="flex items-center gap-1 text-[10px] text-[#30D158]">
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[#86868B] text-xs">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* See All Reviews CTA */}
          <div className="text-center mt-10">
            <button
              onClick={() => navigateTo('Reviews')}
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-medium rounded-full hover:border-[#2997FF] hover:text-[#2997FF] transition-all duration-300 group"
            >
              See All 500+ Reviews
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== TRUST BADGES ==================== */}
      <section
        ref={trustBadgesReveal.ref}
        className="py-12 px-6 bg-black"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-100 ${trustBadgesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-8">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider">Trusted & Verified</p>
          </div>

          {/* Trust Badge Row */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3 bg-[#1C1C1E]/80 border border-white/10 rounded-2xl px-5 py-4 hover:border-[#2997FF]/30 transition-colors">
              <div className="w-10 h-10 bg-[#30D158]/20 rounded-full flex items-center justify-center">
                <ShieldIcon className="w-5 h-5 text-[#30D158]" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">$20M Insurance</p>
                <p className="text-white/50 text-xs">Public Liability</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#1C1C1E]/80 border border-white/10 rounded-2xl px-5 py-4 hover:border-[#2997FF]/30 transition-colors">
              <div className="w-10 h-10 bg-[#2997FF]/20 rounded-full flex items-center justify-center">
                <CheckBadgeIcon className="w-5 h-5 text-[#2997FF]" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">ABN Registered</p>
                <p className="text-white/50 text-xs">Legitimate Business</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#1C1C1E]/80 border border-white/10 rounded-2xl px-5 py-4 hover:border-[#2997FF]/30 transition-colors">
              <div className="w-10 h-10 bg-[#FF9F0A]/20 rounded-full flex items-center justify-center">
                <UserCheckIcon className="w-5 h-5 text-[#FF9F0A]" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Police Checked</p>
                <p className="text-white/50 text-xs">All Team Members</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#1C1C1E]/80 border border-white/10 rounded-2xl px-5 py-4 hover:border-[#2997FF]/30 transition-colors">
              <img src="/ndis-logo.jpg" alt="NDIS" className="w-10 h-10 rounded-lg object-contain" />
              <div>
                <p className="text-white font-semibold text-sm">NDIS Registered</p>
                <p className="text-white/50 text-xs">Provider</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#1C1C1E]/80 border border-white/10 rounded-2xl px-5 py-4 hover:border-[#2997FF]/30 transition-colors">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <svg key={i} className="w-4 h-4 text-[#FFD60A] fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">4.9 Google Rating</p>
                <p className="text-white/50 text-xs">500+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section
        ref={faqReveal.ref}
        className="py-20 px-6 bg-[#0D0D0D]"
      >
        <div className={`max-w-5xl mx-auto transition-all duration-1000 delay-100 ${faqReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              Common Questions.
            </h2>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <span className={`text-[#2997FF] transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-6 pb-5 text-white/60 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* More Questions CTA */}
          <div className="text-center mt-10">
            <p className="text-white/60 mb-4">Still have questions?</p>
            <a
              href="tel:+61406764585"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-medium rounded-full hover:border-[#2997FF] hover:text-[#2997FF] transition-all duration-300"
            >
              <PhoneIcon className="w-5 h-5" />
              Call 0406 764 585
            </a>
          </div>
        </div>
      </section>

      {/* ==================== FINAL CTA - PREMIUM DESIGN ==================== */}
      <section
        ref={ctaReveal.ref}
        className="py-24 px-6 bg-gradient-to-br from-[#0066CC] via-[#0052A3] to-[#003366] relative overflow-hidden"
      >
        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(41,151,255,0.2),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,102,204,0.3),transparent_50%)]" />

        {/* Background watermark text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[25vw] font-bold text-white/5 whitespace-nowrap select-none">CLEAN</span>
        </div>

        {/* Floating sparkles */}
        <div className="absolute top-10 left-[10%] w-2 h-2 bg-white/30 rounded-full animate-sparkle" style={{ animationDelay: '0s' }} />
        <div className="absolute top-20 right-[15%] w-1.5 h-1.5 bg-white/40 rounded-full animate-sparkle" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-20 left-[20%] w-2 h-2 bg-white/25 rounded-full animate-sparkle" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-30 right-[25%] w-1 h-1 bg-white/50 rounded-full animate-sparkle" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[40%] left-[5%] w-1.5 h-1.5 bg-white/35 rounded-full animate-sparkle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[8%] w-2 h-2 bg-white/30 rounded-full animate-sparkle" style={{ animationDelay: '2.5s' }} />

        <div className={`relative z-10 text-center max-w-4xl mx-auto transition-all duration-1000 delay-100 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8">
            <span className="text-white/90 text-sm font-medium">⚡ Limited Time Offer</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tight">
            Ready for a Fresh Start?
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get your instant quote in 60 seconds. No obligations, no hidden fees.
            <span className="block text-white/60 text-lg mt-2">Join 500+ happy customers in Western Sydney</span>
          </p>

          {/* Glassmorphic CTA Button */}
          <button
            onClick={() => setShowQuickQuote(true)}
            className="
              group
              inline-flex items-center gap-3
              px-12 py-6
              bg-white text-[#0066CC]
              text-xl font-bold
              rounded-full
              border border-white/50
              hover:bg-white/95
              transition-all duration-300
              hover:scale-[1.03]
              active:scale-[0.98]
              shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_60px_rgba(255,255,255,0.2)]
              hover:shadow-[0_25px_60px_rgba(0,0,0,0.4),0_0_80px_rgba(255,255,255,0.3)]
            "
          >
            Get Your Free Quote
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#30D158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#30D158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Free Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#30D158]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Same-Day Response</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== GLOBAL CONVERSION COMPONENTS ==================== */}

      {/* Quick Quote Modal */}
      <QuickQuoteModal
        isOpen={showQuickQuote}
        onClose={() => setShowQuickQuote(false)}
        onSubmit={(data) => console.log('Quick quote:', data)}
        navigateTo={navigateTo}
      />

      {/* Exit Intent Popup */}
      {showExitPopup && (
        <ExitIntentPopup
          onClose={closeExitPopup}
          onSubmit={(email: string) => console.log('Exit intent email:', email)}
        />
      )}

      {/* Newsletter Popup moved to App.tsx for cross-page functionality */}

      {/* Recent Booking Toast */}
      <RecentBookingToast />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA onQuoteClick={() => setShowQuickQuote(true)} />

      {/* CSS Animations for conversion elements */}
      <style>{`
        @keyframes cta-pulse {
          0%, 100% { box-shadow: 0 0 40px rgba(0,102,204,0.5); }
          50% { box-shadow: 0 0 60px rgba(0,102,204,0.8); }
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-cta-pulse {
          animation: cta-pulse 2s ease-in-out 3;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        @keyframes ken-burns {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-2%, -1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .ken-burns-bg {
          animation: ken-burns 20s ease-in-out infinite;
        }
        @keyframes float-sparkle {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-10px) rotate(180deg); opacity: 1; }
        }
        .animate-sparkle {
          animation: float-sparkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// ==================== ICONS ====================

const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const BuildingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const PlaneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const CheckBadgeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const TruckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17H4a1 1 0 01-1-1v-4a1 1 0 011-1h2.414a1 1 0 01.707.293L10 14.586a1 1 0 01.293.707V17a1 1 0 01-1 1H5z" />
  </svg>
);

const UserCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11l2 2 4-4" />
  </svg>
);

const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

export default LandingViewNew;
