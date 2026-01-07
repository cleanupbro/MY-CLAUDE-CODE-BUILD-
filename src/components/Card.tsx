import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`apple-card p-8 ${className}`}>
      {children}
    </div>
  );
};

interface SubmissionErrorProps {
  error: string | null;
  className?: string;
}

export const SubmissionError: React.FC<SubmissionErrorProps> = ({ error, className = 'mt-6' }) => {
  if (!error) return null;

  return (
    <div className={`${className} p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center animate-fade-in-up`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <p className="font-medium text-sm">{error}</p>
      </div>
    </div>
  );
};