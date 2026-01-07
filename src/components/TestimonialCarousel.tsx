import React, { useState, useEffect, useCallback } from 'react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  date: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah M.",
    location: "Liverpool, NSW",
    rating: 5,
    text: "Absolutely amazing service! They did our end of lease clean and we got our full bond back. The team was professional, punctual, and incredibly thorough. Highly recommend!",
    service: "End of Lease",
    date: "December 2025"
  },
  {
    id: 2,
    name: "David L.",
    location: "Cabramatta, NSW",
    rating: 5,
    text: "Best commercial cleaners in Western Sydney. Our office has never looked better. They handle our weekly cleaning and always go above and beyond. Professional and reliable.",
    service: "Commercial",
    date: "November 2025"
  },
  {
    id: 3,
    name: "Emily R.",
    location: "Edmondson Park, NSW",
    rating: 5,
    text: "I use Clean Up Bros for my Airbnb turnovers. They're fast, reliable, and my guests always comment on how clean the place is. 5-star reviews every time!",
    service: "Airbnb",
    date: "December 2025"
  },
  {
    id: 4,
    name: "Michael T.",
    location: "Moorebank, NSW",
    rating: 5,
    text: "Had a deep clean done before Christmas and the house looks brand new. The attention to detail was incredible. Will definitely be booking regular cleans!",
    service: "Deep Clean",
    date: "December 2025"
  },
  {
    id: 5,
    name: "Jessica H.",
    location: "Prestons, NSW",
    rating: 5,
    text: "The team was so friendly and did an amazing job with our post-construction clean. They handled all the dust and debris perfectly. Our new home sparkled!",
    service: "Post-Construction",
    date: "November 2025"
  }
];

export const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const nextSlide = useCallback(() => {
    setDirection('right');
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection('left');
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <span className="flex h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
          150+ 5-Star Reviews
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1D1D1F] mb-2">
          What Our Clients Say
        </h2>
        <p className="text-[#86868b]">Real reviews from real customers in Western Sydney</p>
      </div>

      {/* Main Carousel Container */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110"
          aria-label="Previous testimonial"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-110"
          aria-label="Next testimonial"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Testimonial Card */}
        <div className="overflow-hidden">
          <div
            className={`bg-white rounded-3xl shadow-xl p-8 md:p-12 transition-all duration-500 transform ${
              direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
            }`}
            key={currentTestimonial.id}
          >
            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-6 h-6 ${i < currentTestimonial.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
              "{currentTestimonial.text}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0071e3] to-[#00c7be] rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {currentTestimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-[#1D1D1F] text-lg">{currentTestimonial.name}</div>
                  <div className="text-[#86868b] text-sm">{currentTestimonial.location}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-block bg-[#F5F5F7] px-4 py-2 rounded-full text-sm font-medium text-[#1D1D1F]">
                  {currentTestimonial.service}
                </div>
                <div className="text-xs text-[#86868b] mt-1">{currentTestimonial.date}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-[#0071e3] w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Google Reviews Badge */}
      <div className="text-center mt-8">
        <a
          href="https://g.page/cleanupbros/review"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#86868b] hover:text-[#0071e3] transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          View all reviews on Google
        </a>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TestimonialCarousel;
