
import React, { useState } from 'react';
import { Card, SubmissionError } from '../components/Card';
import { StarRating } from '../components/StarRating';
import { NavigationProps, ClientFeedbackData, ServiceType } from '../types';
import { sendToWebhook } from '../services/webhookService';
import { saveSubmission } from '../services/submissionService';
import { saveFailedSubmission } from '../services/failedSubmissionsService';
import { WEBHOOK_URLS, SUCCESS_MESSAGES } from '../constants';

const INITIAL_DATA: ClientFeedbackData = {
  rating: 0,
  comments: '',
  fullName: '',
  email: '',
};

// NPS scores (0-10 scale)
const NPS_LABELS = [
  'Not at all likely',
  '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'Extremely likely'
];

const ClientFeedbackView: React.FC<NavigationProps> = ({ navigateTo, onSubmissionFail }) => {
  const [data, setData] = useState(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [npsScore, setNpsScore] = useState<number | null>(null);

  const updateData = (fields: Partial<ClientFeedbackData>) => {
    setData(prev => ({ ...prev, ...fields }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="w-full">
      {/* FEEDBACK Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-[#1A1A1A]">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920)',
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A]/90 via-[#1A1A1A]/80 to-[#00D4FF]/20" />

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#00D4FF]/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-20 w-48 h-48 rounded-full bg-[#00D4FF]/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 py-16">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D4FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00D4FF]"></span>
            </span>
            <span className="text-[#00D4FF] font-bold tracking-widest text-sm uppercase">
              Your Voice Matters
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Help Us Get Even <span className="text-[#00D4FF]">Better</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Your feedback helps us improve our service
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00D4FF]">4.9</div>
              <div className="text-white/60 text-sm">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00D4FF]">500+</div>
              <div className="text-white/60 text-sm">Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00D4FF]">98%</div>
              <div className="text-white/60 text-sm">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <div className="max-w-xl mx-auto px-4 py-12 -mt-8 relative z-20">
        <Card className="shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Share Your Feedback</h2>
            <p className="text-gray-500 mt-2">How was your recent cleaning service? Your feedback helps us improve.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-center mb-2">Your Rating</label>
              <StarRating rating={data.rating} onRatingChange={(rating) => {
                  updateData({ rating });
                  if(submissionError) setSubmissionError(null);
              }} />
            </div>
            {/* NPS Survey */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
              <label className="block text-sm font-semibold text-brand-navy text-center mb-4">
                How likely are you to recommend Clean Up Bros to a friend or colleague?
              </label>
              <div className="flex justify-between items-center gap-1 mb-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => setNpsScore(score)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all transform hover:scale-110 ${
                      npsScore === score
                        ? score <= 6
                          ? 'bg-red-500 text-white shadow-lg scale-110'
                          : score <= 8
                          ? 'bg-yellow-500 text-white shadow-lg scale-110'
                          : 'bg-green-500 text-white shadow-lg scale-110'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300'
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>Not likely</span>
                <span>Extremely likely</span>
              </div>
              {npsScore !== null && (
                <div className="mt-3 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    npsScore <= 6
                      ? 'bg-red-100 text-red-800'
                      : npsScore <= 8
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {npsScore <= 6 ? 'Detractor' : npsScore <= 8 ? 'Passive' : 'Promoter'}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Comments</label>
              <textarea
                value={data.comments}
                onChange={e => updateData({ comments: e.target.value })}
                rows={5}
                className="input"
                placeholder="Tell us about your experience..."
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name (Optional)</label>
              <input
                type="text"
                value={data.fullName}
                onChange={e => updateData({ fullName: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email (Optional)</label>
              <input
                type="email"
                value={data.email}
                onChange={e => updateData({ email: e.target.value })}
                className="input"
              />
            </div>

            <SubmissionError error={submissionError} />

            <div className="pt-2">
              <button type="submit" disabled={isSubmitting || data.rating === 0} className="w-full btn-primary">
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ClientFeedbackView;
