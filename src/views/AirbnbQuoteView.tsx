
import React, { useState, useMemo, useEffect } from 'react';
import { MultiStepForm } from '../components/MultiStepForm';
import { AirbnbQuoteData, NavigationProps, ServiceType } from '../types';
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

const INITIAL_DATA: AirbnbQuoteData = {
  listingUrl: '',
  propertyType: '',
  bedrooms: '1',
  bathrooms: '1',
  turnoverRequirements: [],
  accessMethod: '',
  preferredTurnoverTime: '',
  preferredStartDate: '',
  cleaningFrequency: '',
  contactName: '',
  email: '',
  phone: '',
};

const AirbnbQuoteView: React.FC<NavigationProps> = ({ navigateTo, onSubmissionFail }) => {
  const [data, setData] = useState(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { showToast } = useToast();
  const priceCalculator = useMemo(() => new PricingCalculator(), []);

  // Auto-save functionality
  const { isSaved, loadSaved, clearSaved } = useAutoSave('airbnb-quote', data, 2000);

  // Load saved data on mount
  useEffect(() => {
    const savedData = loadSaved();
    if (savedData) {
      setData(prev => ({ ...prev, ...savedData }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateData = (fields: Partial<AirbnbQuoteData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const estimate = useMemo(() => {
      const canCalculate = data.propertyType && data.bedrooms && data.bathrooms;
      if (!canCalculate) return null;

      const result = priceCalculator.calculateAirbnb(data);
      if (result) {
          return { price: result.total };
      }
      return null;
  }, [data, priceCalculator]);
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setData(prev => {
      const currentValues = prev.turnoverRequirements;
      if (checked) {
        return { ...prev, turnoverRequirements: [...currentValues, value] };
      } else {
        return { ...prev, turnoverRequirements: currentValues.filter(item => item !== value) };
      }
    });
  };

  const onSubmit = async () => {
    setSubmissionError(null);
    setIsSubmitting(true);
    
    const referenceId = `CUB-AIR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const successMsg = SUCCESS_MESSAGES[ServiceType.Airbnb];

    const submissionData = { 
        ...data, 
        priceEstimate: estimate?.price,
        referenceId: referenceId,
        confirmationMessage: "Airbnb Turnover Quote Received",
        displayMessage: successMsg,
        submittedAt: new Date().toISOString()
    };

    const result = await sendToWebhook(WEBHOOK_URLS[ServiceType.Airbnb], submissionData);
    setIsSubmitting(false);
    if(result.success) {
      await saveSubmission({ type: ServiceType.Airbnb, data: submissionData });
      clearSaved(); // Clear auto-saved data on success
      setShowSuccess(true);
      // Brief delay to show confetti, then navigate
      setTimeout(() => {
        navigateTo('Success', successMsg, { referenceId });
      }, 1500);
    } else {
      saveFailedSubmission({ type: ServiceType.Airbnb, data: submissionData });
      onSubmissionFail?.();
      const errorMsg = result.error || "An unexpected error occurred. Please contact us directly.";
      setSubmissionError(errorMsg);
      showToast(errorMsg, "error");
    }
  };

  return (
    <>
      {/* AIRBNB HERO SECTION - Matching Home Page Design */}
      <section className="hero-quote relative min-h-[40vh] bg-black overflow-hidden">
        {/* Background Image - YOUR LOCAL AIRBNB IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: 'url(/images/airbnb/hero.jpeg)' }}
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
            <span className="text-[#30D158] text-sm font-medium">Airbnb & Short-Term Rental Specialists</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight mb-4">
            <span className="text-[#2997FF]">Airbnb Turnover</span> Cleaning
          </h1>

          <p className="text-lg md:text-xl text-white/60 mb-8 max-w-3xl mx-auto leading-relaxed">
            Keep your property 5-star guest ready. Same-day turnovers, linen service & quality inspections. Trusted by Airbnb hosts across Western Sydney.
          </p>

          {/* Stats Row - Matching home page design */}
          <div className="flex flex-wrap justify-center gap-12 pt-6 border-t border-white/10">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-white">2hr</div>
              <div className="text-sm text-[#86868B] uppercase tracking-wider mt-1">Turnaround</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-white">Linen</div>
              <div className="text-sm text-[#86868B] uppercase tracking-wider mt-1">Service</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-white">100%</div>
              <div className="text-sm text-[#86868B] uppercase tracking-wider mt-1">5-Star Ready</div>
            </div>
          </div>

          {/* SEO Keywords - Hidden but crawlable */}
          <p className="sr-only">
            Professional Airbnb cleaning Liverpool, vacation rental cleaning Western Sydney,
            short term rental cleaning services, Airbnb cleaners near me,
            same-day turnover cleaning Sydney, guest-ready property cleaning
          </p>
        </div>
      </section>

      <MultiStepForm
        title="Airbnb Turnover Quote"
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        submitButtonText="Submit Request"
        submissionError={submissionError}
        steps={[
          // Step 1: Listing Details
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Listing Details</h3>
            <div>
              <label className="block text-sm font-medium text-white/80">Airbnb Listing URL</label>
              <input type="text" placeholder="e.g., https://airbnb.com/h/your-listing" value={data.listingUrl} onChange={e => updateData({ listingUrl: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80">Property Type</label>
              <input type="text" value={data.propertyType} onChange={e => updateData({ propertyType: e.target.value })} placeholder="e.g., 2-Bed Apartment" className="input" required />
            </div>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-white/80">Bedrooms</label>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" value={data.bedrooms} onChange={e => updateData({ bedrooms: e.target.value.replace(/\D/g, '') })} onBlur={() => { if (!data.bedrooms || parseInt(data.bedrooms, 10) < 1) { updateData({ bedrooms: '1' }) } }} className="input" required />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-white/80">Bathrooms</label>
                    <input type="text" inputMode="numeric" pattern="[0-9]*" value={data.bathrooms} onChange={e => updateData({ bathrooms: e.target.value.replace(/\D/g, '') })} onBlur={() => { if (!data.bathrooms || parseInt(data.bathrooms, 10) < 1) { updateData({ bathrooms: '1' }) } }} className="input" required />
                </div>
            </div>
          </div>,
          // Step 2: Turnover Requirements
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Turnover Requirements</h3>
            <div>
                <label className="block text-sm font-medium text-white/80">Services Needed</label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {['Linen Change', 'Restock Amenities', 'Guest Communication', 'Damage Report'].map(item => (
                      <Checkbox
                          key={item}
                          id={`service-${item}`}
                          value={item}
                          checked={data.turnoverRequirements.includes(item)}
                          onChange={handleCheckboxChange}
                          label={item}
                      />
                    ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80">Property Access Method</label>
                <input type="text" value={data.accessMethod} onChange={e => updateData({ accessMethod: e.target.value })} placeholder="e.g., Lockbox code, Key handover" className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80">Preferred Turnover Window (e.g., 11am - 3pm)</label>
                <input type="text" value={data.preferredTurnoverTime} onChange={e => updateData({ preferredTurnoverTime: e.target.value })} className="input" required />
              </div>
              <DateInput
                  label="Preferred First Service Date"
                  value={data.preferredStartDate}
                  onChange={(val) => updateData({ preferredStartDate: val })}
                  required
              />
          </div>,
          // Step 3: Contact Info
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Your Information</h3>
            <div>
              <label className="block text-sm font-medium text-white/80">Cleaning Frequency</label>
              <select value={data.cleaningFrequency} onChange={e => updateData({ cleaningFrequency: e.target.value as AirbnbQuoteData['cleaningFrequency'] })} className="select" required>
                  <option value="" disabled>Select...</option>
                  <option value="On Checkout">On Checkout (Standard)</option>
                  <option value="Weekly">Weekly Service</option>
                  <option value="Bi-weekly">Bi-weekly Service</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80">Contact Name</label>
              <input type="text" value={data.contactName} onChange={e => updateData({ contactName: e.target.value })} className="input" required />
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
              error={null}
              confidence={estimate ? 'high' : 'medium'}
              frequency={data.cleaningFrequency}
              perUnit="per turnover"
              showRange={false}
            />
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

export default AirbnbQuoteView;
