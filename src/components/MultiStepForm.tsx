import React from 'react';
import { useMultiStepForm } from '../hooks/useMultiStepForm';

interface MultiStepFormProps {
  title: string;
  steps: React.ReactElement[];
  isSubmitting: boolean;
  onSubmit: () => void;
  submitButtonText?: string;
  submissionError: string | null;
  accentColor?: string;
}

export const MultiStepForm: React.FC<MultiStepFormProps> = ({
  title,
  steps,
  isSubmitting,
  onSubmit,
  submitButtonText = 'Submit Quote',
  submissionError,
  accentColor = '#C8FF00'
}) => {
  const { currentStepIndex, step, isFirstStep, isLastStep, back, next, steps: allSteps } = useMultiStepForm(steps);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLastStep) {
      return next();
    }
    onSubmit();
  };

  const progressPercentage = ((currentStepIndex + 1) / allSteps.length) * 100;

  return (
    <div className="form-bold-wrapper">
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=general-sans@400,500,600,700&display=swap');

        .form-bold-wrapper {
          --lime: ${accentColor};
          --coral: #FF6B4A;
          --cyan: #00D4FF;
          --charcoal: #1A1A1A;
          --charcoal-light: #2D2D2D;
          --cream: #F8F6F0;
          --white: #FFFFFF;

          font-family: 'General Sans', sans-serif;
          min-height: 100vh;
          background: var(--charcoal);
          padding: 48px 24px 80px;
        }

        .form-bold-wrapper * {
          box-sizing: border-box;
        }

        .font-clash {
          font-family: 'Clash Display', sans-serif;
        }

        .form-container {
          max-width: 680px;
          margin: 0 auto;
        }

        .form-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .form-title {
          font-family: 'Clash Display', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 700;
          color: var(--white);
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 16px;
        }

        .form-step-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(200, 255, 0, 0.1);
          border: 1px solid rgba(200, 255, 0, 0.3);
          font-size: 13px;
          font-weight: 600;
          color: var(--lime);
        }

        .form-step-indicator::before {
          content: '';
          width: 8px;
          height: 8px;
          background: var(--lime);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        /* Progress Bar */
        .progress-container {
          margin-bottom: 40px;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          margin-bottom: 24px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--lime);
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .step-dots {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .step-dot {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step-dot-circle {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Clash Display', sans-serif;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .step-dot-circle.completed {
          background: var(--lime);
          color: var(--charcoal);
        }

        .step-dot-circle.current {
          background: transparent;
          border: 2px solid var(--lime);
          color: var(--lime);
        }

        .step-dot-circle.upcoming {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.4);
        }

        .step-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.4);
        }

        .step-label.active {
          color: var(--lime);
        }

        /* Form Card */
        .form-card {
          background: var(--charcoal-light);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 48px;
        }

        @media (max-width: 640px) {
          .form-card {
            padding: 32px 24px;
          }
        }

        .form-content {
          min-height: 320px;
        }

        /* Form Elements - Bold Style */
        .form-bold-wrapper h3 {
          font-family: 'Clash Display', sans-serif;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--white);
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }

        .form-bold-wrapper label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 8px;
        }

        .form-bold-wrapper input[type="text"],
        .form-bold-wrapper input[type="email"],
        .form-bold-wrapper input[type="tel"],
        .form-bold-wrapper input[type="date"],
        .form-bold-wrapper input[type="number"],
        .form-bold-wrapper select,
        .form-bold-wrapper textarea {
          width: 100%;
          padding: 16px 20px;
          background: var(--charcoal);
          border: 2px solid rgba(255, 255, 255, 0.1);
          color: var(--white);
          font-family: 'General Sans', sans-serif;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .form-bold-wrapper input:focus,
        .form-bold-wrapper select:focus,
        .form-bold-wrapper textarea:focus {
          outline: none;
          border-color: var(--lime);
          box-shadow: 0 0 0 4px rgba(200, 255, 0, 0.1);
        }

        .form-bold-wrapper input::placeholder,
        .form-bold-wrapper textarea::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }

        .form-bold-wrapper select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 48px;
        }

        .form-bold-wrapper select option {
          background: var(--charcoal);
          color: var(--white);
        }

        .form-bold-wrapper textarea {
          resize: vertical;
          min-height: 120px;
        }

        /* Actions */
        .form-actions {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .btn-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 16px 24px;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'Clash Display', sans-serif;
          font-size: 15px;
          font-weight: 600;
          border: 2px solid rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-back:hover {
          border-color: var(--lime);
          color: var(--lime);
        }

        .btn-next {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 32px;
          background: var(--lime);
          color: var(--charcoal);
          font-family: 'Clash Display', sans-serif;
          font-size: 16px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-next:hover {
          transform: translateY(-3px) skewX(-2deg);
          box-shadow: 8px 8px 0 rgba(200, 255, 0, 0.3);
        }

        .btn-next:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Error Display */
        .form-error {
          margin-top: 24px;
          padding: 16px 20px;
          background: rgba(255, 107, 74, 0.1);
          border: 2px solid var(--coral);
        }

        .form-error-title {
          font-family: 'Clash Display', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: var(--coral);
          margin-bottom: 4px;
        }

        .form-error-message {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        /* Spinner */
        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: fadeInUp 0.5s ease-out;
        }
      `}</style>

      <div className="form-container">
        {/* Header */}
        <div className="form-header">
          <h2 className="form-title">{title}</h2>
          <div className="form-step-indicator">
            Step {currentStepIndex + 1} of {allSteps.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
          <div className="step-dots">
            {allSteps.map((_, index) => (
              <div key={index} className="step-dot">
                <div className={`step-dot-circle ${
                  index < currentStepIndex ? 'completed' :
                  index === currentStepIndex ? 'current' : 'upcoming'
                }`}>
                  {index < currentStepIndex ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`step-label ${index === currentStepIndex ? 'active' : ''}`}>
                  {index === 0 ? 'Property' :
                   index === 1 ? 'Service' :
                   index === 2 ? 'Schedule' : 'Confirm'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="form-card">
          <form onSubmit={handleFormSubmit}>
            <div className="form-content animate-in" key={currentStepIndex}>
              {step}
            </div>

            {isLastStep && submissionError && (
              <div className="form-error">
                <p className="form-error-title">Submission Error</p>
                <p className="form-error-message">{submissionError}</p>
              </div>
            )}

            <div className="form-actions">
              {!isFirstStep ? (
                <button type="button" onClick={back} className="btn-back">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              ) : (
                <div />
              )}

              <button type="submit" disabled={isSubmitting} className="btn-next">
                {isSubmitting ? (
                  <>
                    <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                    Processing...
                  </>
                ) : isLastStep ? (
                  <>
                    {submitButtonText}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Continue
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
