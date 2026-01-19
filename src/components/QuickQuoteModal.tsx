import React, { useState } from 'react';
import { ServiceType } from '../types';

interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: QuickQuoteData) => void;
  navigateTo: (view: string, message?: string, initialState?: any) => void;
}

interface QuickQuoteData {
  serviceType: ServiceType;
  bedrooms: string;
  phone: string;
}

export const QuickQuoteModal: React.FC<QuickQuoteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  navigateTo,
}) => {
  const [formData, setFormData] = useState<QuickQuoteData>({
    serviceType: ServiceType.Residential,
    bedrooms: '2',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof QuickQuoteData, string>>>({});

  if (!isOpen) return null;

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 9 && cleaned.length <= 12;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof QuickQuoteData, string>> = {};

    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Navigate to the appropriate quote form with pre-filled data
    const initialState = {
      bedrooms: formData.bedrooms,
      phone: formData.phone,
      fromQuickQuote: true,
    };

    // Map service type to view
    let targetView = ServiceType.Residential;
    if (formData.serviceType === ServiceType.Commercial) {
      targetView = ServiceType.Commercial;
    } else if (formData.serviceType === ServiceType.Airbnb) {
      targetView = ServiceType.Airbnb;
    }

    onSubmit(formData);
    navigateTo(targetView, undefined, initialState);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fadeIn" />

      {/* Modal */}
      <div className="relative bg-[#1C1C1E] border border-white/10 rounded-3xl p-6 md:p-8 w-full max-w-md animate-scaleIn shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#30D158]/10 border border-[#30D158]/30 rounded-full mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
            </span>
            <span className="text-[#30D158] text-xs font-medium">60-Second Quote</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Get My Free Quote
          </h2>
          <p className="text-white/60 text-sm">No credit card required</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Type */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              What do you need cleaned?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: ServiceType.Residential, label: 'Home', icon: '🏠' },
                { type: ServiceType.Commercial, label: 'Office', icon: '🏢' },
                { type: ServiceType.Airbnb, label: 'Airbnb', icon: '✈️' },
              ].map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => setFormData({ ...formData, serviceType: option.type })}
                  className={`
                    p-3 rounded-xl border text-center transition-all duration-200
                    ${formData.serviceType === option.type
                      ? 'bg-[#0066CC] border-[#0066CC] text-white'
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                    }
                  `}
                >
                  <span className="text-xl mb-1 block">{option.icon}</span>
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms (only for Residential/Airbnb) */}
          {formData.serviceType !== ServiceType.Commercial && (
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                How many bedrooms?
              </label>
              <select
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#2997FF] focus:outline-none focus:ring-2 focus:ring-[#2997FF]/20 transition-all"
              >
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>
          )}

          {/* Phone */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Your phone number
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                +61
              </span>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                placeholder="4XX XXX XXX"
                className={`
                  w-full bg-white/5 border rounded-xl pl-14 pr-4 py-3 text-white
                  placeholder:text-white/30 focus:outline-none focus:ring-2 transition-all
                  ${errors.phone
                    ? 'border-[#FF453A] focus:border-[#FF453A] focus:ring-[#FF453A]/20'
                    : 'border-white/10 focus:border-[#2997FF] focus:ring-[#2997FF]/20'
                  }
                `}
              />
              {errors.phone && (
                <p className="text-[#FF453A] text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300
              ${isSubmitting
                ? 'bg-[#0066CC]/50 text-white/50 cursor-not-allowed'
                : 'bg-[#0066CC] text-white hover:bg-[#0077ED] hover:shadow-[0_0_30px_rgba(0,102,204,0.5)] active:scale-[0.98]'
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              'Get My Free Quote Now →'
            )}
          </button>
        </form>

        {/* Trust indicators */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#30D158]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No spam
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#30D158]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% free
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-[#30D158]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Instant reply
            </span>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default QuickQuoteModal;
