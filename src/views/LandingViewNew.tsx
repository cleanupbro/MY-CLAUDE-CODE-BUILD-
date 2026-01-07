import React, { useState, useEffect, useRef } from 'react';
import { ViewType, ServiceType } from '../types';

interface LandingViewProps {
  navigateTo: (view: ViewType) => void;
  setServiceType: (type: ServiceType) => void;
}

// Animated counter component
const Counter: React.FC<{ end: number; suffix?: string; duration?: number }> = ({
  end, suffix = '', duration = 2000
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export const LandingViewNew: React.FC<LandingViewProps> = ({ navigateTo, setServiceType }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleServiceClick = (type: ServiceType, view: ViewType) => {
    setServiceType(type);
    navigateTo(view);
  };

  const testimonials = [
    { name: 'Sarah M.', location: 'Liverpool', text: 'Got my entire bond back. These guys are absolute legends!', rating: 5 },
    { name: 'James K.', location: 'Parramatta', text: 'Our office has never looked this good. Staff love coming to work now.', rating: 5 },
    { name: 'Emma L.', location: 'Cabramatta', text: 'Same-day Airbnb turnover. 5-star reviews from guests ever since.', rating: 5 },
  ];

  const blogPosts = [
    {
      image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600',
      title: '5 Kitchen Cleaning Hacks Pros Use',
      excerpt: 'Professional tips to make your kitchen sparkle in half the time...',
      readTime: '3 min',
      category: 'Kitchen'
    },
    {
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600',
      title: 'Bond Back Guarantee: What You Need',
      excerpt: 'Everything landlords look for during end-of-lease inspections...',
      readTime: '5 min',
      category: 'End of Lease'
    },
    {
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600',
      title: 'Before vs After: Deep Clean Magic',
      excerpt: 'See the incredible transformations our team achieves...',
      readTime: '2 min',
      category: 'Deep Clean'
    },
    {
      image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600',
      title: 'Airbnb 5-Star Ready Checklist',
      excerpt: 'The exact checklist we use for Airbnb turnovers...',
      readTime: '4 min',
      category: 'Airbnb'
    }
  ];

  const services = [
    {
      title: 'HOME',
      subtitle: 'Residential Cleaning',
      type: ServiceType.Residential,
      view: 'ResidentialQuote' as ViewType,
      icon: '🏠',
      color: '#C8FF00'
    },
    {
      title: 'OFFICE',
      subtitle: 'Commercial Cleaning',
      type: ServiceType.Commercial,
      view: 'CommercialQuote' as ViewType,
      icon: '🏢',
      color: '#FF6B4A'
    },
    {
      title: 'AIRBNB',
      subtitle: 'Turnover Cleaning',
      type: ServiceType.Airbnb,
      view: 'AirbnbQuote' as ViewType,
      icon: '✈️',
      color: '#00D4FF'
    },
  ];

  const suburbs = [
    'Liverpool', 'Cabramatta', 'Casula', 'Moorebank', 'Prestons', 'Edmondson Park',
    'Ingleburn', 'Glenfield', 'Leppington', 'Carnes Hill', 'Hoxton Park', 'Green Valley',
    'Campbelltown', 'Parramatta', 'Bankstown', 'Fairfield', 'Blacktown', 'Penrith'
  ];

  return (
    <div className="landing-fresh">
      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=general-sans@400,500,600,700&display=swap');

        .landing-fresh {
          --lime: #C8FF00;
          --lime-dark: #9ACC00;
          --coral: #FF6B4A;
          --cyan: #00D4FF;
          --charcoal: #1A1A1A;
          --charcoal-light: #2D2D2D;
          --cream: #F8F6F0;
          --white: #FFFFFF;

          font-family: 'General Sans', 'DM Sans', sans-serif;
          background: var(--charcoal);
          color: var(--white);
          overflow-x: hidden;
          min-height: 100vh;
        }

        .landing-fresh * {
          box-sizing: border-box;
        }

        .font-clash {
          font-family: 'Clash Display', 'Space Grotesk', sans-serif;
        }

        /* Diagonal sweep pattern */
        .sweep-line {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--lime), transparent);
          transform: rotate(-15deg);
          opacity: 0.3;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 120px 5vw 80px;
          overflow: hidden;
        }

        .hero-bg-pattern {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 80%, rgba(200, 255, 0, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 107, 74, 0.06) 0%, transparent 50%),
            linear-gradient(180deg, var(--charcoal) 0%, #0D0D0D 100%);
          pointer-events: none;
        }

        /* Animated diagonal lines */
        .diagonal-lines {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .diagonal-lines::before,
        .diagonal-lines::after {
          content: '';
          position: absolute;
          width: 200%;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, var(--lime) 50%, transparent 100%);
          opacity: 0.15;
        }

        .diagonal-lines::before {
          top: 30%;
          left: -50%;
          transform: rotate(-12deg);
          animation: sweep 8s ease-in-out infinite;
        }

        .diagonal-lines::after {
          top: 70%;
          left: -50%;
          transform: rotate(-12deg);
          animation: sweep 8s ease-in-out infinite 4s;
        }

        @keyframes sweep {
          0%, 100% { transform: rotate(-12deg) translateX(-10%); opacity: 0.1; }
          50% { transform: rotate(-12deg) translateX(10%); opacity: 0.25; }
        }

        /* Hero Content */
        .hero-content {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(200, 255, 0, 0.1);
          border: 1px solid rgba(200, 255, 0, 0.3);
          border-radius: 100px;
          font-size: 13px;
          font-weight: 600;
          color: var(--lime);
          margin-bottom: 32px;
          animation: fadeInUp 0.8s ease-out;
        }

        .hero-badge::before {
          content: '';
          width: 8px;
          height: 8px;
          background: var(--lime);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .hero-title {
          font-size: clamp(3.5rem, 12vw, 9rem);
          font-weight: 700;
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
          animation: fadeInUp 0.8s ease-out 0.1s backwards;
        }

        .hero-title .line {
          display: block;
          overflow: hidden;
        }

        .hero-title .highlight {
          color: var(--lime);
          position: relative;
          display: inline-block;
        }

        .hero-title .highlight::after {
          content: '';
          position: absolute;
          bottom: 5%;
          left: 0;
          width: 100%;
          height: 8px;
          background: var(--lime);
          opacity: 0.3;
          transform: skewX(-12deg);
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2vw, 1.5rem);
          color: rgba(255, 255, 255, 0.7);
          max-width: 500px;
          line-height: 1.6;
          margin-bottom: 48px;
          animation: fadeInUp 0.8s ease-out 0.2s backwards;
        }

        .hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          animation: fadeInUp 0.8s ease-out 0.3s backwards;
        }

        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 36px;
          background: var(--lime);
          color: var(--charcoal);
          font-family: 'Clash Display', sans-serif;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          border-radius: 0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .cta-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }

        .cta-primary:hover {
          transform: translateY(-3px) skewX(-2deg);
          box-shadow: 8px 8px 0 rgba(200, 255, 0, 0.3);
        }

        .cta-primary:hover::before {
          left: 100%;
        }

        .cta-secondary {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 36px;
          background: transparent;
          color: var(--white);
          font-family: 'Clash Display', sans-serif;
          font-size: 16px;
          font-weight: 600;
          text-decoration: none;
          border: 2px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cta-secondary:hover {
          border-color: var(--lime);
          color: var(--lime);
          transform: translateY(-2px);
        }

        /* Stats Row */
        .stats-row {
          display: flex;
          gap: 48px;
          margin-top: 80px;
          padding-top: 40px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          animation: fadeInUp 0.8s ease-out 0.4s backwards;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-family: 'Clash Display', sans-serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          color: var(--lime);
          line-height: 1;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 8px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Services Section */
        .services-section {
          padding: 120px 5vw;
          background: var(--cream);
          color: var(--charcoal);
          position: relative;
          clip-path: polygon(0 0, 100% 5%, 100% 100%, 0 95%);
          margin-top: -5vh;
        }

        .section-header {
          max-width: 1400px;
          margin: 0 auto 80px;
        }

        .section-label {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--coral);
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Clash Display', sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .service-card {
          position: relative;
          padding: 48px 36px;
          background: var(--white);
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: var(--card-color);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .service-card:hover {
          transform: translateY(-8px);
          border-color: var(--charcoal);
          box-shadow: 12px 12px 0 var(--card-color);
        }

        .service-card:hover::before {
          transform: scaleX(1);
        }

        .service-icon {
          font-size: 48px;
          margin-bottom: 24px;
          display: block;
        }

        .service-title {
          font-family: 'Clash Display', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .service-subtitle {
          font-size: 15px;
          color: rgba(26, 26, 26, 0.6);
          margin-bottom: 24px;
        }

        .service-features {
          list-style: none;
          padding: 0;
          margin: 0 0 32px;
        }

        .service-features li {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          font-size: 14px;
          color: rgba(26, 26, 26, 0.8);
        }

        .service-features li::before {
          content: '→';
          color: var(--card-color);
          font-weight: bold;
        }

        .service-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: var(--charcoal);
          color: var(--white);
          font-weight: 600;
          font-size: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .service-cta:hover {
          background: var(--card-color);
          color: var(--charcoal);
        }

        /* Trust Section */
        .trust-section {
          padding: 120px 5vw;
          background: var(--charcoal);
          position: relative;
        }

        .trust-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          max-width: 1400px;
          margin: 0 auto;
          align-items: center;
        }

        @media (max-width: 900px) {
          .trust-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }

        .trust-content h2 {
          font-family: 'Clash Display', sans-serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 24px;
        }

        .trust-content p {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          margin-bottom: 32px;
        }

        .trust-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .trust-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 14px;
          font-weight: 500;
        }

        .trust-badge svg {
          width: 20px;
          height: 20px;
          color: var(--lime);
        }

        /* Testimonial Card */
        .testimonial-card {
          position: relative;
          padding: 48px;
          background: linear-gradient(135deg, var(--charcoal-light) 0%, var(--charcoal) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .testimonial-quote {
          font-size: 24px;
          font-weight: 500;
          line-height: 1.5;
          margin-bottom: 32px;
          position: relative;
        }

        .testimonial-quote::before {
          content: '"';
          font-family: 'Clash Display', sans-serif;
          font-size: 120px;
          position: absolute;
          top: -40px;
          left: -20px;
          color: var(--lime);
          opacity: 0.2;
          line-height: 1;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .testimonial-avatar {
          width: 56px;
          height: 56px;
          background: var(--lime);
          color: var(--charcoal);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Clash Display', sans-serif;
          font-size: 20px;
          font-weight: 700;
        }

        .testimonial-info h4 {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .testimonial-info span {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
        }

        .testimonial-stars {
          margin-left: auto;
          display: flex;
          gap: 4px;
        }

        .testimonial-stars svg {
          width: 20px;
          height: 20px;
          color: var(--lime);
          fill: var(--lime);
        }

        .testimonial-nav {
          display: flex;
          gap: 8px;
          margin-top: 24px;
        }

        .testimonial-dot {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .testimonial-dot.active {
          background: var(--lime);
          width: 32px;
        }

        /* Blog Section */
        .blog-section {
          padding: 120px 5vw;
          background: var(--cream);
          color: var(--charcoal);
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        @media (max-width: 1200px) {
          .blog-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .blog-grid {
            grid-template-columns: 1fr;
          }
        }

        .blog-card {
          background: var(--white);
          border: 2px solid transparent;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .blog-card:hover {
          transform: translateY(-8px);
          border-color: var(--charcoal);
          box-shadow: 8px 8px 0 var(--lime);
        }

        .blog-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .blog-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .blog-card:hover .blog-image {
          transform: scale(1.1);
        }

        .blog-category {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 6px 12px;
          background: var(--lime);
          color: var(--charcoal);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .blog-content {
          padding: 24px;
        }

        .blog-title {
          font-family: 'Clash Display', sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.3;
          margin-bottom: 12px;
          color: var(--charcoal);
        }

        .blog-excerpt {
          font-size: 14px;
          color: rgba(26, 26, 26, 0.7);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .blog-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(26, 26, 26, 0.5);
        }

        .blog-meta svg {
          width: 14px;
          height: 14px;
        }

        .blog-header {
          max-width: 1400px;
          margin: 0 auto 60px;
          text-align: center;
        }

        .blog-header .section-title {
          display: inline;
        }

        .blog-header .highlight {
          color: var(--charcoal);
          position: relative;
          display: inline;
        }

        .blog-header .highlight::after {
          content: '';
          position: absolute;
          bottom: 5%;
          left: 0;
          width: 100%;
          height: 8px;
          background: var(--lime);
          opacity: 0.5;
          transform: skewX(-12deg);
          z-index: -1;
        }

        /* Service Areas Section */
        .service-areas {
          padding: 120px 5vw;
          background: var(--charcoal);
        }

        .service-areas .suburb-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        @media (min-width: 768px) {
          .service-areas .suburb-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .service-areas .suburb-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }

        .service-areas .suburb-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .service-areas .suburb-item:hover {
          background: rgba(200, 255, 0, 0.1);
          border-color: rgba(200, 255, 0, 0.5);
          transform: translateY(-2px);
        }

        .service-areas .suburb-item span {
          color: var(--white);
          font-weight: 500;
          font-size: 14px;
        }

        .service-areas .seo-text {
          margin-top: 48px;
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.8;
        }

        /* CTA Section */
        .cta-section {
          padding: 160px 5vw;
          background: var(--lime);
          color: var(--charcoal);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: 'CLEAN';
          position: absolute;
          font-family: 'Clash Display', sans-serif;
          font-size: 25vw;
          font-weight: 700;
          color: rgba(0, 0, 0, 0.05);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          white-space: nowrap;
          pointer-events: none;
        }

        .cta-content {
          position: relative;
          z-index: 10;
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-section h2 {
          font-family: 'Clash Display', sans-serif;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }

        .cta-section p {
          font-size: 20px;
          margin-bottom: 48px;
          opacity: 0.8;
        }

        .cta-button-dark {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 24px 48px;
          background: var(--charcoal);
          color: var(--white);
          font-family: 'Clash Display', sans-serif;
          font-size: 18px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cta-button-dark:hover {
          transform: translateY(-4px) rotate(-1deg);
          box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.2);
        }

        /* Footer */
        .footer {
          padding: 80px 5vw 40px;
          background: var(--charcoal);
          color: var(--white);
        }

        .footer-content {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
        }

        @media (max-width: 900px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .footer-content {
            grid-template-columns: 1fr;
          }
        }

        .footer-brand h3 {
          font-family: 'Clash Display', sans-serif;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .footer-brand p {
          color: rgba(255, 255, 255, 0.6);
          font-size: 15px;
          line-height: 1.7;
          max-width: 300px;
        }

        .footer-column h4 {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 20px;
          color: var(--lime);
        }

        .footer-column ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-column li {
          margin-bottom: 12px;
        }

        .footer-column a,
        .footer-column button {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 15px;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .footer-column a:hover,
        .footer-column button:hover {
          color: var(--lime);
        }

        .footer-bottom {
          max-width: 1400px;
          margin: 60px auto 0;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .hero-section {
            padding: 100px 24px 60px;
          }

          .stats-row {
            flex-wrap: wrap;
            gap: 32px;
          }

          .services-section {
            clip-path: none;
            margin-top: 0;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .hero-cta-group {
            flex-direction: column;
          }

          .cta-primary,
          .cta-secondary {
            width: 100%;
            justify-content: center;
          }
        }

        /* Scroll animations */
        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-pattern" />
        <div className="diagonal-lines" />

        <div className="hero-content">
          <div className="hero-badge">
            <span>Liverpool's #1 Rated Cleaning Service</span>
          </div>

          <h1 className="hero-title font-clash">
            <span className="line">WE MAKE</span>
            <span className="line">SPACES <span className="highlight">SHINE</span></span>
          </h1>

          <p className="hero-subtitle">
            Premium cleaning for homes, offices, and Airbnbs across Western Sydney.
            Same-day quotes. Bond-back guarantee. No excuses.
          </p>

          <div className="hero-cta-group">
            <button
              className="cta-primary"
              onClick={() => handleServiceClick(ServiceType.Residential, 'ResidentialQuote')}
            >
              Get Instant Quote
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <a href="tel:+61406764585" className="cta-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
              Call Now
            </a>
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-number font-clash"><Counter end={500} suffix="+" /></span>
              <span className="stat-label">Happy Clients</span>
            </div>
            <div className="stat-item">
              <span className="stat-number font-clash"><Counter end={100} suffix="%" /></span>
              <span className="stat-label">Bond Back Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-number font-clash"><Counter end={4} />.9★</span>
              <span className="stat-label">Google Rating</span>
            </div>
            <div className="stat-item">
              <span className="stat-number font-clash"><Counter end={24} />h</span>
              <span className="stat-label">Response Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="section-header">
          <p className="section-label">Our Services</p>
          <h2 className="section-title font-clash">Pick Your Clean</h2>
        </div>

        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="service-card"
              style={{ '--card-color': service.color } as React.CSSProperties}
              onClick={() => handleServiceClick(service.type, service.view)}
            >
              <span className="service-icon">{service.icon}</span>
              <h3 className="service-title font-clash">{service.title}</h3>
              <p className="service-subtitle">{service.subtitle}</p>
              <ul className="service-features">
                {service.title === 'HOME' && (
                  <>
                    <li>Regular & Deep Cleans</li>
                    <li>End of Lease / Bond Back</li>
                    <li>Move-in Ready</li>
                  </>
                )}
                {service.title === 'OFFICE' && (
                  <>
                    <li>Daily / Weekly Contracts</li>
                    <li>Medical & Gym Specialists</li>
                    <li>After-Hours Service</li>
                  </>
                )}
                {service.title === 'AIRBNB' && (
                  <>
                    <li>Same-Day Turnovers</li>
                    <li>Linen & Restock Service</li>
                    <li>5-Star Guest Ready</li>
                  </>
                )}
              </ul>
              <button className="service-cta">
                Get Quote
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="trust-grid">
          <div className="trust-content">
            <p className="section-label" style={{ color: 'var(--lime)' }}>Why Choose Us</p>
            <h2 className="font-clash">We're Not Your Average Cleaners</h2>
            <p>
              Family-run, fully insured, and obsessed with detail. We don't just clean spaces—we transform them.
              Every team member is police-checked and trained to our exacting standards.
            </p>
            <div className="trust-badges">
              <div className="trust-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                Fully Insured
              </div>
              <div className="trust-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Police Checked
              </div>
              <div className="trust-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Same Day Service
              </div>
              <div className="trust-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
                Bond Back Guarantee
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p className="testimonial-quote">{testimonials[activeTestimonial].text}</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">
                {testimonials[activeTestimonial].name.charAt(0)}
              </div>
              <div className="testimonial-info">
                <h4>{testimonials[activeTestimonial].name}</h4>
                <span>{testimonials[activeTestimonial].location}</span>
              </div>
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
            </div>
            <div className="testimonial-nav">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`testimonial-dot ${index === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="blog-section">
        <div className="blog-header">
          <p className="section-label" style={{ color: 'var(--coral)' }}>Tips & Tricks</p>
          <h2 className="section-title font-clash">
            Cleaning Secrets From <span className="highlight">The Pros</span>
          </h2>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <article key={index} className="blog-card">
              <div className="blog-image-container">
                <img
                  src={post.image}
                  alt={post.title}
                  className="blog-image"
                  loading="lazy"
                />
                <span className="blog-category">{post.category}</span>
              </div>
              <div className="blog-content">
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="blog-meta">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <span>{post.readTime} read</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SERVICE AREAS - SEO Section */}
      <section className="service-areas">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#C8FF00] text-sm font-bold uppercase tracking-widest">Service Areas</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 font-clash">
              Cleaning Services Across <span className="text-[#C8FF00]">Liverpool & Western Sydney</span>
            </h2>
            <p className="text-white/60 text-lg mt-4 max-w-3xl mx-auto">
              Professional end of lease cleaning, bond cleaning, commercial cleaning and Airbnb turnover services across all Western Sydney suburbs.
            </p>
          </div>

          {/* Suburb Grid */}
          <div className="suburb-grid">
            {suburbs.map((suburb, i) => (
              <div key={i} className="suburb-item">
                <span>{suburb}</span>
              </div>
            ))}
          </div>

          {/* SEO Text */}
          <div className="seo-text">
            <p>
              Clean Up Bros provides professional cleaning services including end of lease cleaning, bond cleaning, vacate cleaning, commercial cleaning, office cleaning, and Airbnb turnover cleaning. We proudly serve Liverpool, Cabramatta, Casula, Moorebank, Prestons, Edmondson Park, Ingleburn, Glenfield, Leppington, Carnes Hill, Hoxton Park, Green Valley, Campbelltown, Parramatta, Bankstown, Fairfield, and all Western Sydney suburbs. 100% bond back guarantee on all end of lease cleans.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="font-clash">Ready for a Fresh Start?</h2>
          <p>Get your instant quote in 60 seconds. No obligations, no hidden fees.</p>
          <button
            className="cta-button-dark"
            onClick={() => handleServiceClick(ServiceType.Residential, 'ResidentialQuote')}
          >
            Get Your Free Quote
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingViewNew;
