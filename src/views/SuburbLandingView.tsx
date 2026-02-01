import React, { useEffect } from 'react';
import { ViewType } from '../types';

interface SuburbData {
  name: string;
  postcode: string;
  description: string;
  nearbySuburbs: string[];
  landmarks?: string[];
}

interface SuburbLandingViewProps {
  navigateTo: (view: ViewType) => void;
  suburb: SuburbData;
}

// Suburb data configuration
export const SUBURBS: Record<string, SuburbData> = {
  'liverpool': {
    name: 'Liverpool',
    postcode: '2170',
    description: 'Liverpool is the heart of Western Sydney, known for Westfield Liverpool shopping centre and Liverpool Hospital. Our team is based right here - no travel fees!',
    nearbySuburbs: ['Casula', 'Moorebank', 'Warwick Farm', 'Chipping Norton', 'Holsworthy'],
    landmarks: ['Westfield Liverpool', 'Liverpool Hospital', 'Bigge Park', 'Liverpool Station'],
  },
  'cabramatta': {
    name: 'Cabramatta',
    postcode: '2166',
    description: 'Cabramatta is famous for its vibrant Vietnamese community and amazing food scene. We provide regular cleaning services to homes and businesses throughout the Cabramatta area.',
    nearbySuburbs: ['Canley Vale', 'Canley Heights', 'Fairfield', 'Lansvale', 'Bonnyrigg'],
    landmarks: ['Cabramatta Station', 'Freedom Plaza', 'Cabra-Vale Park'],
  },
  'casula': {
    name: 'Casula',
    postcode: '2170',
    description: 'Casula is home to the Casula Powerhouse Arts Centre and beautiful residential areas. We serve families and businesses across Casula with reliable cleaning services.',
    nearbySuburbs: ['Liverpool', 'Moorebank', 'Prestons', 'Lurnea', 'Hammondville'],
    landmarks: ['Casula Powerhouse', 'Casula Mall', 'Georges River'],
  },
  'moorebank': {
    name: 'Moorebank',
    postcode: '2170',
    description: 'Moorebank features a mix of residential homes and the major Moorebank Logistics Park. We provide cleaning for homes and commercial spaces across the suburb.',
    nearbySuburbs: ['Liverpool', 'Casula', 'Holsworthy', 'Chipping Norton', 'Hammondville'],
    landmarks: ['Moorebank Sports Club', 'Georges River', 'Moorebank Intermodal'],
  },
  'prestons': {
    name: 'Prestons',
    postcode: '2170',
    description: 'Prestons is a growing suburb with new developments and family homes. Our team provides end-of-lease cleaning for the many rental properties in the area.',
    nearbySuburbs: ['Casula', 'Lurnea', 'Edmondson Park', 'Hoxton Park', 'West Hoxton'],
    landmarks: ['Prestons Public School', 'Ed Square', 'Edmondson Park Station'],
  },
  'bankstown': {
    name: 'Bankstown',
    postcode: '2200',
    description: 'Bankstown is a major centre in South Western Sydney with bustling shopping areas and diverse communities. We service homes and offices throughout Bankstown.',
    nearbySuburbs: ['Bass Hill', 'Yagoona', 'Condell Park', 'Revesby', 'Greenacre'],
    landmarks: ['Bankstown Central', 'Paul Keating Park', 'Bankstown Station'],
  },
  'fairfield': {
    name: 'Fairfield',
    postcode: '2165',
    description: 'Fairfield is a diverse, multicultural suburb with great local shops and restaurants. We provide reliable cleaning services to the Fairfield community.',
    nearbySuburbs: ['Cabramatta', 'Canley Heights', 'Smithfield', 'Fairfield Heights', 'Yennora'],
    landmarks: ['Fairfield Forum', 'Neeta City', 'Fairfield Showground'],
  },
  'campbelltown': {
    name: 'Campbelltown',
    postcode: '2560',
    description: 'Campbelltown is a major city in the Macarthur region with beautiful parks and growing residential areas. We serve Campbelltown with professional cleaning services.',
    nearbySuburbs: ['Ingleburn', 'Minto', 'Macquarie Fields', 'Leumeah', 'Bradbury'],
    landmarks: ['Macarthur Square', 'Campbelltown Hospital', 'Western Sydney University'],
  },
  'ingleburn': {
    name: 'Ingleburn',
    postcode: '2565',
    description: 'Ingleburn is a family-friendly suburb in the Macarthur region. We provide regular and end-of-lease cleaning for homes throughout Ingleburn.',
    nearbySuburbs: ['Campbelltown', 'Minto', 'Glenfield', 'Macquarie Fields', 'Denham Court'],
    landmarks: ['Ingleburn Reserve', 'Ingleburn Station', 'Bow Bowing Creek'],
  },
  'glenfield': {
    name: 'Glenfield',
    postcode: '2167',
    description: 'Glenfield is a growing suburb with the new Western Sydney University campus and Glenfield Farm. We provide cleaning services to the Glenfield community.',
    nearbySuburbs: ['Ingleburn', 'Casula', 'Macquarie Fields', 'Edmondson Park', 'Leppington'],
    landmarks: ['Western Sydney University', 'Glenfield Farm', 'Glenfield Station'],
  },
  'edmondson-park': {
    name: 'Edmondson Park',
    postcode: '2174',
    description: 'Edmondson Park is one of Sydney\'s newest suburbs with modern homes and Ed.Square Town Centre. We specialise in end-of-lease cleaning for the many new rentals here.',
    nearbySuburbs: ['Prestons', 'Leppington', 'Denham Court', 'Bardia', 'Ingleburn'],
    landmarks: ['Ed.Square', 'Edmondson Park Station', 'Veterans Memorial'],
  },
};

export const SuburbLandingView: React.FC<SuburbLandingViewProps> = ({ navigateTo, suburb }) => {
  // Update page title and meta for SEO
  useEffect(() => {
    document.title = `Cleaning Services ${suburb.name} ${suburb.postcode} | Bond Cleaning | Clean Up Bros`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        `Professional cleaning services in ${suburb.name} NSW ${suburb.postcode}. End of lease, bond cleaning, residential & commercial. 100% bond back guarantee. Same-day quotes. Call 0406 764 585`
      );
    }
  }, [suburb]);

  const services = [
    {
      title: 'End of Lease Cleaning',
      description: `Moving out in ${suburb.name}? Our professional end of lease cleaning ensures you get your full bond back. We work with all ${suburb.name} real estate agents.`,
      price: 'From $250',
      icon: '🏠',
    },
    {
      title: 'Bond Cleaning',
      description: `100% bond back guarantee for ${suburb.name} properties. We know exactly what real estate agents in ${suburb.postcode} are looking for.`,
      price: 'From $250',
      icon: '✅',
    },
    {
      title: 'Residential Cleaning',
      description: `Regular house cleaning for ${suburb.name} families. Weekly, fortnightly, or one-off deep cleans available.`,
      price: 'From $120',
      icon: '🧹',
    },
    {
      title: 'Commercial Cleaning',
      description: `Office and commercial cleaning in ${suburb.name}. Daily, weekly, or custom schedules for local businesses.`,
      price: 'From $150',
      icon: '🏢',
    },
    {
      title: 'Airbnb Cleaning',
      description: `Quick turnovers for ${suburb.name} Airbnb hosts. Same-day service available to keep your property 5-star ready.`,
      price: 'From $80',
      icon: '✈️',
    },
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-[#0066CC]/20 to-black">
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
              <li>
                <button onClick={() => navigateTo('Services')} className="hover:text-white transition-colors">
                  Service Areas
                </button>
              </li>
              <li>/</li>
              <li className="text-white font-medium">{suburb.name}</li>
            </ol>
          </nav>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#30D158]/10 border border-[#30D158]/30 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
            </span>
            <span className="text-[#30D158] text-sm font-medium">Serving {suburb.name} {suburb.postcode}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-tight mb-6">
            Cleaning Services<br />
            <span className="text-[#2997FF]">{suburb.name}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-8 leading-relaxed">
            Professional cleaning services in {suburb.name} NSW {suburb.postcode}. 
            End of lease, bond cleaning, residential, commercial & Airbnb cleaning. 
            <strong className="text-white"> 100% Bond Back Guarantee.</strong>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={() => navigateTo('Residential')}
              className="px-8 py-4 bg-[#0066CC] text-white text-lg font-semibold rounded-full hover:bg-[#0077ED] transition-all duration-300 hover:scale-[1.02] shadow-[0_0_40px_rgba(0,102,204,0.4)]"
            >
              Get Free Quote for {suburb.name} →
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
              <span className="text-[#30D158]">✓</span> 100% Bond Back
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#2997FF]">⚡</span> Same-Day Available
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#FF9500]">🛡️</span> Fully Insured
            </span>
          </div>
        </div>
      </section>

      {/* About This Suburb */}
      <section className="py-16 px-6 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-6">
                Professional Cleaners in {suburb.name}
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                {suburb.description}
              </p>
              <p className="text-white/70 leading-relaxed mb-6">
                Whether you need end of lease cleaning, regular house cleaning, or commercial office cleaning in {suburb.name}, 
                Clean Up Bros has you covered. We're local, reliable, and offer a 100% satisfaction guarantee.
              </p>
              {suburb.landmarks && (
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">We service areas near:</h3>
                  <div className="flex flex-wrap gap-2">
                    {suburb.landmarks.map((landmark) => (
                      <span key={landmark} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">
                        {landmark}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="bg-[#1C1C1E] rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-6">
                Quick Quote for {suburb.name}
              </h3>
              <div className="space-y-4">
                <button
                  onClick={() => navigateTo('Residential')}
                  className="w-full py-4 bg-[#0066CC] text-white font-semibold rounded-xl hover:bg-[#0077ED] transition-colors"
                >
                  End of Lease / Bond Clean
                </button>
                <button
                  onClick={() => navigateTo('Residential')}
                  className="w-full py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
                >
                  Regular House Cleaning
                </button>
                <button
                  onClick={() => navigateTo('Commercial')}
                  className="w-full py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
                >
                  Commercial / Office Cleaning
                </button>
                <button
                  onClick={() => navigateTo('Airbnb')}
                  className="w-full py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
                >
                  Airbnb Turnover Cleaning
                </button>
              </div>
              <p className="text-center text-white/50 text-sm mt-4">
                Or call <a href="tel:+61406764585" className="text-[#2997FF] hover:underline">0406 764 585</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services in This Suburb */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Our Services in {suburb.name}
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Professional cleaning services tailored for {suburb.name} {suburb.postcode} residents and businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-[#1C1C1E] rounded-2xl p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <span className="text-4xl mb-4 block">{service.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[#2997FF] font-semibold">{service.price}</span>
                  <button
                    onClick={() => navigateTo('Residential')}
                    className="text-white/60 hover:text-[#2997FF] text-sm font-medium transition-colors"
                  >
                    Get Quote →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Suburbs */}
      <section className="py-16 px-6 bg-[#0D0D0D]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Also Serving Nearby Suburbs
            </h2>
            <p className="text-white/60">
              We provide cleaning services across {suburb.name} and surrounding areas including:
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {suburb.nearbySuburbs.map((nearbySuburb) => (
              <span
                key={nearbySuburb}
                className="px-4 py-2 bg-white/10 rounded-full text-white/80 hover:bg-[#0066CC]/20 hover:text-[#2997FF] transition-colors cursor-pointer"
              >
                {nearbySuburb}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ for This Suburb */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Cleaning FAQ for {suburb.name}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-2">
                How much does end of lease cleaning cost in {suburb.name}?
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                End of lease cleaning in {suburb.name} {suburb.postcode} typically costs between $250-$700 depending on property size. 
                A 2-bedroom apartment is around $300-$400, while a 3-bedroom house is $400-$550. 
                We include a 100% bond back guarantee with all cleans.
              </p>
            </div>

            <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-2">
                Do you offer same-day cleaning in {suburb.name}?
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Yes! We offer same-day and next-day cleaning services in {suburb.name} when availability permits. 
                For guaranteed availability, we recommend booking 2-3 days in advance. 
                Call 0406 764 585 for urgent bookings.
              </p>
            </div>

            <div className="bg-[#1C1C1E] rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-2">
                What's included in bond cleaning for {suburb.name} properties?
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Our comprehensive bond cleaning in {suburb.name} includes all rooms dusted and vacuumed, 
                floors mopped, kitchen deep clean (oven, rangehood, appliances), bathroom sanitisation, 
                window sills and tracks, light switches and door handles, cobweb removal, and skirting boards. 
                Carpet steam cleaning and window cleaning available as add-ons.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#0066CC] to-[#0052A3]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-semibold text-white mb-6">
            Ready for a Spotless Home in {suburb.name}?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Get a free quote in 60 seconds. No credit card required. 100% bond back guarantee.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigateTo('Residential')}
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

      {/* LocalBusiness Schema for this suburb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": `Clean Up Bros - ${suburb.name} Cleaning Services`,
            "description": `Professional cleaning services in ${suburb.name} NSW ${suburb.postcode}. End of lease, bond cleaning, residential & commercial. 100% bond back guarantee.`,
            "url": `https://cleanupbros.com.au/cleaning-services-${suburb.name.toLowerCase().replace(' ', '-')}`,
            "telephone": "+61406764585",
            "email": "cleanupbros.au@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": suburb.name,
              "addressRegion": "NSW",
              "postalCode": suburb.postcode,
              "addressCountry": "AU"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": -33.92,
              "longitude": 150.93
            },
            "areaServed": [
              { "@type": "City", "name": suburb.name },
              ...suburb.nearbySuburbs.map(s => ({ "@type": "City", "name": s }))
            ],
            "priceRange": "$$",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "187"
            }
          })
        }}
      />
    </div>
  );
};

export default SuburbLandingView;
