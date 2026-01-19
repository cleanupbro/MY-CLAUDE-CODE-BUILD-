import React, { useEffect, useRef, useState, useMemo } from 'react';

interface Orb {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  blur: number;
}

// Luxury orb colors (Google Antigravity inspired + brand colors)
const orbColors = [
  '#3186FF', // Blue
  '#FBBC04', // Yellow/Gold
  '#FC413D', // Red
  '#00B95C', // Green
  '#2FA1D6', // Teal (brand)
  '#0066CC', // Luxury accent
];

export const AntigravityBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const orbsRef = useRef<Orb[]>([]);
  const animationRef = useRef<number>();

  // Initialize orbs
  const initialOrbs = useMemo(() => {
    const orbs: Orb[] = [];
    const orbCount = 6;

    for (let i = 0; i < orbCount; i++) {
      orbs.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        size: 250 + Math.random() * 200,
        color: orbColors[i % orbColors.length],
        blur: 80 + Math.random() * 40,
      });
    }
    return orbs;
  }, []);

  const [orbs, setOrbs] = useState<Orb[]>(initialOrbs);

  useEffect(() => {
    orbsRef.current = orbs;
  }, [orbs]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!containerRef.current || !e.touches[0]) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.touches[0].clientX - rect.left) / rect.width) * 100,
        y: ((e.touches[0].clientY - rect.top) / rect.height) * 100,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    let time = 0;
    const animate = () => {
      time += 0.005;

      setOrbs(prevOrbs => prevOrbs.map((orb, index) => {
        let newX = orb.x;
        let newY = orb.y;
        let newVx = orb.vx;
        let newVy = orb.vy;

        // Calculate distance from mouse
        const dx = newX - mouseRef.current.x;
        const dy = newY - mouseRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Repulsion from cursor (within 30% of screen)
        if (distance < 30 && distance > 0) {
          const force = (30 - distance) / 30;
          newVx += (dx / distance) * force * 0.15;
          newVy += (dy / distance) * force * 0.15;
        }

        // Organic floating motion using sine waves
        newVx += Math.sin(time + index * 1.5) * 0.008;
        newVy += Math.cos(time + index * 1.2) * 0.008;

        // Apply velocity
        newX += newVx;
        newY += newVy;

        // Friction
        newVx *= 0.98;
        newVy *= 0.98;

        // Soft boundary bounce (keep orbs mostly on screen)
        if (newX < -10) { newX = -10; newVx = Math.abs(newVx) * 0.5; }
        if (newX > 110) { newX = 110; newVx = -Math.abs(newVx) * 0.5; }
        if (newY < -10) { newY = -10; newVy = Math.abs(newVy) * 0.5; }
        if (newY > 110) { newY = 110; newVy = -Math.abs(newVy) * 0.5; }

        return {
          ...orb,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{ background: 'linear-gradient(180deg, #000000 0%, #0A0A0A 50%, #000000 100%)' }}
    >
      {/* Floating Orbs */}
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full transition-transform duration-75 ease-out"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle at 30% 30%, ${orb.color}40 0%, ${orb.color}20 40%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            willChange: 'transform, left, top',
          }}
        />
      ))}

      {/* Subtle gradient overlay for depth */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,102,204,0.15) 0%, transparent 50%)',
        }}
      />

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/3"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        }}
      />
    </div>
  );
};

// Interactive Card with 3D tilt effect
export const InteractiveCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}> = ({ children, className = '', glowColor = '#0066CC' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rotateX = (y - 0.5) * -10;
    const rotateY = (x - 0.5) * 10;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
    setGlowPosition({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)');
    setGlowPosition({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-300 ease-out ${className}`}
      style={{ transform, transformStyle: 'preserve-3d' }}
    >
      {/* Glow effect following cursor */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor}30 0%, transparent 50%)`,
        }}
      />
      {children}
    </div>
  );
};

// Premium Button with shimmer effect
export const PremiumButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'gold';
  loading?: boolean;
}> = ({ children, onClick, className = '', variant = 'primary', loading = false }) => {
  const baseStyles = 'relative overflow-hidden font-semibold px-6 py-3 rounded-xl transition-all duration-300';

  const variants = {
    primary: 'bg-[#0066CC] hover:bg-[#0077ED] text-white shadow-[0_0_20px_rgba(0,102,204,0.3)] hover:shadow-[0_0_30px_rgba(0,102,204,0.5)]',
    secondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30',
    gold: 'bg-[#F2B705] hover:bg-[#E5A600] text-black shadow-[0_0_20px_rgba(242,183,5,0.3)] hover:shadow-[0_0_30px_rgba(242,183,5,0.5)]',
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${baseStyles} ${variants[variant]} ${className} group`}
    >
      {/* Shimmer effect */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        <span className="relative z-10">{children}</span>
      )}
    </button>
  );
};

export default AntigravityBackground;
