import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface InteractiveFAQProps {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
}

export const InteractiveFAQ: React.FC<InteractiveFAQProps> = ({ 
  faqs, 
  title = "Got Questions?",
  subtitle
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {title && (
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-white/60">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${openIndex === index ? 'open' : ''}`}
          >
            <button
              className="faq-question w-full text-left"
              onClick={() => toggle(index)}
              aria-expanded={openIndex === index}
            >
              <span className="text-white font-medium pr-4">{faq.question}</span>
              <span className="faq-icon text-[#2997FF] text-2xl font-light flex-shrink-0">
                +
              </span>
            </button>
            <div className="faq-answer">
              <p className="text-white/70 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
