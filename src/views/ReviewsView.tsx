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

const ReviewsView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const heroReveal = useScrollReveal();
  const featuredReveal = useScrollReveal();
  const gridReveal = useScrollReveal();
  const lovesReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const featuredTestimonials = [
    { name: 'Sarah M.', location: 'Liverpool', text: 'Got my entire bond back. These guys are absolute legends! The property manager was impressed by how spotless they left everything.', rating: 5, service: 'End of Lease' },
    { name: 'James K.', location: 'Parramatta', text: 'Our office has never looked this good. Staff love coming to work now. Professional, punctual, and incredibly thorough.', rating: 5, service: 'Commercial' },
    { name: 'Emma L.', location: 'Cabramatta', text: 'Same-day Airbnb turnover. 5-star reviews from guests ever since. They understand exactly what short-term rental hosts need.', rating: 5, service: 'Airbnb' },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % featuredTestimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const reviews = [
    { name: "Michael T.", location: "Campbelltown", rating: 5, service: "Commercial Office", date: "1 month ago", text: "We've been using Clean Up Bros for our office cleaning for 6 months now. Always on time, never miss a spot, and super professional.", verified: true },
    { name: "David K.", location: "Bankstown", rating: 5, service: "Deep Clean", date: "2 months ago", text: "Had them do a deep clean before my parents visited. They transformed my apartment! Even cleaned areas I forgot existed.", verified: true },
    { name: "Jessica R.", location: "Camden", rating: 5, service: "Post-Construction", date: "1 week ago", text: "After our renovation, the house was a disaster. Clean Up Bros made it look showroom ready. Incredible attention to detail.", verified: true },
    { name: "Tom W.", location: "Moorebank", rating: 5, service: "Regular Cleaning", date: "3 weeks ago", text: "Been using their bi-weekly service for a year now. The team is friendly, trustworthy, and does a fantastic job every time.", verified: true },
    { name: "Priya S.", location: "Fairfield", rating: 5, service: "Residential Clean", date: "1 month ago", text: "Very impressed! They worked around my schedule and cleaned every room to perfection. Even my teenage son noticed!", verified: true },
    { name: "Rachel B.", location: "Casula", rating: 5, service: "Spring Clean", date: "1 week ago", text: "Did a spring clean of our entire house including windows, carpets, and oven. The place sparkles! So happy with the results.", verified: true }
  ];

  const highlights = [
    { icon: BoltIcon, title: "Speed & Efficiency", quote: "They get the job done fast without compromising quality" },
    { icon: UsersIcon, title: "Professional Team", quote: "Friendly, respectful, and always professional" },
    { icon: SparkleIcon, title: "Attention to Detail", quote: "They clean areas I didn't even think of" }
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
        className="min-h-[80vh] flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden"
      >
        {/* Background image with Ken Burns effect */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 ken-burns-bg"
          style={{ backgroundImage: 'url(/images/airbnb/hero.jpeg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />

        {/* Radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(0,102,204,0.08),transparent_50%)]" />

        <div className={`relative z-10 text-center max-w-5xl mx-auto transition-all duration-1000 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Star Rating Display */}
          <div className="flex justify-center gap-1 mb-6">
            {[1,2,3,4,5].map(i => (
              <svg key={i} className="w-10 h-10 md:w-12 md:h-12 text-[#2997FF] fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066CC]/10 border border-[#0066CC]/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#2997FF] rounded-full animate-pulse" />
            <span className="text-[#2997FF] text-sm font-medium">4.9 Star Rating • 127+ Reviews</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-[0.95] mb-4">
            Customer Reviews
          </h1>
          <p className="text-2xl md:text-4xl font-semibold text-[#86868B] mb-6">
            Real Stories. Real Results.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-white">500+</div>
              <div className="text-sm text-[#86868B] uppercase tracking-wider mt-1">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-white">100%</div>
              <div className="text-sm text-[#86868B] uppercase tracking-wider mt-1">Bond Back Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-white">4.9<span className="text-[#2997FF]">★</span></div>
              <div className="text-sm text-[#86868B] uppercase tracking-wider mt-1">Average Rating</div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigateTo('ClientFeedback')}
            className="mt-10 px-8 py-4 bg-[#0066CC] text-white text-lg font-semibold rounded-full hover:bg-[#0077ED] transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(0,102,204,0.4)]"
          >
            Leave a Review
          </button>
        </div>
      </section>

      {/* ==================== FEATURED TESTIMONIAL CAROUSEL ==================== */}
      <section
        ref={featuredReveal.ref}
        className="py-20 px-6 bg-[#0D0D0D]"
      >
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-100 ${featuredReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Featured Reviews</p>
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
                {featuredTestimonials[activeTestimonial].text}
              </p>
            </div>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#2997FF] rounded-full flex items-center justify-center text-xl font-bold text-black">
                {featuredTestimonials[activeTestimonial].name.charAt(0)}
              </div>
              <div>
                <h4 className="text-white font-semibold">{featuredTestimonials[activeTestimonial].name}</h4>
                <p className="text-[#86868B]">{featuredTestimonials[activeTestimonial].location} • {featuredTestimonials[activeTestimonial].service}</p>
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
              {featuredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === activeTestimonial ? 'w-8 bg-[#2997FF]' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== REVIEWS GRID ==================== */}
      <section
        ref={gridReveal.ref}
        className="py-20 px-6 bg-black"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-100 ${gridReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">All Reviews</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              More Happy Customers.
            </h2>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all duration-300 flex flex-col"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#2997FF]/20 rounded-full flex items-center justify-center text-sm font-semibold text-[#2997FF]">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{review.name}</div>
                      <div className="text-xs text-white/50">{review.location}</div>
                    </div>
                  </div>
                  {review.verified && (
                    <span className="text-xs bg-[#30D158]/20 text-[#30D158] px-2 py-1 rounded-full font-medium">
                      ✓ Verified
                    </span>
                  )}
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#2997FF] fill-current" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                {/* Service Tag */}
                <div className="text-xs text-[#2997FF] font-medium mb-3">{review.service}</div>

                {/* Review Text */}
                <p className="text-white/70 text-sm leading-relaxed flex-grow">{review.text}</p>

                {/* Date */}
                <div className="text-xs text-white/40 mt-4">{review.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHAT CUSTOMERS LOVE ==================== */}
      <section
        ref={lovesReveal.ref}
        className="py-20 px-6 bg-[#0D0D0D]"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-100 ${lovesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">What They Love</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              Why Customers Choose Us.
            </h2>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <div
                key={item.title}
                className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 text-center hover:border-[#2997FF]/30 transition-all duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-[#0066CC]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-[#2997FF]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
                <p className="text-white/60 italic">"{item.quote}"</p>
              </div>
            ))}
          </div>
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

        {/* Background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[20vw] font-bold text-white/5 whitespace-nowrap">STARS</span>
        </div>

        <div className={`relative z-10 text-center max-w-4xl mx-auto transition-all duration-1000 delay-100 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tight">
            Join Our Happy Customers
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-12">
            Experience 5-star cleaning service today. See why hundreds trust us.
          </p>
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
        </div>
      </section>
    </div>
  );
};

// ==================== ICONS ====================

const BoltIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

export default ReviewsView;
