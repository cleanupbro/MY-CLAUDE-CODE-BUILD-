import React from 'react';
import { NavigationProps, ServiceType } from '../types';

const ServicesView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const services = [
    {
      title: "Residential Cleaning",
      icon: "🏠",
      description: "Professional home cleaning for houses, apartments, and townhouses across Sydney",
      features: [
        "General cleaning & maintenance",
        "Deep cleaning services",
        "End of lease / bond cleaning",
        "Post-construction cleanup",
        "Spring cleaning",
        "One-time or recurring schedules"
      ],
      startingPrice: "$150",
      action: () => navigateTo(ServiceType.Residential)
    },
    {
      title: "Commercial Cleaning",
      icon: "🏢",
      description: "Keep your workspace spotless with our professional office and commercial cleaning",
      features: [
        "Office buildings & co-working spaces",
        "Retail stores & showrooms",
        "Medical centres & clinics",
        "Gyms & fitness centres",
        "Warehouses & industrial spaces",
        "Customized cleaning schedules"
      ],
      startingPrice: "$200",
      action: () => navigateTo(ServiceType.Commercial)
    },
    {
      title: "Airbnb Turnover",
      icon: "🏨",
      description: "Fast, reliable turnover cleaning for short-term rental hosts",
      features: [
        "Same-day turnovers available",
        "Linen change & restocking",
        "Quality inspection reports",
        "Guest-ready standard",
        "Damage & maintenance reporting",
        "Flexible scheduling 7 days a week"
      ],
      startingPrice: "$120",
      action: () => navigateTo(ServiceType.Airbnb)
    }
  ];

  const addOnServices = [
    {
      title: "Carpet Steam Cleaning",
      icon: "🧼",
      description: "Professional steam cleaning to remove stains, odors, and allergens",
      price: "From $80"
    },
    {
      title: "Window Cleaning",
      icon: "🪟",
      description: "Streak-free crystal clear windows inside and out",
      price: "From $60"
    },
    {
      title: "Oven & Kitchen Deep Clean",
      icon: "🔥",
      description: "Heavy-duty cleaning for ovens, range hoods, and appliances",
      price: "From $90"
    },
    {
      title: "Pressure Washing",
      icon: "💦",
      description: "Driveways, patios, decks, and exterior surfaces",
      price: "From $150"
    },
    {
      title: "Fridge & Freezer Clean",
      icon: "❄️",
      description: "Complete sanitization and organization",
      price: "From $50"
    },
    {
      title: "Wall Washing",
      icon: "🧽",
      description: "Remove marks, scuffs, and grime from walls",
      price: "From $100"
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero-unit min-h-[650px] md:min-h-[750px] bg-black text-white mb-0 relative group overflow-hidden">
        <div className="hero-unit-text flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 leading-tight text-center drop-shadow-2xl text-white">
            Our Services
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-center drop-shadow-lg max-w-4xl">
            Professional cleaning solutions for every need
          </p>
          <p className="text-lg md:text-xl text-white/90 text-center drop-shadow-md max-w-3xl mt-2">
            From homes to offices, we've got you covered
          </p>
        </div>
        <div
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=1920&q=80)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Core Services */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] text-center mb-16">
            Core Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="apple-card p-8 flex flex-col transform hover:scale-[1.02] transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="text-7xl mb-4">{service.icon}</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#1D1D1F] mb-3">{service.title}</h3>
                  <p className="text-[#86868b] leading-relaxed">{service.description}</p>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-brand-gold text-xl">✓</span>
                      <span className="text-[#1D1D1F]">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 border-gray-100 pt-6 mt-auto">
                  <div className="text-center mb-4">
                    <span className="text-sm text-[#86868b] block mb-1">Starting from</span>
                    <div className="text-4xl font-bold text-[#1D1D1F]">{service.startingPrice}</div>
                  </div>
                  <button
                    onClick={service.action}
                    className="btn-primary w-full py-4 text-lg shadow-lg hover:shadow-xl"
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add-On Services */}
      <div className="bg-gradient-to-br from-[#F5F5F7] to-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] text-center mb-4">
            Add-On Services
          </h2>
          <p className="text-center text-[#86868b] text-lg mb-16">
            Enhance your cleaning with these specialized services
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOnServices.map((addon, index) => (
              <div key={index} className="apple-card p-6 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{addon.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-[#1D1D1F] mb-2">{addon.title}</h3>
                    <p className="text-sm text-[#86868b] mb-3 leading-relaxed">{addon.description}</p>
                    <p className="text-brand-gold font-bold text-lg">{addon.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] text-center mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-brand-gold text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
                1
              </div>
              <h3 className="font-bold text-xl text-[#1D1D1F] mb-2">Get a Quote</h3>
              <p className="text-[#86868b] leading-relaxed">Fill out our quick form or call us for an instant estimate</p>
            </div>

            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-brand-gold text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
                2
              </div>
              <h3 className="font-bold text-xl text-[#1D1D1F] mb-2">Schedule Service</h3>
              <p className="text-[#86868b] leading-relaxed">Choose a date and time that works for you</p>
            </div>

            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-brand-gold text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
                3
              </div>
              <h3 className="font-bold text-xl text-[#1D1D1F] mb-2">We Clean</h3>
              <p className="text-[#86868b] leading-relaxed">Our professional team arrives and gets to work</p>
            </div>

            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-20 h-20 bg-brand-gold text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
                4
              </div>
              <h3 className="font-bold text-xl text-[#1D1D1F] mb-2">Enjoy</h3>
              <p className="text-[#86868b] leading-relaxed">Relax in your spotless space!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gradient-to-br from-[#1D1D1F] to-gray-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Why Choose Clean Up Bros?
          </h2>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-16">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
              <img
                src="/ndis-logo.jpg"
                alt="We Love NDIS"
                className="h-12 w-auto object-contain rounded-lg"
              />
              <span className="text-white font-semibold">NDIS Registered</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-white font-semibold">Fully Insured</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="flex">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white font-semibold">4.9 Rating</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="font-bold text-2xl mb-3">Quality Guaranteed</h3>
              <p className="text-white/80 leading-relaxed">100% satisfaction or we re-clean free</p>
            </div>

            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="text-6xl mb-4">💯</div>
              <h3 className="font-bold text-2xl mb-3">Fully Insured</h3>
              <p className="text-white/80 leading-relaxed">Your property is protected</p>
            </div>

            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="text-6xl mb-4">⏰</div>
              <h3 className="font-bold text-2xl mb-3">Punctual</h3>
              <p className="text-white/80 leading-relaxed">Always on time, every time</p>
            </div>

            <div className="text-center transform hover:scale-110 transition-all duration-300">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="font-bold text-2xl mb-3">Eco-Friendly</h3>
              <p className="text-white/80 leading-relaxed">Safe products for your family</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-[#F5F5F7] to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1D1D1F] mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl text-[#86868b] mb-10">
            Get your free quote in less than 60 seconds
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigateTo('Landing')}
              className="btn-primary text-xl px-12 py-4 shadow-xl hover:shadow-2xl"
            >
              Get Free Quote
            </button>
            <button
              onClick={() => navigateTo('Contact')}
              className="btn-secondary text-xl px-12 py-4 shadow-lg hover:shadow-xl"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesView;
