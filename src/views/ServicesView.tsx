import React, { useState, useEffect, useRef } from 'react';
import { NavigationProps, ServiceType } from '../types';

// Scroll reveal hook - same pattern as landing page
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

const ServicesView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const heroReveal = useScrollReveal();
  const coreServicesReveal = useScrollReveal();
  const addOnReveal = useScrollReveal();
  const howItWorksReveal = useScrollReveal();
  const whyUsReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  const services = [
    {
      title: "Residential",
      subtitle: "Home Cleaning",
      description: "Regular, deep clean, or end-of-lease. We make homes sparkle with professional care.",
      features: [
        "General cleaning & maintenance",
        "Deep cleaning services",
        "End of lease / bond cleaning",
        "Post-construction cleanup"
      ],
      price: "From $150",
      image: "/images/living-room/hero.jpeg",
      badge: null,
      action: () => navigateTo(ServiceType.Residential)
    },
    {
      title: "Commercial",
      subtitle: "Office & Business",
      description: "Daily, weekly, or contract-based cleaning for any workspace. Keep your business spotless.",
      features: [
        "Office buildings & co-working",
        "Retail stores & showrooms",
        "Medical centres & clinics",
        "Warehouses & industrial"
      ],
      price: "From $200",
      image: "/images/offices/hero.jpg",
      badge: null,
      action: () => navigateTo(ServiceType.Commercial)
    },
    {
      title: "Airbnb",
      subtitle: "Turnover Service",
      description: "Same-day turnovers. 5-star guest ready, every time. Fast and reliable.",
      features: [
        "Same-day turnovers",
        "Linen change & restocking",
        "Quality inspection reports",
        "7 days a week service"
      ],
      price: "From $120",
      image: "/images/airbnb/hero.jpeg",
      badge: "MOST POPULAR",
      action: () => navigateTo(ServiceType.Airbnb)
    }
  ];

  const addOnServices = [
    {
      title: "Carpet Steam Cleaning",
      description: "Professional steam cleaning to remove stains, odors, and allergens",
      price: "From $80",
      icon: SparklesIcon
    },
    {
      title: "Window Cleaning",
      description: "Streak-free crystal clear windows inside and out",
      price: "From $60",
      icon: WindowIcon
    },
    {
      title: "Oven & Kitchen Deep Clean",
      description: "Heavy-duty cleaning for ovens, range hoods, and appliances",
      price: "From $90",
      icon: FireIcon
    },
    {
      title: "Pressure Washing",
      description: "Driveways, patios, decks, and exterior surfaces",
      price: "From $150",
      icon: WaterIcon
    },
    {
      title: "Fridge & Freezer Clean",
      description: "Complete sanitization and organization",
      price: "From $50",
      icon: SnowflakeIcon
    },
    {
      title: "Wall Washing",
      description: "Remove marks, scuffs, and grime from walls",
      price: "From $100",
      icon: BrushIcon
    }
  ];

  const howItWorks = [
    { step: 1, title: "Get a Quote", description: "Fill out our quick form or call us for an instant estimate" },
    { step: 2, title: "Schedule", description: "Choose a date and time that works for you" },
    { step: 3, title: "We Clean", description: "Our professional team arrives and gets to work" },
    { step: 4, title: "Enjoy", description: "Relax in your spotless space!" }
  ];

  const whyChooseUs = [
    { icon: ShieldIcon, title: "Fully Insured", description: "Complete peace of mind with coverage" },
    { icon: CheckBadgeIcon, title: "Quality Guaranteed", description: "100% satisfaction or we re-clean" },
    { icon: ClockIcon, title: "Always Punctual", description: "On time, every single time" },
    { icon: LeafIcon, title: "Eco-Friendly", description: "Safe products for your family" }
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Ken Burns CSS Animation */}
      <style>{`
        @keyframes ken-burns {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-2%, -1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .ken-burns-bg {
          animation: ken-burns 20s ease-in-out infinite;
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }
        .animate-sparkle { animation: sparkle 3s ease-in-out infinite; }
        .animate-sparkle-delay-1 { animation: sparkle 3s ease-in-out 0.5s infinite; }
        .animate-sparkle-delay-2 { animation: sparkle 3s ease-in-out 1s infinite; }
        .animate-sparkle-delay-3 { animation: sparkle 3s ease-in-out 1.5s infinite; }
      `}</style>

      {/* ==================== HERO SECTION ==================== */}
      <section
        ref={heroReveal.ref}
        className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden"
      >
        {/* Background image with Ken Burns effect */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 ken-burns-bg"
          style={{ backgroundImage: 'url(/images/offices/hero.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />

        {/* Radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(0,102,204,0.08),transparent_50%)]" />

        <div className={`relative z-10 text-center max-w-5xl mx-auto transition-all duration-1000 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066CC]/10 border border-[#0066CC]/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#2997FF] rounded-full animate-pulse" />
            <span className="text-[#2997FF] text-sm font-medium">Professional Cleaning Services</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-[0.95] mb-4">
            Our Services
          </h1>
          <p className="text-2xl md:text-4xl font-semibold text-[#86868B] mb-6">
            Every Space. Perfected.
          </p>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            From homes to offices, Airbnbs to post-construction—we've mastered the art of making spaces shine.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => navigateTo('Landing')}
            className="px-8 py-4 bg-[#0066CC] text-white text-lg font-semibold rounded-full hover:bg-[#0077ED] transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(0,102,204,0.4)]"
          >
            Get Instant Quote
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ==================== CORE SERVICES ==================== */}
      <section
        ref={coreServicesReveal.ref}
        className="py-20 px-6 bg-black"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-100 ${coreServicesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Core Services</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              Pick Your Clean.
            </h2>
          </div>

          {/* Services Grid with Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <button
                key={service.title}
                onClick={service.action}
                className="group bg-[#1C1C1E] rounded-[20px] overflow-hidden text-left border border-transparent hover:border-[#2997FF]/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_16px_48px_rgba(0,0,0,0.3)]"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={`${service.title} cleaning service`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] to-transparent" />
                  {/* MOST POPULAR Badge */}
                  {service.badge && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#30D158] text-white text-xs font-bold rounded-full shadow-lg">
                      {service.badge}
                    </div>
                  )}
                  {/* Available Today indicator */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                    <span className="w-2 h-2 bg-[#30D158] rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/80 font-medium">Available Today</span>
                  </div>
                  {/* Icon overlay */}
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-[#0066CC]/90 rounded-xl flex items-center justify-center">
                    {index === 0 && <HomeIcon className="w-6 h-6 text-white" />}
                    {index === 1 && <BuildingIcon className="w-6 h-6 text-white" />}
                    {index === 2 && <PlaneIcon className="w-6 h-6 text-white" />}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-1">{service.title}</h3>
                  <p className="text-[#86868B] text-sm mb-3">{service.subtitle}</p>
                  <p className="text-white/60 text-[15px] leading-relaxed mb-4">{service.description}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-5">
                    {service.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/50">
                        <span className="text-[#2997FF]">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-[#2997FF] font-semibold text-lg">{service.price}</span>
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

      {/* ==================== ADD-ON SERVICES ==================== */}
      <section
        ref={addOnReveal.ref}
        className="py-20 px-6 bg-[#0D0D0D]"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-100 ${addOnReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Add-On Services</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">
              Enhance Your Clean.
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Specialized services to take your cleaning to the next level
            </p>
          </div>

          {/* Add-On Grid - Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOnServices.map((addon, index) => (
              <div
                key={addon.title}
                className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#2997FF]/30 hover:bg-[#1C1C1E] transition-all duration-300"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 bg-[#0066CC]/20 rounded-xl flex items-center justify-center mb-4">
                  <addon.icon className="w-6 h-6 text-[#2997FF]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{addon.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{addon.description}</p>
                <p className="text-[#2997FF] font-semibold">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section
        ref={howItWorksReveal.ref}
        className="py-20 px-6 bg-black"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-100 ${howItWorksReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              Simple. Fast. Easy.
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <div
                key={item.step}
                className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center hover:border-[#2997FF]/30 transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-[#0066CC] rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section
        ref={whyUsReveal.ref}
        className="py-20 px-6 bg-[#0D0D0D]"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-100 ${whyUsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Why Choose Us</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              We're Not Your Average Cleaners.
            </h2>
          </div>

          {/* Trust Badges Row */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
              <img src="/ndis-logo.jpg" alt="NDIS" className="h-10 w-auto object-contain rounded-lg" />
              <span className="text-white font-medium">NDIS Registered</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
              <ShieldIcon className="w-6 h-6 text-[#30D158]" />
              <span className="text-white font-medium">Fully Insured</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-4 h-4 text-[#2997FF] fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-white font-medium">4.9 Rating</span>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {whyChooseUs.map((feature, index) => (
              <div
                key={feature.title}
                className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-[#2997FF]/30 transition-all duration-300"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 bg-[#0066CC]/20 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#2997FF]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SERVICE AREAS ==================== */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
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
            {['Liverpool', 'Cabramatta', 'Casula', 'Moorebank', 'Prestons', 'Edmondson Park',
              'Ingleburn', 'Glenfield', 'Leppington', 'Carnes Hill', 'Hoxton Park', 'Green Valley',
              'Campbelltown', 'Parramatta', 'Bankstown', 'Fairfield', 'Blacktown', 'Penrith'].map((suburb) => (
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

      {/* ==================== FINAL CTA - Premium Gradient ==================== */}
      <section
        ref={ctaReveal.ref}
        className="py-24 px-6 bg-gradient-to-br from-[#0066CC] via-[#0052A3] to-[#003366] relative overflow-hidden"
      >
        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(41,151,255,0.2),transparent_60%)]" />

        {/* Floating sparkles */}
        <div className="absolute top-10 left-[10%] w-2 h-2 bg-white/30 rounded-full animate-sparkle" />
        <div className="absolute top-20 right-[15%] w-3 h-3 bg-white/20 rounded-full animate-sparkle-delay-1" />
        <div className="absolute bottom-32 left-[20%] w-2 h-2 bg-white/25 rounded-full animate-sparkle-delay-2" />
        <div className="absolute bottom-20 right-[25%] w-2 h-2 bg-white/30 rounded-full animate-sparkle-delay-3" />
        <div className="absolute top-1/2 left-[5%] w-1.5 h-1.5 bg-white/20 rounded-full animate-sparkle-delay-1" />
        <div className="absolute top-1/3 right-[8%] w-2 h-2 bg-white/25 rounded-full animate-sparkle" />

        {/* Background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[20vw] font-bold text-white/5 whitespace-nowrap">CLEAN</span>
        </div>

        <div className={`relative z-10 text-center max-w-4xl mx-auto transition-all duration-1000 delay-100 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-12">
            Get your instant quote in 60 seconds. No obligations, no hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Glassmorphic premium button */}
            <button
              onClick={() => navigateTo('Landing')}
              className="
                inline-flex items-center gap-3 px-10 py-5
                bg-white/10 backdrop-blur-xl border border-white/30
                text-white text-xl font-semibold rounded-full
                hover:bg-white hover:text-[#0066CC]
                transition-all duration-300 hover:scale-[1.02]
                shadow-[0_16px_48px_rgba(0,0,0,0.3)]
                hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]
              "
            >
              Get Your Free Quote
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button
              onClick={() => navigateTo('Contact')}
              className="px-8 py-4 text-white/80 text-lg font-medium hover:text-white hover:underline transition-colors"
            >
              Contact Us
            </button>
          </div>
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

const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const WindowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 12h16M12 4v16" />
  </svg>
);

const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
);

const WaterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
  </svg>
);

const SnowflakeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v18m0-18l-3 3m3-3l3 3m-3 15l-3-3m3 3l3-3M3 12h18M3 12l3 3m-3-3l3-3m15 3l-3 3m3-3l-3-3" />
  </svg>
);

const BrushIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default ServicesView;
