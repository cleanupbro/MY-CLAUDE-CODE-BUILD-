
import React, { useState, useMemo, useEffect } from 'react';
import { MultiStepForm } from '../components/MultiStepForm';
import { CommercialQuoteData, NavigationProps, ServiceType } from '../types';
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

const INITIAL_DATA: CommercialQuoteData = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  facilityType: '',
  squareMeters: '',
  cleaningFrequency: '',
  complianceNeeds: [],
  painPoints: '',
  preferredStartDate: '',
  contractTerm: '',
};

const complianceOptions = [
    { value: 'WHS Certified', label: 'WHS Certified' },
    { value: 'Police Checks', label: 'Police Checks Required' },
    { value: 'Insured', label: 'Fully Insured' },
    { value: 'WWC Check', label: 'WWC Check Required' },
    { value: 'NDIS Screening', label: 'NDIS Worker Screening' },
];

const CommercialQuoteView: React.FC<NavigationProps> = ({ navigateTo, onSubmissionFail }) => {
  const [data, setData] = useState(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { showToast } = useToast();
  const priceCalculator = useMemo(() => new PricingCalculator(), []);

  // Auto-save functionality
  const { isSaved, loadSaved, clearSaved } = useAutoSave('commercial-quote', data, 2000);

  // Load saved data on mount
  useEffect(() => {
    const savedData = loadSaved();
    if (savedData) {
      setData(prev => ({ ...prev, ...savedData }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateData = (fields: Partial<CommercialQuoteData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const estimate = useMemo(() => {
    const canCalculate = data.facilityType && data.squareMeters && data.cleaningFrequency && data.contractTerm;
    if (!canCalculate) return null;

    const result = priceCalculator.calculateCommercial(data);
    if (result) {
      return { price: result.total, per: result.per };
    }
    return null;
  }, [data, priceCalculator]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setData(prev => {
      const currentValues = prev.complianceNeeds;
      if (checked) {
        return { ...prev, complianceNeeds: [...currentValues, value] };
      } else {
        return { ...prev, complianceNeeds: currentValues.filter(item => item !== value) };
      }
    });
  };

  const onSubmit = async () => {
    setSubmissionError(null);
    setIsSubmitting(true);
    
    const referenceId = `CUB-COM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const successMsg = SUCCESS_MESSAGES[ServiceType.Commercial];
    
    const submissionData = { 
        ...data, 
        priceEstimate: estimate?.price,
        referenceId: referenceId,
        confirmationMessage: "Commercial Quote Request Received",
        displayMessage: successMsg,
        submittedAt: new Date().toISOString()
    };

    const result = await sendToWebhook(WEBHOOK_URLS[ServiceType.Commercial], submissionData);
    setIsSubmitting(false);
    if(result.success) {
      await saveSubmission({ type: ServiceType.Commercial, data: submissionData });
      clearSaved(); // Clear auto-saved data on success
      setShowSuccess(true);
      // Brief delay to show confetti, then navigate
      setTimeout(() => {
        navigateTo('Success', successMsg, { referenceId });
      }, 1500);
    } else {
      saveFailedSubmission({ type: ServiceType.Commercial, data: submissionData });
      onSubmissionFail?.();
      const errorMsg = result.error || "An unexpected error occurred. Please contact us directly.";
      setSubmissionError(errorMsg);
      showToast(errorMsg, "error");
    }
  };

  return (
    <>
      {/* COMMERCIAL HERO SECTION - Matching Home Page Design */}
      <section className="hero-quote relative min-h-[40vh] bg-black overflow-hidden" aria-label="Commercial cleaning services Liverpool NSW">
        {/* Background Image - YOUR LOCAL OFFICE IMAGE */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: 'url(/images/offices/hero.jpg)' }}
          role="img"
          aria-label="Professional office cleaning Liverpool"
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
            <span className="text-[#30D158] text-sm font-medium">Commercial & Office Cleaning Experts</span>
          </div>

          {/* H1 with primary SEO keyword */}
          <h1 className="text-4xl md:text-6xl font-semibold text-white tracking-tight mb-4">
            Professional <span className="text-[#2997FF]">Office Cleaning</span> Liverpool NSW
          </h1>

          {/* Subtitle with secondary SEO keywords */}
          <p className="text-lg md:text-xl text-white/60 mb-4 max-w-2xl mx-auto leading-relaxed">
            Western Sydney's trusted commercial cleaners. Offices, medical centres, gyms & warehouses. After-hours service available.
          </p>

          {/* Hidden SEO text for crawlers */}
          <p className="sr-only">
            Commercial cleaning Liverpool NSW. Office cleaners Western Sydney. Janitorial services Liverpool.
            Business cleaning Liverpool. Medical centre cleaning, gym cleaning, warehouse cleaning, retail cleaning.
            Professional office cleaning services in Liverpool and Western Sydney.
          </p>

          {/* Service keywords as visible badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="text-xs bg-white/10 text-[#86868B] px-3 py-1 rounded-full">Office Cleaning</span>
            <span className="text-xs bg-white/10 text-[#86868B] px-3 py-1 rounded-full">Medical Centres</span>
            <span className="text-xs bg-white/10 text-[#86868B] px-3 py-1 rounded-full">Gyms & Fitness</span>
            <span className="text-xs bg-white/10 text-[#86868B] px-3 py-1 rounded-full">Warehouses</span>
            <span className="text-xs bg-white/10 text-[#86868B] px-3 py-1 rounded-full">Retail Spaces</span>
          </div>

          {/* Stats Row - Matching home page design */}
          <div className="flex flex-wrap justify-center gap-12 pt-6 border-t border-white/10">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-white">200+</div>
              <div className="text-sm text-[#86868B] uppercase tracking-wider mt-1">Businesses Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-white">24/7</div>
              <div className="text-sm text-[#86868B] uppercase tracking-wider mt-1">After Hours</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-semibold text-white">100%</div>
              <div className="text-sm text-[#86868B] uppercase tracking-wider mt-1">Fully Insured</div>
            </div>
          </div>
        </div>
      </section>

      <MultiStepForm
        title="Commercial Quote"
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        submitButtonText="Submit Request"
        submissionError={submissionError}
        steps={[
          // Step 1: Company Details
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Details</h3>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Company Name</label>
              <input type="text" value={data.companyName} onChange={e => updateData({ companyName: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Contact Person</label>
              <input type="text" value={data.contactPerson} onChange={e => updateData({ contactPerson: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Email</label>
              <input type="email" value={data.email} onChange={e => updateData({ email: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Phone</label>
              <input type="tel" value={data.phone} onChange={e => updateData({ phone: formatPhoneNumber(e.target.value) })} className="input" required maxLength={12} placeholder="e.g. 0400-123-456" />
            </div>
          </div>,
          // Step 2: Facility Details
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Facility Details</h3>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Facility Type (e.g., Office, Gym, Medical)</label>
              <input type="text" value={data.facilityType} onChange={e => updateData({ facilityType: e.target.value })} className="input" required placeholder="e.g. Medical Centre, Office" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Approx. Square Meters</label>
              <input type="number" value={data.squareMeters} onChange={e => updateData({ squareMeters: e.target.value })} className="input" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Desired Cleaning Frequency</label>
              <select value={data.cleaningFrequency} onChange={e => updateData({ cleaningFrequency: e.target.value })} className="select" required>
                <option value="" disabled>Select...</option>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Fortnightly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Preferred Contract Term</label>
              <select value={data.contractTerm} onChange={e => updateData({ contractTerm: e.target.value as CommercialQuoteData['contractTerm'] })} className="select" required>
                <option value="" disabled>Select...</option>
                <option>Month-to-Month</option>
                <option>6 Months</option>
                <option>1 Year</option>
              </select>
            </div>
          </div>,
          // Step 3: Scope & Compliance
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Scope & Compliance</h3>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Compliance Needs</label>
              <p className="text-xs text-gray-500 -mt-1 mb-2">This information helps us assign the right team.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {complianceOptions.map(item => (
                      <Checkbox 
                          key={item.value}
                          id={`compliance-${item.value}`}
                          value={item.value}
                          checked={data.complianceNeeds.includes(item.value)}
                          onChange={handleCheckboxChange}
                          label={item.label}
                      />
                  ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F]">Specific Needs / Pain Points</label>
              <textarea value={data.painPoints} onChange={e => updateData({ painPoints: e.target.value })} rows={4} className="input"></textarea>
            </div>
            <DateInput
                label="Preferred Start Date"
                value={data.preferredStartDate}
                onChange={(val) => updateData({ preferredStartDate: val })}
                required
            />
            <LivePriceEstimate
              estimate={estimate?.price ?? null}
              isLoading={false}
              error={null}
              confidence={estimate ? 'high' : 'medium'}
              frequency={data.cleaningFrequency}
              perUnit={estimate?.per ? `per ${estimate.per}` : 'per clean'}
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

export default CommercialQuoteView;
