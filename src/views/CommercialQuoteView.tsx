
import React, { useState, useMemo } from 'react';
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

const PriceEstimateDisplay: React.FC<{ estimate: { price: number; per: string } | null, isLoading: boolean, error: string | null }> = ({ estimate, isLoading, error }) => {
    return (
        <div className="p-5 bg-[#0066CC]/10 border border-[#0066CC]/30 rounded-2xl text-center mt-6">
            <div className="flex items-center justify-center gap-2 mb-3">
                <p className="text-sm font-semibold text-[#2997FF] uppercase tracking-wider">Instant Estimate</p>
                <div className="relative group inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/40 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#1C1C1E] text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-opacity w-56 pointer-events-none z-10 shadow-xl border border-white/10">
                        This estimate is AI-generated based on typical commercial rates. A final quote will be provided after consultation.
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#1C1C1E]"></div>
                    </div>
                </div>
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center my-4">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#2997FF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-white/60">Calculating...</p>
                </div>
            ) : error ? (
                 <div className="my-2 p-3 bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-xl">
                    <p className="font-semibold text-sm text-[#FF453A]">Estimation Failed</p>
                    <p className="text-xs mt-1 text-white/60">{error}</p>
                </div>
            ) : estimate ? (
                <p className="text-4xl font-bold text-white my-2">${estimate.price.toLocaleString()} <span className="text-xl font-semibold text-[#2997FF]">/{estimate.per}</span></p>
            ) : (
                 <p className="text-white/50 my-4">Complete the form to see an estimate.</p>
            )}
             <p className="text-xs text-white/40 mt-2">A final quote will be provided after a consultation. This is an AI-generated estimate.</p>
        </div>
    );
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
  const { showToast } = useToast();
  const priceCalculator = useMemo(() => new PricingCalculator(), []);

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
      navigateTo('Success', successMsg, { referenceId });
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
      {/* COMMERCIAL HERO SECTION - SEO Optimized for Liverpool NSW */}
      <section className="hero-quote relative min-h-[40vh] bg-[#1A1A1A] overflow-hidden" aria-label="Commercial cleaning services Liverpool NSW">
        {/* Background Image - Modern Office */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920)' }}
          role="img"
          aria-label="Professional office cleaning Liverpool"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#1A1A1A]" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center py-16 px-6">
          {/* Animated Badge - SEO keyword */}
          <div className="inline-flex items-center gap-2 bg-[#00D4FF]/20 border border-[#00D4FF]/50 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-[#00D4FF] rounded-full animate-ping" />
            <span className="text-[#00D4FF] text-sm font-semibold uppercase tracking-wider">COMMERCIAL & OFFICE CLEANING EXPERTS</span>
          </div>

          {/* H1 with primary SEO keyword */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Professional <span className="text-[#00D4FF]">Office Cleaning</span> Liverpool NSW
          </h1>

          {/* Subtitle with secondary SEO keywords */}
          <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto">
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
            <span className="text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full">Office Cleaning</span>
            <span className="text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full">Medical Centres</span>
            <span className="text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full">Gyms & Fitness</span>
            <span className="text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full">Warehouses</span>
            <span className="text-xs bg-white/10 text-white/70 px-3 py-1 rounded-full">Retail Spaces</span>
          </div>

          {/* Stats - Updated with SEO-friendly descriptions */}
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C8FF00]">200+</div>
              <div className="text-sm text-white/60">Businesses Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FF6B4A]">24/7</div>
              <div className="text-sm text-white/60">After Hours Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00D4FF]">100%</div>
              <div className="text-sm text-white/60">Fully Insured Team</div>
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
            <PriceEstimateDisplay estimate={estimate} isLoading={false} error={null} />
          </div>
        ]}
      />
    </>
  );
};

export default CommercialQuoteView;
