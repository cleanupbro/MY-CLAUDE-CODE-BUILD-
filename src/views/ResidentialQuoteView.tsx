
import React, { useState, useMemo, useEffect } from 'react';
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
import { LivePriceEstimate } from '../components/LivePriceEstimate';
import { SubmitConfetti, AutoSaveToast, useAutoSave } from '../components/FormEffects';

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

const ResidentialQuoteView: React.FC<NavigationProps & { initialData?: Partial<ResidentialQuoteData> }> = ({ navigateTo, initialData, onSubmissionFail }) => {
  const [data, setData] = useState({ ...INITIAL_DATA, ...initialData });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { showToast } = useToast();

  // Auto-save functionality
  const { isSaved, loadSaved, clearSaved } = useAutoSave('residential-quote', data, 2000);

  // Load saved data on mount
  useEffect(() => {
    const savedData = loadSaved();
    if (savedData && !initialData) {
      setData(prev => ({ ...prev, ...savedData }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      clearSaved(); // Clear auto-saved data on success
      setShowSuccess(true);
      // Brief delay to show confetti, then navigate
      setTimeout(() => {
        navigateTo('Success', successMsg, { referenceId });
      }, 1500);
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
      {/* HERO SECTION - Matching Home Page Design */}
      <section className="hero-quote relative min-h-[50vh] bg-black overflow-hidden">
        {/* Background Image - YOUR LOCAL IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: 'url(/images/living-room/hero.jpeg)' }}
        />
        {/* Gradient overlay matching home page */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(0,102,204,0.08),transparent_50%)]" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center pt-28 pb-16 px-6">
          {/* Animated Badge - Using #30D158 like home page */}
          <div className="inline-flex items-center gap-2 bg-[#30D158]/10 border border-[#30D158]/30 rounded-full px-4 py-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
            </span>
            <span className="text-[#30D158] text-sm font-medium">End of Lease & Bond Cleaning Specialists</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight mb-4">
            Liverpool's #1 <span className="text-[#2997FF]">Bond Clean</span> Experts
          </h1>

          {/* SEO-rich subtitle - Using #86868B like home page */}
          <p className="text-lg md:text-xl text-white/60 mb-4 max-w-3xl mx-auto leading-relaxed">
            Liverpool's trusted bond cleaning experts. <strong className="text-white">100% bond back guarantee</strong> on every end of lease, vacate & deep cleaning service across Western Sydney.
          </p>

          {/* Service area keywords */}
          <p className="text-sm text-[#86868B] mb-8">
            Servicing Liverpool, Cabramatta, Casula, Moorebank, Prestons & Edmondson Park
          </p>

          {/* Stats Row - Matching home page design */}
          <div className="flex flex-wrap justify-center gap-12 pt-6 border-t border-white/10">
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
              <div className="text-sm text-[#86868B] uppercase tracking-wider mt-1">Google Rating</div>
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
              <label className="block text-sm font-medium text-white/80">Suburb</label>
              <input type="text" value={data.suburb} onChange={e => updateData({ suburb: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80">Property Type</label>
              <select value={data.propertyType} onChange={e => updateData({ propertyType: e.target.value as ResidentialQuoteData['propertyType'] })} className="select" required>
                <option value="" disabled>Select...</option>
                <option>Apartment</option>
                <option>Townhouse</option>
                <option>House</option>
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-white/80">Bedrooms</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" value={data.bedrooms || ''} onChange={e => updateData({ bedrooms: parseInt(e.target.value, 10) || 0 })} onBlur={() => { if (data.bedrooms < 1) { updateData({ bedrooms: 1 }) } }} className="input" required />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-white/80">Bathrooms</label>
                <input type="text" inputMode="numeric" pattern="[0-9]*" value={data.bathrooms || ''} onChange={e => updateData({ bathrooms: parseInt(e.target.value, 10) || 0 })} onBlur={() => { if (data.bathrooms < 1) { updateData({ bathrooms: 1 }) } }} className="input" required />
              </div>
            </div>
          </div>,

          // Step 2: Service Details
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Service Details</h3>
            <div>
              <label className="block text-sm font-medium text-white/80">Service Type</label>
              <select value={data.serviceType} onChange={e => updateData({ serviceType: e.target.value as ResidentialQuoteData['serviceType'] })} className="select" required>
                <option value="" disabled>Select...</option>
                <option>General</option>
                <option>Deep</option>
                <option>End-of-Lease</option>
                <option>Post-Construction</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80">Property Condition</label>
              <select value={data.condition} onChange={e => updateData({ condition: e.target.value as ResidentialQuoteData['condition'] })} className="select" required>
                <option value="Standard">Standard (Well-maintained)</option>
                <option value="Moderate">Moderate (Regular use, some buildup)</option>
                <option value="Heavy">Heavy (Neglected, significant buildup)</option>
                <option value="Extreme">Extreme (Hoarding, Biohazard)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80">Frequency</label>
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
              <label className="block text-sm font-medium text-white/80">Add-ons</label>
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
              <label className="block text-sm font-medium text-white/80">Preferred Time</label>
              <select value={data.preferredTime} onChange={e => updateData({ preferredTime: e.target.value as ResidentialQuoteData['preferredTime'] })} className="select" required>
                <option value="" disabled>Select...</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Flexible</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80">Notes for the cleaning team (optional)</label>
              <textarea value={data.notes} onChange={e => updateData({ notes: e.target.value })} rows={4} className="input"></textarea>
            </div>
          </div>,

          // Step 4: Contact & Confirm
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact & Confirmation</h3>
            <div>
              <label className="block text-sm font-medium text-white/80">Full Name</label>
              <input type="text" value={data.fullName} onChange={e => updateData({ fullName: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80">Email</label>
              <input type="email" value={data.email} onChange={e => updateData({ email: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80">Phone</label>
              <input type="tel" value={data.phone} onChange={e => updateData({ phone: formatPhoneNumber(e.target.value) })} className="input" required maxLength={12} placeholder="e.g. 0400-123-456" />
            </div>
            <LivePriceEstimate
              estimate={estimate?.price ?? null}
              isLoading={false}
              error={data.condition === 'Extreme' ? 'Custom quote required for extreme conditions' : null}
              confidence={estimate ? 'high' : 'medium'}
              frequency={data.frequency}
              showRange={false}
            />
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

      {/* Success confetti on form submission */}
      <SubmitConfetti active={showSuccess} />

      {/* Auto-save indicator toast */}
      <AutoSaveToast show={isSaved} />
    </>
  );
};

export default ResidentialQuoteView;
