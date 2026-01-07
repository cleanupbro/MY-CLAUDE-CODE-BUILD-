
import React, { useState, useMemo } from 'react';
import { MultiStepForm } from '../components/MultiStepForm';
import { ResidentialQuoteData, NavigationProps, ServiceType } from '../types';
import { sendToWebhook } from '../services/webhookService';
import { saveSubmission } from '../services/submissionService';
import { saveFailedSubmission } from '../services/failedSubmissionsService';
import { WEBHOOK_URLS, SUCCESS_MESSAGES } from '../constants';
import { PricingCalculator } from '../lib/priceCalculator';
import { Checkbox } from '../components/Checkbox';
import { DateInput } from '../components/DateInput';
import { useToast } from '../contexts/ToastContext';

const formatPhoneNumber = (value: string) => {
  const digitsOnly = value.replace(/\D/g, '');
  const limitedDigits = digitsOnly.slice(0, 10);
  if (limitedDigits.length > 7) {
    return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 7)}-${limitedDigits.slice(7, 10)}`;
  }
  if (limitedDigits.length > 4) {
    return `${limitedDigits.slice(0, 4)}-${limitedDigits.slice(4, 7)}`;
  }
  return limitedDigits;
};

const INITIAL_DATA: ResidentialQuoteData = {
  suburb: '',
  propertyType: '',
  bedrooms: 1,
  bathrooms: 1,
  serviceType: '',
  condition: 'Standard',
  frequency: '',
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

const PriceEstimateDisplay: React.FC<{ estimate: { price: number } | null, isLoading: boolean, frequency: string, condition: string, error: string | null }> = ({ estimate, isLoading, frequency, condition, error }) => {
    
    if (condition === 'Extreme') {
        return (
            <div className="p-4 bg-yellow-50 border-2 border-brand-gold rounded-lg text-center shadow-md mt-6 animate-fade-in-up">
                <p className="text-sm font-semibold text-brand-navy">CUSTOM QUOTE REQUIRED</p>
                <p className="text-gray-600 my-2 text-sm">Due to the condition of the property (Hoarding/Biohazard), we need to discuss details to provide an accurate price.</p>
                <p className="text-xs text-gray-500">Please submit the form and our team will call you shortly.</p>
            </div>
        );
    }

    const getFrequencyText = () => {
        if (!frequency || frequency === 'One-time') return 'per clean';
        return `per ${frequency.replace('-weekly', ' week').toLowerCase()}`;
    }

    return (
        <div className="p-4 bg-blue-50 border-2 border-brand-gold rounded-lg text-center shadow-md mt-6">
            <div className="flex items-center justify-center gap-1 mb-2">
                <p className="text-sm font-semibold text-brand-navy">INSTANT ESTIMATE</p>
                <div className="relative group inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-56 pointer-events-none z-10 shadow-lg">
                        This price is AI-generated based on standard rates. Final quote will be confirmed upon booking or inspection.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                </div>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center my-4">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600">Calculating...</p>
                </div>
            ) : error ? (
                <div className="my-2 p-2 bg-red-50 border-red-300 text-red-800 rounded-lg">
                    <p className="font-bold text-sm">Estimation Failed</p>
                    <p className="text-xs mt-1">{error}</p>
                </div>
            ) : estimate ? (
                <p className="text-4xl font-bold text-brand-navy my-2">${estimate.price.toFixed(2)} <span className="text-xl font-semibold">{getFrequencyText()}</span></p>
            ) : (
                 <p className="text-gray-600 my-4">Complete the form to see an estimate.</p>
            )}
             <p className="text-xs text-gray-500 mt-2">Final price will be confirmed upon booking. This is an AI-generated estimate.</p>
        </div>
    );
};

const ResidentialQuoteView: React.FC<NavigationProps & { initialData?: Partial<ResidentialQuoteData> }> = ({ navigateTo, initialData, onSubmissionFail }) => {
  const [data, setData] = useState({ ...INITIAL_DATA, ...initialData });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { showToast } = useToast();

  const updateData = (fields: Partial<ResidentialQuoteData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };
  
  const priceCalculator = useMemo(() => new PricingCalculator(), []);

  const estimate = useMemo(() => {
      const canCalculate = data.suburb && data.propertyType && data.bedrooms && data.bathrooms && data.serviceType && data.frequency;
      if (!canCalculate) return null;
      
      const result = priceCalculator.calculateResidential(data);
      if (result) {
        return { price: result.total };
      }
      return null;
  }, [data, priceCalculator]);


  const handleAddOnsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setData(prev => {
      const currentValues = prev.addOns;
      if (checked) {
        return { ...prev, addOns: [...currentValues, value] };
      } else {
        return { ...prev, addOns: currentValues.filter(item => item !== value) };
      }
    });
  };

  const onSubmit = async () => {
    setSubmissionError(null);

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        const errorMsg = "Please enter a valid email address.";
        setSubmissionError(errorMsg);
        showToast(errorMsg, "error");
        return;
    }

    setIsSubmitting(true);
    
    // Generate Reference ID
    const referenceId = `CUB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const successMsg = SUCCESS_MESSAGES[ServiceType.Residential];
    
    // Add extra details for webhook
    const submissionData = { 
        ...data, 
        priceEstimate: estimate?.price,
        referenceId: referenceId,
        confirmationMessage: "Booking Confirmed",
        displayMessage: successMsg,
        submittedAt: new Date().toISOString()
    };

    const result = await sendToWebhook(WEBHOOK_URLS[ServiceType.Residential], submissionData);
    setIsSubmitting(false);

    if (result.success) {
      await saveSubmission({ type: ServiceType.Residential, data: submissionData });
      // Pass referenceId in state so Success View can display it
      navigateTo('Success', successMsg, { referenceId });
    } else {
      saveFailedSubmission({ type: ServiceType.Residential, data: submissionData });
      onSubmissionFail?.();
      const errorMsg = result.error || "An unexpected error occurred. Your data has been saved for a later retry.";
      setSubmissionError(errorMsg);
      showToast(errorMsg, "error");
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
        .hero-quote h1 {
          font-family: 'Clash Display', sans-serif;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
      <section className="hero-quote relative min-h-[50vh] bg-[#1A1A1A] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#1A1A1A]" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center py-16 px-6">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 bg-[#C8FF00]/20 border border-[#C8FF00]/50 rounded-full px-4 py-2 mb-4">
            <span className="w-2 h-2 bg-[#C8FF00] rounded-full animate-ping" />
            <span className="text-[#C8FF00] text-sm font-semibold uppercase tracking-wider">END OF LEASE & BOND CLEANING SPECIALISTS</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Liverpool's #1 <span className="text-[#C8FF00]">Bond Clean</span> Experts
          </h1>

          {/* SEO-rich subtitle */}
          <p className="text-lg md:text-xl text-white/80 mb-4 max-w-3xl mx-auto">
            Liverpool's trusted bond cleaning experts. <strong className="text-white">100% bond back guarantee</strong> on every end of lease, vacate & deep cleaning service across Western Sydney.
          </p>

          {/* Service area keywords */}
          <p className="text-sm text-white/60 mb-6">
            Servicing Liverpool, Cabramatta, Casula, Moorebank, Prestons & Edmondson Park
          </p>

          {/* Trust Badges */}
          <div className="flex justify-center gap-4 flex-wrap mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <svg className="w-5 h-5 text-[#C8FF00]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white text-sm font-medium">Liverpool's #1 Rated</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <svg className="w-5 h-5 text-[#FF6B4A]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white text-sm font-medium">187+ 5-Star Reviews</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <svg className="w-5 h-5 text-[#00D4FF]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white text-sm font-medium">Bond Back Guarantee</span>
            </div>
          </div>

          {/* Animated Stats */}
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C8FF00]">500+</div>
              <div className="text-sm text-white/60">Happy Homes in Liverpool</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FF6B4A]">4.9★</div>
              <div className="text-sm text-white/60">Google Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00D4FF]">100%</div>
              <div className="text-sm text-white/60">Bond Back Rate</div>
            </div>
          </div>
        </div>
      </section>

      <MultiStepForm
        title="Residential Quote"
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        submissionError={submissionError}
        steps={[
          // Step 1: Property Details
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Property Details</h3>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Suburb</label>
              <input type="text" value={data.suburb} onChange={e => updateData({ suburb: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Property Type</label>
              <select value={data.propertyType} onChange={e => updateData({ propertyType: e.target.value as ResidentialQuoteData['propertyType'] })} className="select" required>
                <option value="" disabled>Select...</option>
                <option>Apartment</option>
                <option>Townhouse</option>
                <option>House</option>
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#1D1D1F]">Bedrooms</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" value={data.bedrooms || ''} onChange={e => updateData({ bedrooms: parseInt(e.target.value, 10) || 0 })} onBlur={() => { if (data.bedrooms < 1) { updateData({ bedrooms: 1 }) } }} className="input" required />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#1D1D1F]">Bathrooms</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" value={data.bathrooms || ''} onChange={e => updateData({ bathrooms: parseInt(e.target.value, 10) || 0 })} onBlur={() => { if (data.bathrooms < 1) { updateData({ bathrooms: 1 }) } }} className="input" required />
              </div>
            </div>
          </div>,

          // Step 2: Service Details
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Details</h3>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Service Type</label>
              <select value={data.serviceType} onChange={e => updateData({ serviceType: e.target.value as ResidentialQuoteData['serviceType'] })} className="select" required>
                <option value="" disabled>Select...</option>
                <option>General</option>
                <option>Deep</option>
                <option>End-of-Lease</option>
                <option>Post-Construction</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Property Condition</label>
              <select value={data.condition} onChange={e => updateData({ condition: e.target.value as ResidentialQuoteData['condition'] })} className="select" required>
                <option value="Standard">Standard (Well-maintained)</option>
                <option value="Moderate">Moderate (Regular use, some buildup)</option>
                <option value="Heavy">Heavy (Neglected, significant buildup)</option>
                <option value="Extreme">Extreme (Hoarding, Biohazard)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Frequency</label>
              <select value={data.frequency} onChange={e => updateData({ frequency: e.target.value as ResidentialQuoteData['frequency'] })} className="select" required>
                <option value="" disabled>Select...</option>
                <option>One-time</option>
                <option>Weekly</option>
                <option>Bi-weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            {data.frequency !== 'One-time' && data.frequency !== '' && (
              <label htmlFor="toggle-plan" className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer bg-green-50 border-green-300">
                  <div className="toggle-switch mr-3">
                    <input id="toggle-plan" type="checkbox" className="toggle-input" checked={data.subscribedToOneYearPlan} onChange={(e) => updateData({ subscribedToOneYearPlan: e.target.checked })} />
                    <div className="toggle-bg"></div>
                  </div>
                  <div className="ml-3">
                      <span className="font-bold text-brand-navy">Save 15% with a 1-Year Plan!</span>
                      <p className="text-xs text-gray-600">Commit to a year of sparkling clean and enjoy our best rates.</p>
                  </div>
              </label>
            )}
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Add-ons</label>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {['Oven Cleaning', 'Window Cleaning', 'Carpet Steam Cleaning', 'Fridge Cleaning', 'Wall Washing', 'Balcony/Patio Clean', 'Garage Cleaning'].map(item => (
                  <Checkbox key={item} id={`addon-${item}`} value={item} checked={data.addOns.includes(item)} onChange={handleAddOnsChange} label={item} />
                ))}
              </div>
            </div>
          </div>,
          
          // Step 3: Scheduling
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Scheduling & Notes</h3>
             <DateInput 
                label="Preferred Date" 
                value={data.preferredDate} 
                onChange={(val) => updateData({ preferredDate: val })} 
                required 
             />
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Preferred Time</label>
              <select value={data.preferredTime} onChange={e => updateData({ preferredTime: e.target.value as ResidentialQuoteData['preferredTime'] })} className="select" required>
                <option value="" disabled>Select...</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Flexible</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Notes for the cleaning team (optional)</label>
              <textarea value={data.notes} onChange={e => updateData({ notes: e.target.value })} rows={4} className="input"></textarea>
            </div>
          </div>,

          // Step 4: Contact & Confirm
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact & Confirmation</h3>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Full Name</label>
              <input type="text" value={data.fullName} onChange={e => updateData({ fullName: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Email</label>
              <input type="email" value={data.email} onChange={e => updateData({ email: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Phone</label>
              <input type="tel" value={data.phone} onChange={e => updateData({ phone: formatPhoneNumber(e.target.value) })} className="input" required maxLength={12} placeholder="e.g. 0400-123-456" />
            </div>
            <PriceEstimateDisplay estimate={estimate} isLoading={false} frequency={data.frequency} condition={data.condition} error={null} />
            <div className="pt-2">
              <Checkbox 
                  id="terms"
                  value="true"
                  checked={data.agreedToTerms}
                  onChange={e => updateData({ agreedToTerms: e.target.checked })}
                  label="I agree to the terms and conditions."
              />
            </div>
          </div>
        ]}
      />
    </>
  );
};

export default ResidentialQuoteView;
