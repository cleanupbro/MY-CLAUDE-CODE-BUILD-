
import React, { useState } from 'react';
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

  return (
    <>
      {/* CAREERS HERO SECTION */}
      <section className="hero-quote relative min-h-[40vh] bg-[#1A1A1A] overflow-hidden">
        {/* Background Image - Team */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#1A1A1A]" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center py-16 px-6">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 bg-[#C8FF00]/20 border border-[#C8FF00]/50 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-[#C8FF00] rounded-full animate-ping" />
            <span className="text-[#C8FF00] text-sm font-semibold uppercase tracking-wider">WE'RE HIRING!</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Join the Clean Up <span className="text-[#C8FF00]">Bros</span> Family
          </h1>

          <p className="text-xl text-white/70 mb-8">
            Flexible hours • Weekly pay • Training provided • Career growth
          </p>

          {/* Benefits */}
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C8FF00]">$25+</div>
              <div className="text-sm text-white/60">Per Hour</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#FF6B4A]">Flexible</div>
              <div className="text-sm text-white/60">Schedule</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00D4FF]">Weekly</div>
              <div className="text-sm text-white/60">Pay</div>
            </div>
          </div>
        </div>
      </section>

      <MultiStepForm
        title="Join the Team"
        isSubmitting={isSubmitting}
        onSubmit={onSubmit}
        submitButtonText="Submit Application"
        submissionError={null}
        steps={[
        // Step 1: Personal Details
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personal Details</h3>
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
          <div>
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
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Experience & Availability</h3>
          <div>
            <label className="block text-sm font-medium text-[#1D1D1F]">Cleaning Experience (Years/Details)</label>
            <textarea value={data.experience} onChange={e => updateData({ experience: e.target.value })} rows={3} className="input" required></textarea>
          </div>
           <div>
            <Checkbox 
                id="own-equipment" 
                value="true" 
                checked={data.hasOwnEquipment} 
                onChange={e => updateData({ hasOwnEquipment: e.target.checked })} 
                label="I have my own car and cleaning equipment" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1D1D1F]">Availability</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <Checkbox key={day} id={`day-${day}`} value={day} checked={data.availability.includes(day)} onChange={handleCheckboxChange} label={day} />
                ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1D1D1F]">Preferred Suburbs / Areas</label>
            <input type="text" value={data.serviceSuburbs} onChange={e => updateData({ serviceSuburbs: e.target.value })} className="input" placeholder="e.g. Liverpool, Campbelltown" required />
          </div>
        </div>,

        // Step 3: References & Attachments
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">References & Attachments</h3>
          <DateInput 
             label="Available Start Date" 
             value={data.preferredStartDate} 
             onChange={(val) => updateData({ preferredStartDate: val })} 
             required 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-[#1D1D1F]">Reference Name</label>
                <input type="text" value={data.referenceName} onChange={e => updateData({ referenceName: e.target.value })} className="input" required />
             </div>
             <div>
                <label className="block text-sm font-medium text-[#1D1D1F]">Reference Contact</label>
                <input type="text" value={data.referenceContact} onChange={e => updateData({ referenceContact: e.target.value })} className="input" required />
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

          <div className="pt-4 border-t mt-4">
             <Checkbox 
                id="police-check" 
                value="true" 
                checked={data.agreedToChecks} 
                onChange={e => updateData({ agreedToChecks: e.target.checked })} 
                label="I agree to undergo a Police Check if successful." 
            />
          </div>
        </div>
      ]}
      />
    </>
  );
};

export default JobApplicationView;
