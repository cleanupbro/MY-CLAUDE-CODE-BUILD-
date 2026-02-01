
import React, { useState, useEffect, useRef } from 'react';
import { MultiStepForm } from '../components/MultiStepForm';
import { JobApplicationData, NavigationProps, ServiceType, UploadedFile } from '../types';
import { sendToWebhook } from '../services/webhookService';
import { saveSubmission } from '../services/submissionService';
import { saveFailedSubmission } from '../services/failedSubmissionsService';
import { WEBHOOK_URLS, SUCCESS_MESSAGES } from '../constants';
import { Checkbox } from '../components/Checkbox';
import { FileUpload } from '../components/FileUpload';
import { DateInput } from '../components/DateInput';
import { useToast } from '../contexts/ToastContext';

// Scroll Reveal Hook
const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

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

const INITIAL_DATA: JobApplicationData = {
  fullName: '',
  email: '',
  phone: '',
  hasWorkRights: false,
  experience: '',
  hasOwnEquipment: false,
  availability: [],
  serviceSuburbs: '',
  preferredStartDate: '',
  referenceName: '',
  referenceContact: '',
  attachments: [],
  photos: [],
  agreedToChecks: false,
};

const JobApplicationView: React.FC<NavigationProps> = ({ navigateTo, onSubmissionFail }) => {
  const [data, setData] = useState(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const heroSection = useScrollReveal();
  const benefitsSection = useScrollReveal();
  const formSection = useScrollReveal();
  const ctaSection = useScrollReveal();

  const updateData = (fields: Partial<JobApplicationData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setData(prev => {
      const currentValues = prev.availability;
      if (checked) {
        return { ...prev, availability: [...currentValues, value] };
      } else {
        return { ...prev, availability: currentValues.filter(item => item !== value) };
      }
    });
  };

  const onSubmit = async () => {
    // Name Validation
    if (!data.fullName || data.fullName.trim().length < 2) {
      showToast("Please enter your full name.", "error");
      return;
    }

    // Phone Validation (REQUIRED)
    const phoneDigits = data.phone?.replace(/\D/g, '') || '';
    if (phoneDigits.length < 10) {
      showToast("Please enter a valid Australian phone number.", "error");
      return;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    setIsSubmitting(true);

    const referenceId = `CUB-JOB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const successMsg = SUCCESS_MESSAGES[ServiceType.Jobs];

    const submissionData = {
        ...data,
        referenceId: referenceId,
        confirmationMessage: "Application Received",
        displayMessage: successMsg,
        submittedAt: new Date().toISOString()
    };

    const result = await sendToWebhook(WEBHOOK_URLS[ServiceType.Jobs], submissionData);
    setIsSubmitting(false);

    if (result.success) {
      await saveSubmission({ type: ServiceType.Jobs, data: submissionData });
      navigateTo('Success', successMsg, { referenceId });
    } else {
      saveFailedSubmission({ type: ServiceType.Jobs, data: submissionData });
      onSubmissionFail?.();
      showToast(result.error || "An unexpected error occurred. Your application has been saved.", "error");
    }
  };

  // Dark input class for consistent styling
  const inputClass = "w-full px-4 py-3 bg-[#2C2C2E] border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 outline-none transition-all";
  const labelClass = "block text-white font-medium mb-2";

  return (
    <div className="bg-black min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />

        {/* Animated Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#0066CC]/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#30D158]/15 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Hero Content */}
        <div
          ref={heroSection.ref}
          className={`relative z-10 text-center px-6 py-16 max-w-4xl mx-auto transition-all duration-1000 ${
            heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Icon */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-[#30D158]/20 border border-[#30D158]/30 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-8 h-8 text-[#30D158]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
            </svg>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
            </span>
            <span className="text-[#30D158] text-sm font-semibold uppercase tracking-wider">
              We're Hiring!
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
            Join the <span className="text-[#2997FF]">Clean Up Bros</span> Family
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Flexible hours • Weekly pay • Training provided • Career growth
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#2997FF]">$25+</div>
              <div className="text-white/40 text-sm">Per Hour</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#30D158]">Flexible</div>
              <div className="text-white/40 text-sm">Schedule</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#FF9F0A]">Weekly</div>
              <div className="text-white/40 text-sm">Pay</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY JOIN US SECTION */}
      <section className="bg-[#0D0D0D] py-16">
        <div
          ref={benefitsSection.ref}
          className={`max-w-6xl mx-auto px-6 transition-all duration-1000 ${
            benefitsSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Why Join Us</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">Benefits of Working With Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Benefit 1 */}
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all">
              <div className="w-12 h-12 bg-[#0066CC]/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#2997FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Competitive Pay</h3>
              <p className="text-white/60 text-sm">Starting from $25/hour with opportunities for bonuses and raises</p>
            </div>

            {/* Benefit 2 */}
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all">
              <div className="w-12 h-12 bg-[#30D158]/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#30D158]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Flexible Hours</h3>
              <p className="text-white/60 text-sm">Choose your own schedule that works around your life</p>
            </div>

            {/* Benefit 3 */}
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all">
              <div className="w-12 h-12 bg-[#FF9F0A]/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#FF9F0A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Training Provided</h3>
              <p className="text-white/60 text-sm">Full training on our methods and professional cleaning techniques</p>
            </div>

            {/* Benefit 4 */}
            <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#2997FF]/30 transition-all">
              <div className="w-12 h-12 bg-[#BF5AF2]/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#BF5AF2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Career Growth</h3>
              <p className="text-white/60 text-sm">Opportunities to advance to team leader and management roles</p>
            </div>
          </div>
        </div>
      </section>

      {/* APPLICATION FORM SECTION */}
      <section className="bg-black py-16">
        <div
          ref={formSection.ref}
          className={`max-w-3xl mx-auto px-6 transition-all duration-1000 ${
            formSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-12">
            <p className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider mb-4">Apply Now</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">Join Our Team</h2>
            <p className="text-white/60">Fill out the application below and we'll get back to you within 48 hours</p>
          </div>

          {/* Dark Form Container */}
          <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <MultiStepForm
              title=""
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
              submitButtonText="Submit Application"
              submissionError={null}
              accentColor="#2997FF"
              steps={[
                // Step 1: Personal Details
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Personal Details</h3>
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      type="text"
                      value={data.fullName}
                      onChange={e => updateData({ fullName: e.target.value })}
                      className={inputClass}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={e => updateData({ email: e.target.value })}
                      className={inputClass}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input
                      type="tel"
                      value={data.phone}
                      onChange={e => updateData({ phone: formatPhoneNumber(e.target.value) })}
                      className={inputClass}
                      required
                      maxLength={12}
                      placeholder="0400-123-456"
                    />
                  </div>
                  <div className="bg-[#2C2C2E] rounded-xl p-4 border border-white/10">
                    <Checkbox
                      id="work-rights"
                      value="true"
                      checked={data.hasWorkRights}
                      onChange={e => updateData({ hasWorkRights: e.target.checked })}
                      label="I have valid working rights in Australia"
                    />
                  </div>
                </div>,

                // Step 2: Experience & Availability
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Experience & Availability</h3>
                  <div>
                    <label className={labelClass}>Cleaning Experience (Years/Details) *</label>
                    <textarea
                      value={data.experience}
                      onChange={e => updateData({ experience: e.target.value })}
                      rows={3}
                      className={inputClass + " resize-none"}
                      placeholder="Tell us about your cleaning experience..."
                      required
                    />
                  </div>
                  <div className="bg-[#2C2C2E] rounded-xl p-4 border border-white/10">
                    <Checkbox
                      id="own-equipment"
                      value="true"
                      checked={data.hasOwnEquipment}
                      onChange={e => updateData({ hasOwnEquipment: e.target.checked })}
                      label="I have my own car and cleaning equipment"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Availability *</label>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <div
                          key={day}
                          className={`rounded-xl p-3 border cursor-pointer transition-all ${
                            data.availability.includes(day)
                              ? 'bg-[#0066CC]/20 border-[#2997FF] text-[#2997FF]'
                              : 'bg-[#2C2C2E] border-white/10 text-white/60 hover:border-white/20'
                          }`}
                          onClick={() => {
                            const isSelected = data.availability.includes(day);
                            if (isSelected) {
                              setData(prev => ({ ...prev, availability: prev.availability.filter(d => d !== day) }));
                            } else {
                              setData(prev => ({ ...prev, availability: [...prev.availability, day] }));
                            }
                          }}
                        >
                          <div className="text-center text-sm font-medium">{day.slice(0, 3)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Preferred Suburbs / Areas *</label>
                    <input
                      type="text"
                      value={data.serviceSuburbs}
                      onChange={e => updateData({ serviceSuburbs: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. Liverpool, Campbelltown, Fairfield"
                      required
                    />
                  </div>
                </div>,

                // Step 3: References & Attachments
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white mb-6">References & Attachments</h3>
                  <DateInput
                    label="Available Start Date *"
                    value={data.preferredStartDate}
                    onChange={(val) => updateData({ preferredStartDate: val })}
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Reference Name *</label>
                      <input
                        type="text"
                        value={data.referenceName}
                        onChange={e => updateData({ referenceName: e.target.value })}
                        className={inputClass}
                        placeholder="Reference full name"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Reference Contact *</label>
                      <input
                        type="text"
                        value={data.referenceContact}
                        onChange={e => updateData({ referenceContact: e.target.value })}
                        className={inputClass}
                        placeholder="Phone or email"
                        required
                      />
                    </div>
                  </div>

                  <FileUpload
                    files={data.attachments}
                    onFilesChange={(files) => updateData({ attachments: files })}
                    label="Upload Resume / CV"
                    description="PDF, DOC, DOCX up to 5MB"
                  />

                  <FileUpload
                    files={data.photos || []}
                    onFilesChange={(files) => updateData({ photos: files })}
                    label="Upload Photos (Optional)"
                    description="Upload photos of your work, certifications, or ID. JPG, PNG up to 5MB each"
                    accept="image/*"
                    multiple={true}
                  />

                  <div className="pt-4 border-t border-white/10">
                    <div className="bg-[#2C2C2E] rounded-xl p-4 border border-white/10">
                      <Checkbox
                        id="police-check"
                        value="true"
                        checked={data.agreedToChecks}
                        onChange={e => updateData({ agreedToChecks: e.target.checked })}
                        label="I agree to undergo a Police Check if successful."
                      />
                    </div>
                  </div>
                </div>
              ]}
            />
          </div>

          {/* Back Link */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigateTo('Landing')}
              className="text-[#2997FF] hover:text-white font-medium transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        ref={ctaSection.ref}
        className={`bg-[#0066CC] py-16 transition-all duration-1000 ${
          ctaSection.isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Questions About Careers?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Contact us directly and we'll be happy to answer any questions about joining our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+61406764585"
              className="px-8 py-4 bg-white text-[#0066CC] text-lg font-semibold rounded-full hover:bg-white/90 transition-all"
            >
              Call Us: 0406 764 585
            </a>
            <button
              onClick={() => navigateTo('Contact')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-full hover:bg-white/10 transition-all"
            >
              Send Message
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobApplicationView;
