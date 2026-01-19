import React, { useState, useEffect, useRef } from 'react';
import { NavigationProps } from '../types';

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

// Animated counter
const Counter: React.FC<{ end: number; suffix?: string }> = ({ end, suffix = '' }) => {
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
    const duration = 2000;
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
  }, [isVisible, end]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const AboutView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const heroReveal = useScrollReveal();
  const storyReveal = useScrollReveal();
  const valuesReveal = useScrollReveal();
  const statsReveal = useScrollReveal();
  const certReveal = useScrollReveal();
  const areasReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  const values = [
    {
      icon: SparklesIcon,
      title: "Quality First",
      description: "We don't just clean—we deliver perfection. 100% satisfaction guaranteed or we re-clean free."
    },
    {
      icon: ClockIcon,
      title: "Always On Time",
      description: "Punctuality matters. We arrive when we say we will and finish on schedule, every single time."
    },
    {
      icon: ShieldIcon,
      title: "Fully Insured",
      description: "Your peace of mind matters. We're fully insured and trained to industry standards."
    },
    {
      icon: HeartIcon,
      title: "Family Owned",
      description: "We're Sydney locals who understand our community. Supporting us means supporting local families."
    },
    {
      icon: LeafIcon,
      title: "Eco-Friendly",
      description: "We use environmentally friendly products that are safe for your family, pets, and the planet."
    },
    {
      icon: EyeIcon,
      title: "Attention to Detail",
      description: "We clean every corner, every surface, every time. No shortcuts, no compromises."
    }
  ];

  const suburbs = [
    'Liverpool', 'Cabramatta', 'Casula', 'Moorebank', 'Prestons', 'Edmondson Park',
    'Ingleburn', 'Glenfield', 'Leppington', 'Carnes Hill', 'Hoxton Park', 'Green Valley',
    'Campbelltown', 'Parramatta', 'Bankstown', 'Fairfield', 'Blacktown', 'Penrith'
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* ==================== HERO SECTION ==================== */}
      <section
        ref={heroReveal.ref}
        className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />

        <div className={`relative z-10 text-center max-w-5xl mx-auto transition-all duration-1000 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066CC]/10 border border-[#0066CC]/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#2997FF] rounded-full animate-pulse" />
            <span className="text-[#2997FF] text-sm font-medium">Family Owned Since 2023</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-[0.95] mb-4">
            About Clean Up Bros
          </h1>
          <p className="text-2xl md:text-4xl font-semibold text-[#86868B] mb-6">
            Sydney's Most Trusted.
          </p>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Professional, reliable, and always on time. We treat every space with the care and attention it deserves.
          </p>

          <button
            onClick={() => navigateTo('Contact')}
            className="px-8 py-4 bg-[#0066CC] text-white text-lg font-semibold rounded-full hover:bg-[#0077ED] transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(0,102,204,0.4)]"
          >
            Get In Touch
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ==================== OUR STORY ==================== */}
      <section
        ref={storyReveal.ref}
        className="py-20 px-6 bg-[#0D0D0D]"
      >
        <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-100 ${storyReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Our Story</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              Where It All Began.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Story Text */}
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                Founded in Liverpool, Sydney, Clean Up Bros was born from a simple mission: to provide exceptional cleaning services that exceed expectations.
              </p>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                What started as a small team has grown into Sydney's most trusted cleaning service. We understand that your home or business is more than just a space—it's where life happens.
              </p>
              <p className="text-white/70 text-lg leading-relaxed">
                That's why we treat every job with the care and attention it deserves. From residential homes to commercial offices, Airbnb turnovers to post-construction clean-ups, we've mastered the art of making spaces shine.
              </p>
            </div>

            {/* Image Card */}
            <div className="bg-[#1C1C1E] rounded-[20px] overflow-hidden border border-white/10">
              <div className="relative h-64 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                  alt="Clean Up Bros team"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1E] to-transparent" />
              </div>
              <div className="p-6 text-center">
                <div className="text-5xl font-bold text-white mb-2">5+ Years</div>
                <p className="text-[#86868B]">Serving Sydney with Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== OUR VALUES ==================== */}
      <section
        ref={valuesReveal.ref}
        className="py-20 px-6 bg-black"
      >
        <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-100 ${valuesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Our Values</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              Why We're Different.
            </h2>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all duration-300"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 bg-[#0066CC]/20 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[#2997FF]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section
        ref={statsReveal.ref}
        className="py-20 px-6 bg-[#0D0D0D]"
      >
        <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-100 ${statsReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">By The Numbers</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              Results That Speak.
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <Counter end={10000} suffix="+" />
              </div>
              <p className="text-[#86868B]">Jobs Completed</p>
            </div>
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                4.9<span className="text-[#2997FF]">★</span>
              </div>
              <p className="text-[#86868B]">Average Rating</p>
            </div>
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <Counter end={500} suffix="+" />
              </div>
              <p className="text-[#86868B]">Happy Clients</p>
            </div>
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                <Counter end={100} suffix="%" />
              </div>
              <p className="text-[#86868B]">Bond Back Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CERTIFICATIONS ==================== */}
      <section
        ref={certReveal.ref}
        className="py-20 px-6 bg-black"
      >
        <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-100 ${certReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Trust & Accreditation</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              Certified & Trusted.
            </h2>
          </div>

          {/* Certification Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center hover:border-[#2997FF]/30 transition-all duration-300">
              <img src="/ndis-logo.jpg" alt="NDIS Registered" className="h-16 w-auto object-contain mx-auto mb-4 rounded-lg" />
              <h3 className="text-xl font-semibold text-white mb-2">NDIS Registered</h3>
              <p className="text-white/60 text-sm">Certified provider for NDIS participants</p>
            </div>

            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center hover:border-[#2997FF]/30 transition-all duration-300">
              <div className="w-16 h-16 bg-[#30D158]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldIcon className="w-8 h-8 text-[#30D158]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fully Insured</h3>
              <p className="text-white/60 text-sm">Comprehensive coverage for peace of mind</p>
            </div>

            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center hover:border-[#2997FF]/30 transition-all duration-300">
              <div className="w-16 h-16 bg-[#2997FF]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckBadgeIcon className="w-8 h-8 text-[#2997FF]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">ABN Registered</h3>
              <p className="text-white/60 text-sm">Legitimate Australian business</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICE AREAS ==================== */}
      <section
        ref={areasReveal.ref}
        className="py-20 px-6 bg-[#0D0D0D]"
      >
        <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-100 ${areasReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Service Areas</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Covering <span className="text-[#2997FF]">All of Western Sydney</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Based in Liverpool, we proudly serve all Western Sydney suburbs and beyond.
            </p>
          </div>

          {/* Suburb Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {suburbs.map((suburb) => (
              <div
                key={suburb}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-white/80 text-sm font-medium hover:bg-[#0066CC]/10 hover:border-[#0066CC]/30 transition-all duration-200 cursor-default"
              >
                {suburb}
              </div>
            ))}
          </div>

          <p className="text-center text-white/40 text-sm mt-8">
            Don't see your suburb?{' '}
            <button
              onClick={() => navigateTo('Contact')}
              className="text-[#2997FF] hover:underline font-medium"
            >
              Contact us
            </button>
            {' '}— we probably service your area!
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
          <span className="text-[20vw] font-bold text-black/5 whitespace-nowrap">TRUST</span>
        </div>

        <div className={`relative z-10 text-center max-w-3xl mx-auto transition-all duration-1000 delay-100 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-6xl font-semibold text-white mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Get a quote in 60 seconds or less. See why hundreds trust Clean Up Bros.
          </p>
          <button
            onClick={() => navigateTo('Landing')}
            className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white text-xl font-semibold rounded-full hover:bg-[#1C1C1E] transition-all duration-300 hover:scale-[1.02] shadow-[0_16px_48px_rgba(0,0,0,0.3)]"
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

const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const LeafIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const CheckBadgeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

export default AboutView;
