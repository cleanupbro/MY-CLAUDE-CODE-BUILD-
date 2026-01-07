import React, { useState } from 'react';

interface ServiceZone {
  name: string;
  suburbs: string[];
  extraCharge: number;
  color: string;
  description: string;
}

const serviceZones: ServiceZone[] = [
  {
    name: "Zone 1 - Home Base",
    suburbs: ["Liverpool", "Cabramatta", "Casula", "Moorebank", "Prestons", "Edmondson Park", "Ingleburn", "Glenfield", "Leppington", "Carnes Hill", "Hoxton Park", "Green Valley"],
    extraCharge: 0,
    color: "#10B981",
    description: "No travel fee - Our home base!"
  },
  {
    name: "Zone 2 - Extended",
    suburbs: ["Campbelltown", "Parramatta", "Bankstown", "Fairfield", "Blacktown", "Penrith", "Auburn", "Strathfield"],
    extraCharge: 20,
    color: "#F59E0B",
    description: "+$20 travel fee"
  },
  {
    name: "Zone 3 - Greater Sydney",
    suburbs: ["Sydney CBD", "Inner West", "Eastern Suburbs", "Northern Beaches", "Sutherland", "Wollongong"],
    extraCharge: 40,
    color: "#EF4444",
    description: "+$40 travel fee"
  }
];

export const ServiceAreaMap: React.FC = () => {
  const [activeZone, setActiveZone] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const findZoneForSuburb = (suburb: string): ServiceZone | null => {
    const normalizedSearch = suburb.toLowerCase().trim();
    for (const zone of serviceZones) {
      if (zone.suburbs.some(s => s.toLowerCase().includes(normalizedSearch))) {
        return zone;
      }
    }
    return null;
  };

  const searchResult = searchTerm ? findZoneForSuburb(searchTerm) : null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-[#0071e3]/10 text-[#0071e3] px-4 py-2 rounded-full text-sm font-medium mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Western Sydney & Beyond
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mb-3">
          Our Service Areas
        </h2>
        <p className="text-[#86868b] max-w-2xl mx-auto">
          Based in Liverpool, we serve all of Western Sydney and greater Sydney. Check your suburb below!
        </p>
      </div>

      {/* Suburb Search */}
      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter your suburb..."
            className="w-full px-6 py-4 text-lg bg-[#F5F5F7] border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#0071e3] focus:ring-0 outline-none transition-all pr-12"
          />
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Search Result */}
        {searchTerm && (
          <div className={`mt-4 p-4 rounded-xl transition-all ${searchResult ? 'bg-green-50 border border-green-200' : 'bg-orange-50 border border-orange-200'}`}>
            {searchResult ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: searchResult.color + '20' }}>
                  <svg className="w-5 h-5" style={{ color: searchResult.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">We service your area!</p>
                  <p className="text-sm text-gray-600">{searchResult.name} - {searchResult.description}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Suburb not found</p>
                  <p className="text-sm text-gray-600">Contact us to check if we service your area!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zone Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {serviceZones.map((zone, index) => (
          <div
            key={zone.name}
            className={`bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer ${
              activeZone === index
                ? 'border-[#0071e3] shadow-xl scale-105'
                : 'border-gray-100 shadow-md hover:shadow-lg hover:border-gray-200'
            }`}
            onClick={() => setActiveZone(activeZone === index ? null : index)}
          >
            {/* Zone Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: zone.color }}
              />
              <h3 className="font-bold text-lg text-[#1D1D1F]">{zone.name}</h3>
            </div>

            {/* Price Badge */}
            <div
              className="inline-block px-4 py-2 rounded-full text-white font-semibold mb-4"
              style={{ backgroundColor: zone.color }}
            >
              {zone.extraCharge === 0 ? 'No Travel Fee' : `+$${zone.extraCharge} Travel Fee`}
            </div>

            {/* Suburbs List */}
            <div className="space-y-1">
              {zone.suburbs.slice(0, activeZone === index ? zone.suburbs.length : 4).map((suburb) => (
                <div key={suburb} className="flex items-center gap-2 text-gray-600 text-sm">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  {suburb}
                </div>
              ))}
              {activeZone !== index && zone.suburbs.length > 4 && (
                <button className="text-[#0071e3] text-sm font-medium mt-2">
                  + {zone.suburbs.length - 4} more suburbs
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-[#86868b] mb-4">
          Don't see your suburb? We may still service your area!
        </p>
        <a
          href="tel:+61406764585"
          className="inline-flex items-center gap-2 bg-[#0071e3] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#0077ED] transition-all shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Us: 0406 764 585
        </a>
      </div>
    </div>
  );
};

export default ServiceAreaMap;
