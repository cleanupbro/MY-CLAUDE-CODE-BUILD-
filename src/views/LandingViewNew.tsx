import React, { useState, useEffect, useRef } from 'react';
import { ViewType, ServiceType } from '../types';

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
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleServiceClick = (type: ServiceType, view: ViewType) => {
    if (setServiceType) setServiceType(type);
    navigateTo(view);
  };

  const testimonials = [
    { name: 'Sarah M.', location: 'Liverpool', text: 'Got my entire bond back. These guys are absolute legends!', rating: 5 },
    { name: 'James K.', location: 'Parramatta', text: 'Our office has never looked this good. Staff love coming to work now.', rating: 5 },
    { name: 'Emma L.', location: 'Cabramatta', text: 'Same-day Airbnb turnover. 5-star reviews from guests ever since.', rating: 5 },
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
    },
  ];

  const suburbs = [
    'Liverpool', 'Cabramatta', 'Casula', 'Moorebank', 'Prestons', 'Edmondson Park',
    'Ingleburn', 'Glenfield', 'Leppington', 'Carnes Hill', 'Hoxton Park', 'Green Valley',
    'Campbelltown', 'Parramatta', 'Bankstown', 'Fairfield', 'Blacktown', 'Penrith'
  ];

  const whyChooseUs = [
    { icon: ShieldIcon, title: 'Fully Insured', description: 'Complete peace of mind with comprehensive coverage' },
    { icon: CheckBadgeIcon, title: 'Police Checked', description: 'Every team member is verified and trustworthy' },
    { icon: ClockIcon, title: 'Same Day Service', description: 'Need us today? We\'re there.' },
    { icon: SparklesIcon, title: 'Bond Back Guarantee', description: '100% of your bond back or we re-clean free' },
    { icon: HeartIcon, title: 'Family Owned', description: 'Local Liverpool business, community focused' },
    { icon: StarIcon, title: '4.9 Star Rating', description: '500+ happy customers can\'t be wrong' },
  ];

  // Scroll reveal refs
  const heroReveal = useScrollReveal();
  const servicesReveal = useScrollReveal();
  const statsReveal = useScrollReveal();
  const testimonialsReveal = useScrollReveal();
  const whyUsReveal = useScrollReveal();
  const areasReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  return (
    <div className="bg-black min-h-screen">

      {/* ==================== HERO SECTION ==================== */}
      <section
        ref={heroReveal.ref}
        className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80)' }}
        />
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-[#0D0D0D]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(0,102,204,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(41,151,255,0.05),transparent_50%)]" />

        <div className={`relative z-10 text-center max-w-5xl mx-auto transition-all duration-1000 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#30D158]/10 border border-[#30D158]/30 rounded-full mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
            </span>
            <span className="text-[#30D158] text-sm font-medium">Liverpool's #1 Rated Cleaning Service</span>
          </div>

          {/* Main Headline - Apple Style */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-[0.95] mb-4">
            Clean Up Bros
          </h1>
          <p className="text-2xl md:text-4xl lg:text-5xl font-semibold text-[#86868B] mb-6">
            Clean. Beyond.
          </p>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Premium cleaning for homes, offices, and Airbnbs across Western Sydney.
            Same-day quotes. Bond-back guarantee. No excuses.
          </p>

          {/* CTA Buttons - Apple Pattern */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigateTo('Services')}
              className="
                px-8 py-4
                bg-[#0066CC] text-white
                text-lg font-semibold
                rounded-full
                hover:bg-[#0077ED]
                transition-all duration-300
                hover:scale-[1.02]
                active:scale-[0.98]
                shadow-[0_0_30px_rgba(0,102,204,0.4)]
                hover:shadow-[0_0_40px_rgba(0,102,204,0.6)]
              "
            >
              Get Instant Quote
            </button>
            <a
              href="tel:+61406764585"
              className="
                px-8 py-4
                text-[#2997FF] text-lg font-medium
                hover:underline
                transition-colors
              "
            >
              Call Now
            </a>
          </div>

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

      {/* ==================== SERVICES SECTION ==================== */}
      <section
        ref={servicesReveal.ref}
        className="py-16 px-6 bg-black"
      >
        <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-100 ${servicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Our Services</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              Pick Your Clean.
            </h2>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <button
                key={service.title}
                onClick={() => handleServiceClick(service.type, service.view)}
                className="
                  group
                  bg-[#1C1C1E] rounded-[20px] overflow-hidden
                  text-left
                  border border-transparent
                  hover:border-[#2997FF]/30
                  transition-all duration-300
                  hover:scale-[1.02]
                  hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)]
                "
                style={{ transitionDelay: `${index * 100}ms` }}
              >
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

      {/* ==================== WHY CHOOSE US - DARK GLASS SECTION ==================== */}
      <section
        ref={whyUsReveal.ref}
        className="py-16 px-6 bg-black"
      >
        <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-100 ${whyUsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
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
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-[#2997FF]" />
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
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-100 ${testimonialsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              What Our Clients Say.
            </h2>
          </div>

          {/* Testimonial Card */}
          <div className="bg-gradient-to-br from-[#1C1C1E] to-[#0D0D0D] rounded-[24px] p-8 md:p-12 border border-white/10">
            {/* Quote */}
            <div className="relative mb-8">
              <span className="absolute -top-4 -left-2 text-8xl text-[#2997FF] opacity-20 font-serif">"</span>
              <p className="text-2xl md:text-3xl text-white font-medium leading-relaxed pl-8">
                {testimonials[activeTestimonial].text}
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#2997FF] rounded-full flex items-center justify-center text-xl font-bold text-black">
                {testimonials[activeTestimonial].name.charAt(0)}
              </div>
              <div>
                <h4 className="text-white font-semibold">{testimonials[activeTestimonial].name}</h4>
                <p className="text-[#86868B]">{testimonials[activeTestimonial].location}</p>
              </div>
              <div className="ml-auto flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-[#2997FF] fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`
                    h-2 rounded-full transition-all duration-300
                    ${index === activeTestimonial ? 'w-8 bg-[#2997FF]' : 'w-2 bg-white/20 hover:bg-white/40'}
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICE AREAS ==================== */}
      <section
        ref={areasReveal.ref}
        className="py-16 px-6 bg-[#0D0D0D]"
      >
        <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-100 ${areasReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Service Areas</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Cleaning Services Across <span className="text-[#2997FF]">Liverpool & Western Sydney</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Professional end of lease, bond, commercial, and Airbnb cleaning across all Western Sydney suburbs.
            </p>
          </div>

          {/* Suburb Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {suburbs.map((suburb, i) => (
              <div
                key={suburb}
                className="
                  bg-white/5 border border-white/10
                  rounded-xl px-4 py-3
                  text-center text-white/80 text-sm font-medium
                  hover:bg-[#0066CC]/10 hover:border-[#0066CC]/30
                  transition-all duration-200
                  cursor-default
                "
              >
                {suburb}
              </div>
            ))}
          </div>

          {/* SEO Text */}
          <p className="text-center text-white/40 text-sm mt-12 max-w-4xl mx-auto leading-relaxed">
            Clean Up Bros provides professional cleaning services including end of lease cleaning, bond cleaning, vacate cleaning, commercial cleaning, office cleaning, and Airbnb turnover cleaning. We proudly serve Liverpool, Cabramatta, Casula, Moorebank, Prestons, Edmondson Park, Ingleburn, Glenfield, Leppington, Carnes Hill, Hoxton Park, Green Valley, Campbelltown, Parramatta, Bankstown, Fairfield, and all Western Sydney suburbs. 100% bond back guarantee on all end of lease cleans.
          </p>
        </div>
      </section>

      {/* ==================== FINAL CTA ==================== */}
      <section
        ref={ctaReveal.ref}
        className="py-20 px-6 bg-[#0066CC] relative overflow-hidden"
      >
        {/* Background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[20vw] font-bold text-black/5 whitespace-nowrap">CLEAN</span>
        </div>

        <div className={`relative z-10 text-center max-w-3xl mx-auto transition-all duration-1000 delay-100 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6">
            Ready for a Fresh Start?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Get your instant quote in 60 seconds. No obligations, no hidden fees.
          </p>
          <button
            onClick={() => navigateTo('Services')}
            className="
              inline-flex items-center gap-3
              px-10 py-5
              bg-black text-white
              text-xl font-semibold
              rounded-full
              hover:bg-[#1C1C1E]
              transition-all duration-300
              hover:scale-[1.02]
              active:scale-[0.98]
              shadow-[0_16px_48px_rgba(0,0,0,0.3)]
            "
          >
            Get Your Free Quote
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </section>
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

export default LandingViewNew;
