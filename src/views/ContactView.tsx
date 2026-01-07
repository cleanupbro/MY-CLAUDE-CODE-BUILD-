import React, { useState } from 'react';
import { NavigationProps, ServiceType } from '../types';

const ContactView: React.FC<NavigationProps> = ({ navigateTo }) => {
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
    // In a real app, this would send to a contact webhook
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero-unit min-h-[600px] md:min-h-[700px] bg-black text-white mb-0 relative group overflow-hidden">
        <div className="hero-unit-text flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-tight text-center drop-shadow-2xl text-white">
            Get In Touch
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-center drop-shadow-lg max-w-3xl">
            Have a question? Need a quote?
          </p>
          <p className="text-lg md:text-xl text-white/90 text-center drop-shadow-md mt-2">
            We're here to help!
          </p>
        </div>
        <div
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&q=80)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Contact Form and Info */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div className="apple-card p-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mb-8">Send Us a Message</h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="text-7xl mb-6">✅</div>
                <h3 className="text-3xl font-bold text-[#1D1D1F] mb-3">Message Sent!</h3>
                <p className="text-[#86868b] text-lg">We'll get back to you within 24 hours</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-base font-semibold text-[#1D1D1F] mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="input"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-[#1D1D1F] mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="input"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-[#1D1D1F] mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="input"
                    placeholder="0400 123 456"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-[#1D1D1F] mb-2">Subject *</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="select"
                  >
                    <option value="">Select a subject...</option>
                    <option>General Inquiry</option>
                    <option>Get a Quote</option>
                    <option>Service Question</option>
                    <option>Booking Assistance</option>
                    <option>Feedback</option>
                    <option>Partnership Opportunity</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base font-semibold text-[#1D1D1F] mb-2">Message *</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    rows={5}
                    className="input resize-none"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full py-4 text-lg shadow-lg hover:shadow-xl">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="apple-card p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-5xl">📞</div>
                <div>
                  <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">Phone</h3>
                  <a href="tel:+61406764585" className="text-[#0071e3] hover:underline text-lg font-semibold">
                    +61 406 764 585
                  </a>
                  <p className="text-sm text-[#86868b] mt-1">Mon-Sun: 7am - 6pm</p>
                </div>
              </div>
            </div>

            <div className="apple-card p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-5xl">✉️</div>
                <div>
                  <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">Email</h3>
                  <a href="mailto:cleanupbros.au@gmail.com" className="text-[#0071e3] hover:underline text-lg font-semibold break-all">
                    cleanupbros.au@gmail.com
                  </a>
                  <p className="text-sm text-[#86868b] mt-1">We reply within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="apple-card p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-5xl">📍</div>
                <div>
                  <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">Location</h3>
                  <p className="text-lg text-[#1D1D1F]">Liverpool, Sydney NSW 2170</p>
                  <p className="text-sm text-[#86868b] mt-1">Serving all Sydney suburbs</p>
                </div>
              </div>
            </div>

            <div className="apple-card p-6 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="text-5xl">⏰</div>
                <div>
                  <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">Business Hours</h3>
                  <div className="space-y-1 text-[#1D1D1F]">
                    <div>Monday - Friday: 7am - 6pm</div>
                    <div>Saturday: 8am - 5pm</div>
                    <div>Sunday: 9am - 4pm</div>
                  </div>
                  <p className="text-sm text-brand-gold mt-3 font-bold">Emergency cleans available 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] text-center mb-16">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">Get a Quote</h3>
              <p className="text-[#86868b] mb-6 leading-relaxed">Instant price estimate in 60 seconds</p>
              <button onClick={() => navigateTo('Landing')} className="btn-primary w-full py-3">
                Get Quote
              </button>
            </div>

            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">Book a Service</h3>
              <p className="text-[#86868b] mb-6 leading-relaxed">Schedule your cleaning today</p>
              <button onClick={() => navigateTo(ServiceType.Residential)} className="btn-primary w-full py-3">
                Book Now
              </button>
            </div>

            <div className="apple-card p-8 text-center transform hover:scale-105 transition-all duration-300">
              <div className="text-6xl mb-4">❓</div>
              <h3 className="text-2xl font-bold text-[#1D1D1F] mb-3">Learn More</h3>
              <p className="text-[#86868b] mb-6 leading-relaxed">About our services and process</p>
              <button onClick={() => navigateTo('About')} className="btn-primary w-full py-3">
                About Us
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="apple-card p-12 mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            <div>
              <h3 className="font-bold text-xl text-[#1D1D1F] mb-3">How quickly can you respond?</h3>
              <p className="text-[#86868b] text-lg leading-relaxed">
                We typically respond to inquiries within 2-4 hours during business hours. For urgent requests, call us directly at +61 406 764 585.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-xl text-[#1D1D1F] mb-3">Do you provide quotes over the phone?</h3>
              <p className="text-[#86868b] text-lg leading-relaxed">
                Yes! For straightforward jobs, we can provide an estimate over the phone. For more complex projects, we may arrange a free on-site inspection.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-xl text-[#1D1D1F] mb-3">What areas do you service?</h3>
              <p className="text-[#86868b] text-lg leading-relaxed">
                We service all Sydney suburbs including Liverpool, Campbelltown, Parramatta, Bankstown, CBD, and surrounding areas. Contact us to confirm service in your suburb.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-xl text-[#1D1D1F] mb-3">Are you available for emergency cleans?</h3>
              <p className="text-[#86868b] text-lg leading-relaxed">
                Yes! We offer 24/7 emergency cleaning services for urgent situations. Additional fees may apply for after-hours service.
              </p>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="apple-card bg-gradient-to-br from-[#F5F5F7] to-white p-20 text-center">
          <div className="text-7xl md:text-8xl mb-6">🗺️</div>
          <p className="text-2xl md:text-3xl text-[#1D1D1F] font-bold mb-2">Serving All of Sydney</p>
          <p className="text-lg text-[#86868b]">Based in Liverpool NSW</p>
        </div>
      </div>
    </div>
  );
};

export default ContactView;
