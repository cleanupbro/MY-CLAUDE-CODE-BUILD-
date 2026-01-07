
import React, { useState, useEffect, useMemo } from 'react';
import { NavigationProps, ServiceType, ResidentialQuoteData } from '../types';
import { PricingCalculator } from '../lib/priceCalculator';
import { sendToWebhook } from '../services/webhookService';
import { saveSubmission } from '../services/submissionService';
import { saveFailedSubmission } from '../services/failedSubmissionsService';
import { WEBHOOK_URLS } from '../constants';
import { useToast } from '../contexts/ToastContext';

// Modern Hero Component - Matches existing Apple style
const ModernHero = ({
  navigateTo,
  onQuickQuote
}: {
  navigateTo: (view: any) => void,
  onQuickQuote: () => void
}) => (
  <div className="relative min-h-[90vh] flex items-center overflow-hidden bg-black">
    {/* Animated Background */}
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 animate-slow-zoom"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
    </div>

    {/* Floating Elements */}
    <div className="absolute top-20 right-10 w-72 h-72 bg-[#F2B705]/10 rounded-full blur-3xl animate-float" />
    <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#0071e3]/10 rounded-full blur-3xl animate-float-delayed" />

    {/* Content */}
    <div className="relative z-10 max-w-[980px] mx-auto px-4 py-20">
      <div className="max-w-4xl">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
          <span className="flex h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-white text-sm font-medium">#1 Rated in Western Sydney</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-semibold text-white leading-tight mb-6 tracking-tight">
          Making Your Space
          <span className="block text-[#F2B705]">Shine ✨</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
          Professional cleaning with a <strong className="text-white">100% Bond Back Guarantee</strong>.
          Trusted by 500+ families across Liverpool & Western Sydney.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button
            onClick={onQuickQuote}
            className="bg-[#0071e3] text-white text-lg px-10 py-4 rounded-full font-semibold hover:bg-[#0077ED] transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
          >
            Get Instant Quote
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <a
            href="tel:+61406764585"
            className="bg-white/10 backdrop-blur-sm border border-white/30 text-white text-lg px-10 py-4 rounded-full font-semibold hover:bg-white/20 transition-all flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call 0406 764 585
          </a>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '500+', label: 'Happy Clients' },
            { value: '4.9★', label: 'Google Rating' },
            { value: '100%', label: 'Bond Guarantee' },
            { value: '24hr', label: 'Reclean Promise' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-center py-4 px-2">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Scroll Indicator */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </div>
);

// Trust Badges Section - Matching existing style
const TrustBadgesSection = () => (
  <div className="py-8 bg-[#F5F5F7]">
    <div className="max-w-[980px] mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '⭐', title: '4.9/5 Google', subtitle: '150+ reviews', color: 'bg-white' },
          { icon: '🛡️', title: 'Fully Insured', subtitle: '$20M coverage', color: 'bg-white' },
          { icon: '✓', title: 'Police Checked', subtitle: 'All verified', color: 'bg-white' },
          { icon: '🏆', title: 'Bond Guarantee', subtitle: '24hr reclean', color: 'bg-white' },
        ].map((badge, i) => (
          <div key={i} className={`${badge.color} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer text-center`}>
            <div className="text-3xl mb-2">{badge.icon}</div>
            <div className="font-semibold text-[#1D1D1F] text-sm">{badge.title}</div>
            <div className="text-xs text-[#86868b]">{badge.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Hero Unit Component for the full-width sections
const HeroUnit = ({
  title,
  headline,
  description,
  links,
  imageUrl,
  dark = false,
  animated = false,
  onClick
}: {
  title?: string,
  headline: string,
  description: string,
  links: { text: string, action: () => void }[],
  imageUrl: string,
  dark?: boolean,
  animated?: boolean,
  onClick?: () => void
}) => (
  <div onClick={onClick} className={`hero-unit min-h-[600px] md:min-h-[750px] ${dark ? 'bg-black text-white' : 'bg-[#F5F5F7] text-[#1D1D1F]'} mb-3 relative group overflow-hidden`}>
     <div className="hero-unit-text flex flex-col items-center max-w-[90%] md:max-w-[85%] mx-auto z-20 !pt-10 md:!pt-14">
        {title && <h3 className={`text-xl md:text-2xl font-semibold mb-1 ${dark ? 'text-[#F2B705]' : 'text-[#F2B705]'}`}>{title}</h3>}
        {/* SEO UPGRADE: H1 for main hero headline */}
        <h2 className={`text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-2 leading-tight text-center drop-shadow-2xl ${dark ? 'text-white' : 'text-white'}`}>{headline}</h2>
        <p className={`text-xl md:text-2xl font-medium mb-6 text-center max-w-2xl drop-shadow-lg ${dark ? 'text-gray-100' : 'text-white'}`}>{description}</p>

        <div className="flex flex-col md:flex-row gap-4 mt-4 items-center justify-center w-full z-30 pointer-events-auto">
            {links.map((link, i) => (
               <button
                 key={i}
                 onClick={(e) => { e.stopPropagation(); link.action(); }}
                 className={`
                   px-8 py-4 rounded-full transition-all duration-300 font-semibold text-[17px] flex items-center shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95
                   ${dark
                     ? 'bg-white text-[#1D1D1F] hover:bg-gray-100'
                     : 'bg-cta-orange text-white hover:bg-orange-600'
                   }
                 `}
               >
                  {link.text}
               </button>
            ))}
        </div>
     </div>

     {/* Background Image - Full Cover with Zoom Effect */}
     <div
       className={`absolute inset-0 bg-no-repeat bg-cover bg-center z-0 ${animated ? 'animate-slow-zoom' : 'transition-transform duration-[2s] ease-out group-hover:scale-[1.03]'}`}
       style={{ backgroundImage: `url(${imageUrl})` }}
     />

     {/* Gradient Overlay: Darker for better text contrast */}
     <div className={`absolute inset-0 z-0 pointer-events-none ${dark ? 'bg-black/40' : 'bg-gradient-to-b from-black/60 via-black/20 to-black/40'}`} />
  </div>
);

// Smaller Grid Unit Component
const GridUnit = ({ 
  title, 
  headline, 
  description, 
  links, 
  imageUrl, 
  dark = false,
  onClick
}: { 
  title: string, 
  headline: string, 
  description?: string, 
  links?: { text: string, action: () => void }[], 
  imageUrl: string, 
  dark?: boolean,
  onClick: () => void
}) => (
    <div onClick={onClick} className={`relative overflow-hidden cursor-pointer group min-h-[500px] flex flex-col items-center text-center pt-12 ${dark ? 'bg-black text-white' : 'bg-[#F5F5F7] text-[#1D1D1F]'}`}>
        <div className="relative z-20 px-6 animate-fade-in-up flex flex-col items-center h-full">
            <h2 className={`text-4xl md:text-5xl font-semibold tracking-tight mb-2 drop-shadow-xl ${dark ? 'text-white' : 'text-white'}`}>{title}</h2>
            <p className={`text-lg md:text-xl font-normal mb-4 drop-shadow-md ${dark ? 'text-gray-100' : 'text-white'}`}>{headline}</p>
            {description && <p className={`text-sm mb-4 drop-shadow-md ${dark ? 'text-gray-200' : 'text-gray-100'}`}>{description}</p>}
            
            {links && (
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-2">
                    {links.map((link, i) => (
                    <button 
                        key={i} 
                        onClick={(e) => { e.stopPropagation(); link.action(); }} 
                        className={`
                           px-6 py-3 rounded-full transition-all duration-300 font-semibold text-[15px] flex items-center shadow-md hover:shadow-xl transform hover:scale-105 active:scale-95
                           ${dark 
                             ? 'bg-white text-[#1D1D1F] hover:bg-gray-100' 
                             : 'bg-[#0071e3] text-white hover:bg-[#0077ED]'
                           }
                        `}
                    >
                        {link.text}
                    </button>
                    ))}
                </div>
            )}
        </div>
        {/* Gradient Overlay for legibility */}
        <div className={`absolute inset-0 z-10 ${dark ? 'bg-black/50' : 'bg-black/40'}`} />
        
         <div 
            className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0 animate-slow-zoom"
            style={{ backgroundImage: `url(${imageUrl})` }}
        />
    </div>
);

const LandingView: React.FC<NavigationProps> = ({ navigateTo, onSubmissionFail }) => {
  const [isQuickQuoteOpen, setIsQuickQuoteOpen] = useState(false);
  const [quickQuoteData, setQuickQuoteData] = useState({
    suburb: '',
    bedrooms: 1,
    bathrooms: 1,
    serviceType: '' as ResidentialQuoteData['serviceType'],
    phone: '',
  });
  const [quickQuoteEstimate, setQuickQuoteEstimate] = useState<{ price: number } | null>(null);
  const [isEstimateLoading, setIsEstimateLoading] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  
  const priceCalculator = useMemo(() => new PricingCalculator(), []);

  const updateQuickQuoteData = (fields: Partial<typeof quickQuoteData>) => {
    setEstimateError(null);
    setQuickQuoteData(prev => ({ ...prev, ...fields }));
  };
  
  const handleGetFullQuote = async () => {
    if (!quickQuoteEstimate) return;
    setIsSubmitting(true);
    
    const referenceId = `CUB-LEAD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const submissionData = { 
        ...quickQuoteData, 
        priceEstimate: quickQuoteEstimate.price,
        referenceId: referenceId,
        leadSource: 'Landing Page Quick Quote',
        submittedAt: new Date().toISOString()
    };

    const result = await sendToWebhook(WEBHOOK_URLS.LANDING_LEAD, submissionData);
    setIsSubmitting(false);

    if (result.success) {
      await saveSubmission({ type: 'Landing Lead', data: submissionData });
      // Pass the same reference ID and data to Residential view to maintain continuity
      navigateTo(ServiceType.Residential, undefined, { ...quickQuoteData, referenceId });
    } else {
      saveFailedSubmission({ type: 'Landing Lead', data: submissionData });
      onSubmissionFail?.();
      showToast(result.error || "An unexpected error occurred. Your data has been saved.", "error");
    }
  };
  
  useEffect(() => {
    const { suburb, bedrooms, bathrooms, serviceType } = quickQuoteData;
    const canCalculate = suburb && bedrooms > 0 && bathrooms > 0 && serviceType;

    if (!canCalculate) {
      setQuickQuoteEstimate(null);
      return;
    }

    setIsEstimateLoading(true);
    setEstimateError(null);
    const handler = setTimeout(() => {
      const fullQuoteData: ResidentialQuoteData = {
        suburb: suburb,
        bedrooms: bedrooms,
        bathrooms: bathrooms,
        serviceType: serviceType,
        propertyType: 'House',
        condition: 'Standard',
        frequency: 'One-time',
        subscribedToOneYearPlan: false,
        addOns: [],
        preferredDate: '',
        preferredTime: '',
        notes: '',
        fullName: '',
        email: '',
        phone: '',
        agreedToTerms: false,
      };

      const result = priceCalculator.calculateResidential(fullQuoteData);

      if (result) {
        setQuickQuoteEstimate({ price: result.total });
        setEstimateError(null);
      } else {
        setQuickQuoteEstimate(null);
        setEstimateError("Unable to calculate estimate with the provided details.");
      }
      setIsEstimateLoading(false);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [quickQuoteData, priceCalculator]);

  return (
    <div className="w-full bg-white">

      {/* Quick Quote Modal - Clean Solid Design */}
      {isQuickQuoteOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
           <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative">
              <button onClick={() => setIsQuickQuoteOpen(false)} className="absolute top-4 right-4 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors">
                 <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#0071e3] flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#1D1D1F]">Instant Quote</h3>
                  <p className="text-[#86868b] text-sm">Get your price in 30 seconds</p>
                </div>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-semibold text-[#1D1D1F] mb-2">Suburb</label>
                    <input
                      type="text"
                      value={quickQuoteData.suburb}
                      onChange={e => updateQuickQuoteData({ suburb: e.target.value })}
                      className="w-full px-4 py-3 text-[17px] text-[#1D1D1F] bg-[#F5F5F7] border-2 border-transparent rounded-xl focus:bg-white focus:border-[#0071e3] focus:ring-0 outline-none transition-all placeholder-gray-400"
                      placeholder="e.g. Liverpool, Cabramatta"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-[#1D1D1F] mb-2">Bedrooms</label>
                        <input
                          type="number"
                          value={quickQuoteData.bedrooms}
                          onChange={e => updateQuickQuoteData({ bedrooms: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 text-[17px] text-[#1D1D1F] bg-[#F5F5F7] border-2 border-transparent rounded-xl focus:bg-white focus:border-[#0071e3] focus:ring-0 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-[#1D1D1F] mb-2">Bathrooms</label>
                        <input
                          type="number"
                          value={quickQuoteData.bathrooms}
                          onChange={e => updateQuickQuoteData({ bathrooms: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-3 text-[17px] text-[#1D1D1F] bg-[#F5F5F7] border-2 border-transparent rounded-xl focus:bg-white focus:border-[#0071e3] focus:ring-0 outline-none transition-all"
                        />
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-[#1D1D1F] mb-2">Service Type</label>
                    <select
                      value={quickQuoteData.serviceType}
                      onChange={e => updateQuickQuoteData({ serviceType: e.target.value as any })}
                      className="w-full px-4 py-3 text-[17px] text-[#1D1D1F] bg-[#F5F5F7] border-2 border-transparent rounded-xl focus:bg-white focus:border-[#0071e3] focus:ring-0 outline-none transition-all cursor-pointer"
                    >
                        <option value="" disabled>Select service...</option>
                        <option value="General">General Clean</option>
                        <option value="Deep">Deep Clean</option>
                        <option value="End-of-Lease">End-of-Lease</option>
                        <option value="Post-Construction">Post-Construction</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-[#1D1D1F] mb-2">📱 Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={quickQuoteData.phone}
                      onChange={e => updateQuickQuoteData({ phone: e.target.value })}
                      className="w-full px-4 py-3 text-[17px] text-[#1D1D1F] bg-[#F5F5F7] border-2 border-transparent rounded-xl focus:bg-white focus:border-[#0071e3] focus:ring-0 outline-none transition-all placeholder-gray-400"
                      placeholder="0400 000 000"
                    />
                    <p className="text-xs text-[#86868b] mt-1">We'll send your quote via SMS</p>
                 </div>

                 {/* Price Display */}
                 <div className="pt-4 min-h-[100px] flex items-center justify-center">
                    {isEstimateLoading ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 border-4 border-[#0071e3] border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-[#86868b] text-[17px]">Calculating...</span>
                        </div>
                    ) : quickQuoteEstimate ? (
                        <div className="text-center bg-green-50 rounded-2xl p-6 w-full border border-green-200">
                            <p className="text-sm text-[#86868b] font-medium uppercase tracking-wide">Your Estimate</p>
                            <p className="text-5xl font-bold text-green-600 mt-1">${quickQuoteEstimate.price.toFixed(0)}</p>
                            <p className="text-xs text-[#86868b] mt-2">Including GST • Bond Back Guaranteed</p>
                        </div>
                    ) : (
                        <div className="text-center text-[#86868b] py-6">
                          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm">Fill in the details above</p>
                        </div>
                    )}
                 </div>

                 <button
                   onClick={handleGetFullQuote}
                   disabled={!quickQuoteEstimate || isSubmitting || !quickQuoteData.phone}
                   className="w-full bg-[#0071e3] text-white py-4 text-[17px] font-semibold rounded-xl hover:bg-[#0077ED] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {isSubmitting ? 'Processing...' : !quickQuoteData.phone ? 'Enter Phone to Continue' : 'Get Full Quote →'}
                 </button>
                 <p className="text-center text-xs text-[#86868b]">No spam, just your personalized quote</p>
              </div>
           </div>
        </div>
      )}

      {/* NEW Modern Glassmorphism Hero */}
      <ModernHero navigateTo={navigateTo} onQuickQuote={() => setIsQuickQuoteOpen(true)} />

      {/* Trust Badges Section */}
      <TrustBadgesSection />

      {/* NDIS Badge Row */}
      <div className="py-6 bg-gray-50">
        <div className="max-w-[980px] mx-auto px-4 flex flex-wrap justify-center items-center gap-6">
          {/* We Love NDIS Logo */}
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm hover:shadow-md transition-all duration-300">
            <img
              src="/ndis-logo.jpg"
              alt="We Love NDIS - Registered Provider"
              className="h-12 w-auto object-contain"
            />
            <span className="text-sm font-medium text-gray-700">NDIS Registered</span>
          </div>

          {/* ABN Badge */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">ABN: 26 443 426 374</span>
          </div>

          {/* Liverpool Based */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm">
            <svg className="w-5 h-5 text-deep-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Liverpool, NSW</span>
          </div>
        </div>
      </div>

      {/* Unit 3 - Light Mode (Mimics iPhone Air) */}
      <HeroUnit
        headline="Airbnb Turnovers."
        description="The fastest turnover ever. 5-star ready."
        imageUrl="https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2168&auto=format&fit=crop"
        animated={true}
        links={[
            { text: 'Learn more', action: () => navigateTo('Services') },
            { text: 'Get a quote', action: () => navigateTo(ServiceType.Airbnb) }
        ]}
        onClick={() => navigateTo(ServiceType.Airbnb)}
        dark={true} // Setting to dark mode style for better text visibility on this image
      />

      {/* Bento Grid - (Mimics Accessories/Watch/iPad) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 max-w-[1600px] mx-auto">
          {/* Commercial - FIXED VISIBILITY */}
          <GridUnit 
            title="Commercial"
            headline="Business class."
            imageUrl="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2338&auto=format&fit=crop"
            links={[
                { text: 'Learn more', action: () => navigateTo('Services') },
                { text: 'Contact us', action: () => navigateTo('Contact') }
            ]}
            onClick={() => navigateTo(ServiceType.Commercial)}
            dark={false} 
          />

          {/* Careers */}
          <GridUnit 
            title="Careers"
            headline="Join the team."
            description="Grow your career with flexible hours."
            imageUrl="https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop"
            links={[
                { text: 'Apply now', action: () => navigateTo(ServiceType.Jobs) }
            ]}
            onClick={() => navigateTo(ServiceType.Jobs)}
            dark={true} 
          />

          {/* Reviews */}
          <GridUnit 
            title="Reviews"
            headline="What people say."
            imageUrl="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop"
             links={[
                { text: 'Read reviews', action: () => navigateTo('Reviews') },
                { text: 'Leave feedback', action: () => navigateTo('ClientFeedback') }
            ]}
            onClick={() => navigateTo('ClientFeedback')}
            dark={true}
          />

           {/* Clean Up Card */}
           <GridUnit 
            title="Clean Up Card"
            headline="Get up to 15% off."
            description="Subscribe to our yearly plan."
            imageUrl="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop"
            links={[
                { text: 'Learn more', action: () => navigateTo('About') }
            ]}
            onClick={() => navigateTo(ServiceType.Residential)}
            dark={true}
          />
      </div>
      
      <div className="py-12 bg-white text-center">
         <p className="text-sm text-gray-500 max-w-3xl mx-auto px-4">
            1. Subscription required for 15% discount. Terms and conditions apply. <br/>
            2. Bond back guarantee applies to End of Lease cleans only.
         </p>
      </div>
    </div>
  );
};

export default LandingView;
