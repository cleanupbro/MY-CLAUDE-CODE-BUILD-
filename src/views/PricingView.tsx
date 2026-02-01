import React, { useEffect } from 'react';
import { ViewType, ServiceType } from '../types';

interface PricingViewProps {
  navigateTo: (view: ViewType) => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ navigateTo }) => {
  useEffect(() => {
    document.title = 'Cleaning Prices Liverpool | Transparent Pricing | Clean Up Bros';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Transparent cleaning prices for Liverpool NSW. End of lease from $250, house cleaning from $120, Airbnb from $80. No hidden fees. Get instant quote. Call 0406 764 585'
      );
    }
  }, []);

  const pricingCategories = [
    {
      title: 'End of Lease / Bond Cleaning',
      description: '100% Bond Back Guarantee',
      icon: '🏠',
      color: '#30D158',
      items: [
        { service: 'Studio / 1 Bedroom', price: '$250 - $300', time: '3-4 hours' },
        { service: '2 Bedroom Apartment', price: '$300 - $400', time: '4-5 hours' },
        { service: '3 Bedroom House', price: '$400 - $550', time: '5-7 hours' },
        { service: '4 Bedroom House', price: '$550 - $700', time: '6-8 hours' },
        { service: '5+ Bedroom House', price: 'From $700', time: 'Custom' },
      ],
      includes: ['All rooms deep cleaned', 'Kitchen & oven included', 'Bathrooms sanitised', 'Windows & tracks', 'FREE re-clean if needed'],
      cta: ServiceType.Residential
    },
    {
      title: 'Regular House Cleaning',
      description: 'Weekly, Fortnightly, or One-Off',
      icon: '✨',
      color: '#2997FF',
      items: [
        { service: '1-2 Bedroom', price: '$120 - $180', time: '2-3 hours' },
        { service: '3 Bedroom', price: '$180 - $250', time: '3-4 hours' },
        { service: '4 Bedroom', price: '$250 - $320', time: '4-5 hours' },
        { service: '5+ Bedroom', price: 'From $320', time: 'Custom' },
        { service: 'Deep Clean Add-On', price: '+$50 - $100', time: '+1-2 hours' },
      ],
      includes: ['All rooms vacuumed & mopped', 'Kitchen surfaces cleaned', 'Bathrooms cleaned', 'Beds made', 'Bins emptied'],
      cta: ServiceType.Residential
    },
    {
      title: 'Airbnb / Short-Term Rental',
      description: 'Same-Day Turnover Available',
      icon: '✈️',
      color: '#FF9500',
      items: [
        { service: 'Studio / 1 Bedroom', price: '$80 - $120', time: '1.5-2 hours' },
        { service: '2 Bedroom', price: '$120 - $160', time: '2-3 hours' },
        { service: '3 Bedroom', price: '$160 - $220', time: '3-4 hours' },
        { service: '4+ Bedroom', price: 'From $220', time: 'Custom' },
        { service: 'Linen Service', price: '+$30 - $50', time: 'Wash & fold' },
      ],
      includes: ['Full property clean', 'Linen change', 'Kitchen reset', 'Bathroom restocked', 'Guest-ready inspection'],
      cta: ServiceType.Airbnb
    },
    {
      title: 'Commercial / Office Cleaning',
      description: 'Custom Schedules Available',
      icon: '🏢',
      color: '#AF52DE',
      items: [
        { service: 'Small Office (<100sqm)', price: '$150 - $250', time: 'Per visit' },
        { service: 'Medium Office (100-300sqm)', price: '$250 - $450', time: 'Per visit' },
        { service: 'Large Office (300+sqm)', price: 'Custom Quote', time: 'Custom' },
        { service: 'Medical / Gym', price: 'Custom Quote', time: 'Specialist' },
        { service: 'Daily Contract', price: 'Discounted', time: 'Mon-Fri' },
      ],
      includes: ['All workstations cleaned', 'Kitchen/break room', 'Bathrooms daily', 'Floor care', 'Waste removal'],
      cta: ServiceType.Commercial
    },
  ];

  const addOns = [
    { name: 'Carpet Steam Cleaning', price: 'From $50/room' },
    { name: 'External Window Cleaning', price: 'From $5/window' },
    { name: 'Oven Deep Clean', price: '$50' },
    { name: 'Fridge Deep Clean', price: '$30' },
    { name: 'Balcony / Patio', price: 'From $40' },
    { name: 'Garage Sweep & Mop', price: 'From $40' },
    { name: 'Wall Spot Cleaning', price: '$30' },
    { name: 'Blind Cleaning', price: 'From $10/blind' },
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0066CC]/20 to-black">
        <div className="max-w-6xl mx-auto text-center">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center justify-center gap-2 text-white/60">
              <li>
                <button onClick={() => navigateTo('Landing')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>/</li>
              <li className="text-white font-medium">Pricing</li>
            </ol>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#30D158]/10 border border-[#30D158]/30 rounded-full mb-6">
            <span className="text-[#30D158] text-sm font-bold">✓ NO HIDDEN FEES</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight mb-4">
            Transparent Pricing
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
            Know exactly what you'll pay before you book. No surprises, no hidden fees.
            Final price confirmed after quick property assessment.
          </p>

          {/* Trust Strip */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <span className="text-[#FFD60A]">★</span> 4.9 Google Rating
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#30D158]">✓</span> 500+ Happy Customers
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#2997FF]">💳</span> All Payment Methods
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Categories */}
      <section className="py-16 px-6 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pricingCategories.map((category) => (
              <div
                key={category.title}
                className="bg-[#1C1C1E] rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{category.title}</h2>
                    <p style={{ color: category.color }} className="font-medium">{category.description}</p>
                  </div>
                </div>

                {/* Price Table */}
                <div className="space-y-3 mb-6">
                  {category.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <span className="text-white font-medium">{item.service}</span>
                        <span className="text-white/40 text-sm ml-2">({item.time})</span>
                      </div>
                      <span className="text-white font-bold">{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* What's Included */}
                <div className="mb-6">
                  <p className="text-white/50 text-sm mb-3">Includes:</p>
                  <div className="flex flex-wrap gap-2">
                    {category.includes.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/5 rounded-full text-white/70 text-xs"
                      >
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigateTo(category.cta)}
                  className="w-full py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                  style={{ backgroundColor: category.color, color: '#000' }}
                >
                  Get Quote →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons Section */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-white text-center mb-8">
            Optional Add-Ons
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {addOns.map((addon) => (
              <div
                key={addon.name}
                className="bg-[#1C1C1E] rounded-xl p-4 border border-white/10 text-center hover:border-[#2997FF]/30 transition-colors"
              >
                <p className="text-white font-medium text-sm mb-2">{addon.name}</p>
                <p className="text-[#2997FF] font-bold">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-12 px-6 bg-[#0D0D0D]">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold text-white mb-6">Payment Methods</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-white/10 rounded-full text-white/80">💳 Credit Card</span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-white/80">📱 PayID</span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-white/80">🏦 Bank Transfer</span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-white/80">💵 Cash</span>
            <span className="px-4 py-2 bg-white/10 rounded-full text-white/80">📲 Afterpay</span>
          </div>
          <p className="text-white/50 text-sm mt-4">
            25% deposit required to secure booking. Balance due on completion.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#0066CC] to-[#0052A3]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6">
            Get Your Exact Price
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Prices above are estimates. Get an exact quote in 60 seconds based on your property details.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigateTo(ServiceType.Residential)}
              className="px-10 py-5 bg-white text-[#0066CC] text-lg font-bold rounded-full hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] shadow-xl"
            >
              Get My Free Quote Now
            </button>
            <a
              href="tel:+61406764585"
              className="px-8 py-4 text-white text-lg font-medium border-2 border-white/30 rounded-full hover:border-white transition-colors"
            >
              📞 0406 764 585
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingView;
