import React, { useState, useEffect, useRef } from 'react';
import { NavigationProps, ServiceType } from '../types';

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

const ContactView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const heroReveal = useScrollReveal();
  const contactReveal = useScrollReveal();
  const formReveal = useScrollReveal();
  const faqReveal = useScrollReveal();
  const areasReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  const suburbs = [
    'Liverpool', 'Cabramatta', 'Casula', 'Moorebank', 'Prestons', 'Edmondson Park',
    'Ingleburn', 'Glenfield', 'Leppington', 'Carnes Hill', 'Hoxton Park', 'Green Valley',
    'Campbelltown', 'Parramatta', 'Bankstown', 'Fairfield', 'Blacktown', 'Penrith'
  ];

  const faqs = [
    {
      question: "How quickly can you respond?",
      answer: "We typically respond to inquiries within 2-4 hours during business hours. For urgent requests, call us directly at +61 406 764 585."
    },
    {
      question: "Do you provide quotes over the phone?",
      answer: "Yes! For straightforward jobs, we can provide an estimate over the phone. For more complex projects, we may arrange a free on-site inspection."
    },
    {
      question: "What areas do you service?",
      answer: "We service all Sydney suburbs including Liverpool, Campbelltown, Parramatta, Bankstown, CBD, and surrounding areas."
    },
    {
      question: "Are you available for emergency cleans?",
      answer: "Yes! We offer 24/7 emergency cleaning services for urgent situations. Additional fees may apply for after-hours service."
    }
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
        className="min-h-[70vh] flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden"
      >
        {/* Background image with Ken Burns effect */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 ken-burns-bg"
          style={{ backgroundImage: 'url(/images/offices/hero.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />

        {/* Radial gradient for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(0,102,204,0.08),transparent_50%)]" />

        <div className={`relative z-10 text-center max-w-5xl mx-auto transition-all duration-1000 ${heroReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066CC]/10 border border-[#0066CC]/30 rounded-full mb-8">
            <span className="w-2 h-2 bg-[#2997FF] rounded-full animate-pulse" />
            <span className="text-[#2997FF] text-sm font-medium">We Reply Within 2 Hours</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tight leading-[0.95] mb-4">
            Get In Touch
          </h1>
          <p className="text-2xl md:text-4xl font-semibold text-[#86868B] mb-6">
            We're Here to Help.
          </p>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            Have a question? Need a quote? We're just a message or call away.
          </p>
        </div>
      </section>

      {/* ==================== CONTACT OPTIONS ==================== */}
      <section
        ref={contactReveal.ref}
        className="py-20 px-6 bg-[#0D0D0D]"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-100 ${contactReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Contact Options</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              Reach Us Anytime.
            </h2>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone */}
            <a
              href="tel:+61406764585"
              className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-[#0066CC]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0066CC]/30 transition-colors">
                <PhoneIcon className="w-6 h-6 text-[#2997FF]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
              <p className="text-[#2997FF] font-semibold mb-2">+61 406 764 585</p>
              <p className="text-white/50 text-sm">Mon-Sun: 7am - 6pm</p>
            </a>

            {/* Email */}
            <a
              href="mailto:cleanupbros.au@gmail.com"
              className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-[#0066CC]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0066CC]/30 transition-colors">
                <MailIcon className="w-6 h-6 text-[#2997FF]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
              <p className="text-[#2997FF] font-semibold mb-2 break-all">cleanupbros.au@gmail.com</p>
              <p className="text-white/50 text-sm">We reply within 24 hours</p>
            </a>

            {/* Location */}
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-[#0066CC]/20 rounded-xl flex items-center justify-center mb-4">
                <LocationIcon className="w-6 h-6 text-[#2997FF]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Location</h3>
              <p className="text-white/80 mb-2">Liverpool, Sydney NSW 2170</p>
              <p className="text-white/50 text-sm">Serving all Sydney suburbs</p>
            </div>

            {/* Hours */}
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-[#0066CC]/20 rounded-xl flex items-center justify-center mb-4">
                <ClockIcon className="w-6 h-6 text-[#2997FF]" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">Hours</h3>
              <div className="text-white/80 text-sm space-y-1 mb-2">
                <p>Mon-Fri: 7am - 6pm</p>
                <p>Sat: 8am - 5pm</p>
                <p>Sun: 9am - 4pm</p>
              </div>
              <p className="text-[#30D158] text-sm font-medium">24/7 Emergency Available</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <button
              onClick={() => navigateTo('Landing')}
              className="bg-[#1C1C1E] rounded-xl p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all duration-300 text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Get a Quote</h3>
                  <p className="text-white/50 text-sm">Instant price in 60 seconds</p>
                </div>
                <svg className="w-6 h-6 text-white/40 group-hover:text-[#2997FF] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => navigateTo(ServiceType.Residential)}
              className="bg-[#1C1C1E] rounded-xl p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all duration-300 text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Book a Service</h3>
                  <p className="text-white/50 text-sm">Schedule your cleaning</p>
                </div>
                <svg className="w-6 h-6 text-white/40 group-hover:text-[#2997FF] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => navigateTo('About')}
              className="bg-[#1C1C1E] rounded-xl p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all duration-300 text-left group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Learn More</h3>
                  <p className="text-white/50 text-sm">About our services</p>
                </div>
                <svg className="w-6 h-6 text-white/40 group-hover:text-[#2997FF] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* ==================== CONTACT FORM ==================== */}
      <section
        ref={formReveal.ref}
        className="py-20 px-6 bg-black"
      >
        <div className={`max-w-3xl mx-auto transition-all duration-1000 delay-100 ${formReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Send a Message</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              Drop Us a Line.
            </h2>
          </div>

          {/* Form Container */}
          <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-[#30D158]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckIcon className="w-10 h-10 text-[#30D158]" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">Message Sent!</h3>
                <p className="text-white/60">We'll get back to you within 24 hours</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 focus:outline-none transition-colors"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 focus:outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 focus:outline-none transition-colors"
                      placeholder="0400 123 456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Subject *</label>
                    <select
                      required
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 focus:outline-none transition-colors"
                    >
                      <option value="" className="bg-[#2C2C2E]">Select a subject...</option>
                      <option value="General Inquiry" className="bg-[#2C2C2E]">General Inquiry</option>
                      <option value="Get a Quote" className="bg-[#2C2C2E]">Get a Quote</option>
                      <option value="Service Question" className="bg-[#2C2C2E]">Service Question</option>
                      <option value="Booking Assistance" className="bg-[#2C2C2E]">Booking Assistance</option>
                      <option value="Feedback" className="bg-[#2C2C2E]">Feedback</option>
                      <option value="Partnership" className="bg-[#2C2C2E]">Partnership Opportunity</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Message *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    rows={5}
                    className="w-full bg-[#2C2C2E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 focus:outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#0066CC] text-white text-lg font-semibold rounded-full hover:bg-[#0077ED] transition-all duration-300 shadow-[0_0_20px_rgba(0,102,204,0.3)]"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ==================== FAQ SECTION ==================== */}
      <section
        ref={faqReveal.ref}
        className="py-20 px-6 bg-[#0D0D0D]"
      >
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-100 ${faqReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-white">
              Common Questions.
            </h2>
          </div>

          {/* FAQ Cards */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-white/60 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SERVICE AREAS ==================== */}
      <section
        ref={areasReveal.ref}
        className="py-20 px-6 bg-black"
      >
        <div className={`max-w-7xl mx-auto transition-all duration-1000 delay-100 ${areasReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Service Areas</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              We Clean Across <span className="text-[#2997FF]">Western Sydney</span>
            </h2>
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
          <span className="text-[20vw] font-bold text-white/5 whitespace-nowrap">HELLO</span>
        </div>

        <div className={`relative z-10 text-center max-w-4xl mx-auto transition-all duration-1000 delay-100 ${ctaReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-5xl md:text-7xl font-semibold text-white mb-6 tracking-tight">
            Ready for a Spotless Space?
          </h2>
          <p className="text-xl md:text-2xl text-white/80 mb-12">
            Get your instant quote now. No obligations, no hidden fees.
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

const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default ContactView;
