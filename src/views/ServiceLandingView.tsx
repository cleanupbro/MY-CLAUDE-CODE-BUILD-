import React, { useEffect } from 'react';
import { ViewType, ServiceType } from '../types';

interface ServiceData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  heroImage: string;
  benefits: string[];
  included: string[];
  pricing: { type: string; price: string; details: string }[];
  faqs: { question: string; answer: string }[];
  targetSuburbs: string[];
}

// Service data configuration
export const SERVICES: Record<string, ServiceData> = {
  'residential-cleaning-liverpool': {
    slug: 'residential-cleaning-liverpool',
    title: 'Residential Cleaning Liverpool',
    subtitle: 'Professional House Cleaning Services',
    description: 'Keep your Liverpool home spotless with our professional residential cleaning services. Regular weekly, fortnightly, or one-off deep cleans available.',
    metaTitle: 'House Cleaning Liverpool NSW | Residential Cleaners | Clean Up Bros',
    metaDescription: 'Professional house cleaning in Liverpool NSW 2170. Weekly, fortnightly, or one-off cleans. Fully insured, police-checked cleaners. Same-day service available. Call 0406 764 585',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    benefits: [
      'Flexible scheduling - weekly, fortnightly, or one-off',
      'Fully insured and police-checked cleaners',
      'All supplies and equipment included',
      'Same-day service available',
      'Satisfaction guarantee on every clean',
      'No lock-in contracts'
    ],
    included: [
      'All rooms dusted and vacuumed',
      'Floors mopped and polished',
      'Kitchen surfaces cleaned and sanitised',
      'Bathroom cleaned and disinfected',
      'Beds made (fresh linen if provided)',
      'Bins emptied',
      'Light switches and door handles wiped'
    ],
    pricing: [
      { type: '1-2 Bedroom', price: '$120-180', details: 'Approx 2-3 hours' },
      { type: '3 Bedroom', price: '$180-250', details: 'Approx 3-4 hours' },
      { type: '4+ Bedroom', price: '$250+', details: 'Custom quote' },
      { type: 'Deep Clean', price: '+$50-100', details: 'Add to any service' }
    ],
    faqs: [
      { question: 'How often should I book house cleaning?', answer: 'Most Liverpool families prefer fortnightly cleaning to maintain a consistently clean home without the high cost of weekly service. Weekly is ideal for busy families or those with pets.' },
      { question: 'Do I need to be home during the clean?', answer: 'No, many of our Liverpool clients provide a spare key or leave the property accessible. All our cleaners are police-checked and fully insured.' },
      { question: 'What cleaning products do you use?', answer: 'We bring all professional-grade, eco-friendly cleaning supplies. If you prefer specific products, just let us know and we can accommodate.' }
    ],
    targetSuburbs: ['Liverpool', 'Casula', 'Moorebank', 'Prestons', 'Warwick Farm']
  },
  'bond-cleaning-liverpool': {
    slug: 'bond-cleaning-liverpool',
    title: 'Bond Cleaning Liverpool',
    subtitle: '100% Bond Back Guarantee',
    description: 'Get your full bond back with our professional end of lease cleaning in Liverpool. We know exactly what real estate agents look for.',
    metaTitle: 'Bond Cleaning Liverpool | End of Lease Cleaning | 100% Guarantee',
    metaDescription: 'Bond cleaning Liverpool NSW with 100% bond back guarantee. End of lease cleaning experts. Free re-clean if needed. Trusted by real estate agents. Call 0406 764 585',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    benefits: [
      '100% Bond Back Guarantee',
      'FREE re-clean within 24 hours if needed',
      'Trusted by Liverpool real estate agents',
      'Comprehensive checklist completion',
      'Before/after photos provided',
      'Same-day service available'
    ],
    included: [
      'All rooms deep cleaned',
      'Kitchen - oven, rangehood, cupboards inside/out',
      'Bathroom - tiles, grout, shower screen descaled',
      'Windows and tracks cleaned',
      'Walls spot cleaned',
      'Skirting boards and door frames',
      'Light fittings and switches',
      'Garage swept (if applicable)'
    ],
    pricing: [
      { type: '1 Bedroom', price: '$250-300', details: 'Studio/1BR apartment' },
      { type: '2 Bedroom', price: '$300-400', details: 'Includes kitchen & bath' },
      { type: '3 Bedroom', price: '$400-550', details: 'House or large apartment' },
      { type: '4+ Bedroom', price: '$550-700', details: 'Large family home' }
    ],
    faqs: [
      { question: 'What if I don\'t get my bond back?', answer: 'We offer a 100% bond back guarantee. If your real estate agent finds any issues, we\'ll re-clean for FREE within 24 hours. We\'ve helped hundreds of Liverpool tenants get their full bond back.' },
      { question: 'How long does bond cleaning take?', answer: 'Typically 4-8 hours depending on property size and condition. A 2-bedroom apartment usually takes 4-5 hours, while a 3-bedroom house takes 6-8 hours.' },
      { question: 'Should I book before or after moving out?', answer: 'We recommend booking for after you\'ve moved all belongings out. This allows us to clean everything thoroughly, including inside wardrobes and storage areas.' }
    ],
    targetSuburbs: ['Liverpool', 'Cabramatta', 'Fairfield', 'Bankstown', 'Campbelltown']
  },
  'airbnb-cleaning-liverpool': {
    slug: 'airbnb-cleaning-liverpool',
    title: 'Airbnb Cleaning Liverpool',
    subtitle: 'Same-Day Turnover Service',
    description: 'Keep your Liverpool Airbnb 5-star guest ready with our professional turnover cleaning service. Fast, reliable, and thorough.',
    metaTitle: 'Airbnb Cleaning Liverpool | Turnover Service | Same-Day Available',
    metaDescription: 'Airbnb turnover cleaning Liverpool NSW. Same-day service, linen change, restocking. Keep your property 5-star guest ready. Trusted by Airbnb hosts. Call 0406 764 585',
    heroImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
    benefits: [
      'Same-day turnover service',
      'Linen change and bed making',
      'Restocking essentials available',
      'Quality inspection checklist',
      'Photo report after each clean',
      'Flexible scheduling for bookings'
    ],
    included: [
      'Full property clean',
      'Linen stripped and fresh made',
      'Bathroom restocked (if provided)',
      'Kitchen reset and cleaned',
      'Floors vacuumed and mopped',
      'Bins emptied',
      'Welcome setup (as instructed)'
    ],
    pricing: [
      { type: 'Studio/1BR', price: '$80-120', details: 'Approx 1.5-2 hours' },
      { type: '2 Bedroom', price: '$120-160', details: 'Approx 2-3 hours' },
      { type: '3 Bedroom', price: '$160-220', details: 'Approx 3-4 hours' },
      { type: 'Linen Service', price: '+$30-50', details: 'Wash, dry, fold' }
    ],
    faqs: [
      { question: 'How quickly can you do a turnover?', answer: 'We can complete most turnovers within 2-4 hours. For same-day bookings, we recommend giving us at least 3 hours notice when possible.' },
      { question: 'Do you provide linen?', answer: 'We can wash, dry, and remake beds with your existing linen. If you need linen rental, we can arrange that too at an additional cost.' },
      { question: 'Can you restock supplies?', answer: 'Yes! We can restock toiletries, kitchen essentials, and welcome items. Just provide the supplies or let us purchase them (reimbursed at cost).' }
    ],
    targetSuburbs: ['Liverpool', 'Moorebank', 'Prestons', 'Edmondson Park', 'Glenfield']
  },
  'commercial-cleaning-liverpool': {
    slug: 'commercial-cleaning-liverpool',
    title: 'Commercial Cleaning Liverpool',
    subtitle: 'Office & Business Cleaning',
    description: 'Professional commercial cleaning for Liverpool businesses. Daily, weekly, or custom schedules. Offices, medical centres, gyms, and retail.',
    metaTitle: 'Commercial Cleaning Liverpool | Office Cleaners Western Sydney',
    metaDescription: 'Commercial cleaning Liverpool NSW. Office cleaners, medical centre cleaning, retail cleaning. Fully insured, after-hours available. Custom schedules. Call 0406 764 585',
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    benefits: [
      'Flexible scheduling - before/after hours',
      'Custom cleaning plans',
      'Fully insured with $20M coverage',
      'Police-checked staff',
      'Quality assurance inspections',
      'No lock-in contracts'
    ],
    included: [
      'All workstations and desks cleaned',
      'Kitchen/break room sanitised',
      'Bathrooms deep cleaned daily',
      'Floors vacuumed and mopped',
      'Bins emptied and liners replaced',
      'Glass and mirrors cleaned',
      'High-touch surfaces disinfected'
    ],
    pricing: [
      { type: 'Small Office (<100sqm)', price: '$150-250/visit', details: 'Weekly or fortnightly' },
      { type: 'Medium Office (100-300sqm)', price: '$250-450/visit', details: 'Custom schedule' },
      { type: 'Large Office (300+sqm)', price: 'Custom quote', details: 'Daily available' },
      { type: 'Medical/Gym', price: 'Custom quote', details: 'Specialist cleaning' }
    ],
    faqs: [
      { question: 'Do you clean after hours?', answer: 'Yes, most of our Liverpool commercial clients prefer after-hours cleaning. We can work early morning, evenings, or weekends to suit your business.' },
      { question: 'Are you insured for commercial work?', answer: 'Yes, we carry $20 million public liability insurance and workers compensation. Certificates available on request.' },
      { question: 'Can you handle medical centre cleaning?', answer: 'Yes, we have experience with medical centres, dental clinics, and allied health practices. We follow infection control protocols and use hospital-grade disinfectants.' }
    ],
    targetSuburbs: ['Liverpool CBD', 'Cabramatta', 'Fairfield', 'Bankstown', 'Parramatta']
  },
  'office-cleaning-western-sydney': {
    slug: 'office-cleaning-western-sydney',
    title: 'Office Cleaning Western Sydney',
    subtitle: 'Professional Janitorial Services',
    description: 'Keep your Western Sydney office spotless with our professional cleaning services. Daily, weekly, or custom schedules to suit your business.',
    metaTitle: 'Office Cleaning Western Sydney | Commercial Cleaners | Clean Up Bros',
    metaDescription: 'Office cleaning Western Sydney. Liverpool, Parramatta, Bankstown, Fairfield. Professional janitorial services. After-hours available. Fully insured. Call 0406 764 585',
    heroImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
    benefits: [
      'Serving all Western Sydney',
      'After-hours and weekend service',
      'Consistent cleaning teams',
      '$20M public liability insurance',
      'Green cleaning options available',
      'Monthly or flexible contracts'
    ],
    included: [
      'Reception and common areas',
      'Individual workstations',
      'Meeting rooms',
      'Kitchen and break areas',
      'All bathrooms',
      'Floor care (vacuum, mop, polish)',
      'Waste removal and recycling'
    ],
    pricing: [
      { type: 'Daily Clean', price: 'From $150/day', details: 'Mon-Fri service' },
      { type: '3x Weekly', price: 'From $120/visit', details: 'Popular choice' },
      { type: 'Weekly', price: 'From $200/visit', details: 'Thorough clean' },
      { type: 'Fortnightly', price: 'From $300/visit', details: 'Deep clean' }
    ],
    faqs: [
      { question: 'What areas of Western Sydney do you cover?', answer: 'We service Liverpool, Parramatta, Bankstown, Fairfield, Campbelltown, Penrith, and all suburbs in between. Liverpool is our base, so no travel fees for most Western Sydney locations.' },
      { question: 'Can we get the same cleaner each time?', answer: 'Yes, we assign dedicated cleaning teams to each client. This ensures consistency and allows cleaners to learn your specific requirements.' },
      { question: 'Do you offer green cleaning?', answer: 'Yes, we offer eco-friendly cleaning options using plant-based, biodegradable products. Great for businesses with sustainability goals.' }
    ],
    targetSuburbs: ['Liverpool', 'Parramatta', 'Bankstown', 'Fairfield', 'Campbelltown', 'Penrith']
  }
};

interface ServiceLandingViewProps {
  navigateTo: (view: ViewType) => void;
  service: ServiceData;
}

export const ServiceLandingView: React.FC<ServiceLandingViewProps> = ({ navigateTo, service }) => {
  // Update page title and meta for SEO
  useEffect(() => {
    document.title = service.metaTitle;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', service.metaDescription);
    }
  }, [service]);

  const getQuoteView = (): ViewType => {
    if (service.slug.includes('residential') || service.slug.includes('bond')) {
      return ServiceType.Residential;
    } else if (service.slug.includes('airbnb')) {
      return ServiceType.Airbnb;
    } else {
      return ServiceType.Commercial;
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${service.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center justify-center gap-2 text-white/60">
              <li>
                <button onClick={() => navigateTo('Landing')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>/</li>
              <li>
                <button onClick={() => navigateTo('Services')} className="hover:text-white transition-colors">
                  Services
                </button>
              </li>
              <li>/</li>
              <li className="text-white font-medium">{service.title}</li>
            </ol>
          </nav>

          {/* Badge */}
          {service.slug.includes('bond') && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#30D158]/10 border border-[#30D158]/30 rounded-full mb-6">
              <span className="text-[#30D158] text-sm font-bold">✓ 100% BOND BACK GUARANTEE</span>
            </div>
          )}

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-tight mb-4">
            {service.title}
          </h1>
          <p className="text-xl md:text-2xl text-[#2997FF] font-medium mb-6">
            {service.subtitle}
          </p>

          {/* Description */}
          <p className="text-lg text-white/60 max-w-3xl mx-auto mb-8 leading-relaxed">
            {service.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={() => navigateTo(getQuoteView())}
              className="px-8 py-4 bg-[#0066CC] text-white text-lg font-semibold rounded-full hover:bg-[#0077ED] transition-all duration-300 hover:scale-[1.02] shadow-[0_0_40px_rgba(0,102,204,0.4)]"
            >
              Get Free Quote →
            </button>
            <a
              href="tel:+61406764585"
              className="px-6 py-4 text-[#2997FF] text-lg font-medium hover:underline flex items-center gap-2"
            >
              📞 Call 0406 764 585
            </a>
          </div>

          {/* Trust Strip */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <span className="text-[#FFD60A]">★</span> 4.9 Google Rating
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#30D158]">✓</span> Fully Insured
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#2997FF]">⚡</span> Same-Day Available
            </span>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-white text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 bg-[#1C1C1E] rounded-xl p-5 border border-white/10 hover:border-[#2997FF]/30 transition-colors"
              >
                <span className="text-[#30D158] text-xl">✓</span>
                <span className="text-white/80">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-8">
                What's Included
              </h2>
              <ul className="space-y-4">
                {service.included.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[#2997FF] mt-1">•</span>
                    <span className="text-white/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-8">
                Pricing Guide
              </h2>
              <div className="space-y-4">
                {service.pricing.map((price, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-[#1C1C1E] rounded-xl p-4 border border-white/10"
                  >
                    <div>
                      <span className="text-white font-medium">{price.type}</span>
                      <p className="text-white/50 text-sm">{price.details}</p>
                    </div>
                    <span className="text-[#2997FF] font-bold text-xl">{price.price}</span>
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-sm mt-4">
                * Final price depends on property condition. Get an exact quote in 60 seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 px-6 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
            Areas We Service
          </h2>
          <p className="text-white/60 mb-8">
            We provide {service.title.toLowerCase()} across Western Sydney including:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {service.targetSuburbs.map((suburb) => (
              <span
                key={suburb}
                className="px-4 py-2 bg-white/10 rounded-full text-white/80 hover:bg-[#0066CC]/20 hover:text-[#2997FF] transition-colors"
              >
                {suburb}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {service.faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#1C1C1E] rounded-2xl p-6 border border-white/10"
              >
                <h3 className="text-white font-semibold mb-3">{faq.question}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#0066CC] to-[#0052A3]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6">
            Ready to Book?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Get your free quote in 60 seconds. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigateTo(getQuoteView())}
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

      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": service.title,
            "description": service.description,
            "provider": {
              "@type": "LocalBusiness",
              "name": "Clean Up Bros",
              "telephone": "+61406764585",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Liverpool",
                "addressRegion": "NSW",
                "postalCode": "2170",
                "addressCountry": "AU"
              }
            },
            "areaServed": service.targetSuburbs.map(s => ({ "@type": "City", "name": s })),
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": service.title,
              "itemListElement": service.pricing.map(p => ({
                "@type": "Offer",
                "name": p.type,
                "description": p.details
              }))
            }
          })
        }}
      />
    </div>
  );
};

export default ServiceLandingView;
