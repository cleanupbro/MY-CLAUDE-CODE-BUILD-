import React, { useState, useEffect, useRef } from 'react';
import { StarRating } from '../components/StarRating';
import { NavigationProps, ClientFeedbackData, ServiceType } from '../types';
import { sendToWebhook } from '../services/webhookService';
import { saveSubmission } from '../services/submissionService';
import { saveFailedSubmission } from '../services/failedSubmissionsService';
import { WEBHOOK_URLS, SUCCESS_MESSAGES } from '../constants';

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

const INITIAL_DATA: ClientFeedbackData = {
  rating: 0,
  comments: '',
  fullName: '',
  email: '',
};

const ClientFeedbackView: React.FC<NavigationProps> = ({ navigateTo, onSubmissionFail }) => {
  const [data, setData] = useState(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [npsScore, setNpsScore] = useState<number | null>(null);

  const heroSection = useScrollReveal();
  const formSection = useScrollReveal();

  const updateData = (fields: Partial<ClientFeedbackData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Name Validation
    if (!data.name || data.name.trim().length < 2) {
      setSubmissionError("Please enter your name.");
      return;
    }

    // Email Validation (REQUIRED for feedback)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setSubmissionError("Please enter a valid email address.");
      return;
    }

    if (data.rating === 0) {
      setSubmissionError("Please select a star rating before submitting.");
      return;
    }
    setSubmissionError(null);
    setIsSubmitting(true);

    const referenceId = `CUB-FB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const successMsg = SUCCESS_MESSAGES[ServiceType.ClientFeedback];

    const submissionData = {
      ...data,
      npsScore,
      referenceId: referenceId,
      confirmationMessage: "Feedback Received",
      displayMessage: successMsg,
      submittedAt: new Date().toISOString()
    };

    const result = await sendToWebhook(WEBHOOK_URLS[ServiceType.ClientFeedback], submissionData);
    setIsSubmitting(false);

    if (result.success) {
      await saveSubmission({ type: ServiceType.ClientFeedback, data: submissionData });
      navigateTo('Success', successMsg, { referenceId });
    } else {
      saveFailedSubmission({ type: ServiceType.ClientFeedback, data: submissionData });
      onSubmissionFail?.();
      setSubmissionError(result.error || "An unexpected error occurred. Your feedback has been saved and can be retried later.");
    }
  };

  return (
    <div className="bg-black min-h-screen">
      {/* HERO SECTION */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-24">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />

        {/* Animated Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#0066CC]/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-[#2997FF]/15 blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Hero Content */}
        <div
          ref={heroSection.ref}
          className={`relative z-10 text-center px-6 py-16 max-w-4xl mx-auto transition-all duration-1000 ${
            heroSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Icon */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-[#0066CC]/20 border border-[#2997FF]/30 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-8 h-8 text-[#2997FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
            </span>
            <span className="text-[#2997FF] text-sm font-semibold uppercase tracking-wider">
              Your Voice Matters
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6">
            Share Your <span className="text-[#2997FF]">Feedback</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Help us improve by sharing your experience
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#2997FF]">4.9</div>
              <div className="text-white/40 text-sm">Avg Rating</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#2997FF]">500+</div>
              <div className="text-white/40 text-sm">Reviews</div>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#2997FF]">98%</div>
              <div className="text-white/40 text-sm">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="bg-[#0D0D0D] py-16">
        <div
          ref={formSection.ref}
          className={`max-w-xl mx-auto px-6 transition-all duration-1000 ${
            formSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Form Container */}
          <div className="bg-[#1C1C1E]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-white mb-2">How was your experience?</h2>
              <p className="text-white/60">Your feedback helps us serve you better</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div className="text-center">
                <label className="block text-white font-medium mb-4">Your Rating</label>
                <StarRating
                  rating={data.rating}
                  onRatingChange={(rating) => {
                    updateData({ rating });
                    if(submissionError) setSubmissionError(null);
                  }}
                />
              </div>

              {/* NPS Survey */}
              <div className="bg-[#2C2C2E] rounded-xl p-6 border border-white/10">
                <label className="block text-white font-medium text-center mb-4">
                  How likely are you to recommend us?
                </label>
                <div className="flex justify-between items-center gap-1 mb-3">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setNpsScore(score)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-semibold text-sm transition-all ${
                        npsScore === score
                          ? score <= 6
                            ? 'bg-[#FF453A] text-white'
                            : score <= 8
                            ? 'bg-[#FFD60A] text-black'
                            : 'bg-[#30D158] text-white'
                          : 'bg-[#1C1C1E] text-white/60 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>Not likely</span>
                  <span>Very likely</span>
                </div>
                {npsScore !== null && (
                  <div className="mt-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      npsScore <= 6
                        ? 'bg-[#FF453A]/20 text-[#FF453A]'
                        : npsScore <= 8
                        ? 'bg-[#FFD60A]/20 text-[#FFD60A]'
                        : 'bg-[#30D158]/20 text-[#30D158]'
                    }`}>
                      {npsScore <= 6 ? 'Detractor' : npsScore <= 8 ? 'Passive' : 'Promoter'}
                    </span>
                  </div>
                )}
              </div>

              {/* Comments */}
              <div>
                <label className="block text-white font-medium mb-2">Your Comments *</label>
                <textarea
                  value={data.comments}
                  onChange={e => updateData({ comments: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-[#2C2C2E] border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 outline-none resize-none"
                  placeholder="Tell us about your experience..."
                  required
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-white font-medium mb-2">Full Name (Optional)</label>
                <input
                  type="text"
                  value={data.fullName}
                  onChange={e => updateData({ fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#2C2C2E] border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 outline-none"
                  placeholder="John Smith"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-white font-medium mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={e => updateData({ email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#2C2C2E] border border-white/10 rounded-xl text-white placeholder-white/30 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF]/30 outline-none"
                  placeholder="john@example.com"
                />
              </div>

              {/* Error Message */}
              {submissionError && (
                <div className="p-4 bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-xl">
                  <p className="text-[#FF453A] font-medium text-sm">{submissionError}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || data.rating === 0}
                className="w-full px-8 py-4 bg-[#0066CC] text-white text-lg font-semibold rounded-xl hover:bg-[#0077ED] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(0,102,204,0.3)]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit Feedback'}
              </button>
            </form>
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
      <section className="bg-[#0066CC] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Need Another Cleaning?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Book your next service and enjoy the same spotless results.
          </p>
          <button
            onClick={() => navigateTo('Services')}
            className="px-8 py-4 bg-white text-[#0066CC] text-lg font-semibold rounded-full hover:bg-white/90 transition-all"
          >
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default ClientFeedbackView;
