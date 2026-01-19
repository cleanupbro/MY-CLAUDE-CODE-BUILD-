/**
 * FormEffects.tsx - Shared form animations and micro-interactions
 *
 * This file contains reusable animation components for forms:
 * - SubmitConfetti: Confetti explosion on successful form submission
 * - FieldCheckmark: Animated checkmark when field is valid
 * - PriceCounter: Animated number counter for price display
 * - FocusGlow: Input focus effect wrapper
 * - LoadingButton: Button with loading spinner state
 * - ProgressBar: Animated step progress indicator
 * - AutoSaveToast: Toast notification for auto-save
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';

// ==================== HOOKS ====================

/**
 * Hook for counting animation
 */
export const useCountAnimation = (
  targetValue: number,
  duration: number = 1000,
  startOnMount: boolean = true
) => {
  const [currentValue, setCurrentValue] = useState(startOnMount ? 0 : targetValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }

    const elapsed = performance.now() - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out cubic)
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * targetValue);

    setCurrentValue(current);

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setIsAnimating(false);
      setCurrentValue(targetValue);
    }
  }, [targetValue, duration]);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    startTimeRef.current = null;
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [animate]);

  useEffect(() => {
    if (startOnMount) {
      startAnimation();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startOnMount, startAnimation]);

  // Re-animate when target changes
  useEffect(() => {
    if (!startOnMount) {
      startAnimation();
    }
  }, [targetValue, startOnMount, startAnimation]);

  return { currentValue, isAnimating, startAnimation };
};

/**
 * Hook for localStorage auto-save
 */
export const useAutoSave = <T extends object>(
  key: string,
  data: T,
  delay: number = 1000
) => {
  const [isSaved, setIsSaved] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        setIsSaved(true);
        // Reset saved status after 2 seconds
        setTimeout(() => setIsSaved(false), 2000);
      } catch (e) {
        console.error('Auto-save failed:', e);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [key, data, delay]);

  const loadSaved = useCallback((): T | null => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, [key]);

  const clearSaved = useCallback(() => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Clear saved failed:', e);
    }
  }, [key]);

  return { isSaved, loadSaved, clearSaved };
};

// ==================== COMPONENTS ====================

/**
 * Confetti particles for successful submission
 */
export const SubmitConfetti: React.FC<{ active: boolean }> = ({ active }) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    delay: number;
  }>>([]);

  useEffect(() => {
    if (active) {
      const colors = ['#0066CC', '#30D158', '#FFD60A', '#FF6B4A', '#2997FF'];
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.3,
      }));
      setParticles(newParticles);

      // Clean up after animation
      const timer = setTimeout(() => setParticles([]), 2000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg) scale(0);
            opacity: 0;
          }
        }
      `}</style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            animation: `confetti-fall 2s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Animated checkmark for field validation
 */
export const FieldCheckmark: React.FC<{ show: boolean; className?: string }> = ({
  show,
  className = ''
}) => {
  if (!show) return null;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <style>{`
        @keyframes checkmark-draw {
          0% {
            stroke-dashoffset: 24;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes checkmark-scale {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
      <div
        className="w-5 h-5 bg-[#30D158] rounded-full flex items-center justify-center"
        style={{ animation: 'checkmark-scale 0.3s ease-out forwards' }}
      >
        <svg
          className="w-3 h-3 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
            style={{
              strokeDasharray: 24,
              animation: 'checkmark-draw 0.3s ease-out 0.1s forwards',
              strokeDashoffset: 24,
            }}
          />
        </svg>
      </div>
    </div>
  );
};

/**
 * Animated price counter display
 */
export const PriceCounter: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}> = ({ value, prefix = '$', suffix = '', duration = 1000, className = '' }) => {
  const { currentValue, isAnimating } = useCountAnimation(value, duration, false);

  return (
    <span className={`inline-flex items-center ${className}`}>
      <style>{`
        @keyframes price-sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      {prefix}
      <span className={`tabular-nums ${isAnimating ? 'text-[#30D158]' : ''} transition-colors duration-300`}>
        {currentValue.toLocaleString()}
      </span>
      {suffix}
      {isAnimating && (
        <span
          className="ml-1 text-[#FFD60A]"
          style={{ animation: 'price-sparkle 0.5s ease-out forwards' }}
        >
          ✨
        </span>
      )}
    </span>
  );
};

/**
 * Loading button with spinner
 */
export const LoadingButton: React.FC<{
  loading: boolean;
  loadingText?: string;
  successText?: string;
  showSuccess?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}> = ({
  loading,
  loadingText = 'Submitting...',
  successText = 'Success!',
  showSuccess = false,
  children,
  onClick,
  disabled,
  className = '',
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center gap-2
        transition-all duration-300
        ${loading ? 'cursor-wait' : ''}
        ${showSuccess ? 'bg-[#30D158] !border-[#30D158]' : ''}
        ${className}
      `}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {showSuccess && (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      <span>{loading ? loadingText : showSuccess ? successText : children}</span>
    </button>
  );
};

/**
 * Animated progress bar for multi-step forms
 */
export const ProgressBar: React.FC<{
  currentStep: number;
  totalSteps: number;
  estimatedTime?: string;
  className?: string;
}> = ({ currentStep, totalSteps, estimatedTime, className = '' }) => {
  const progress = ((currentStep) / totalSteps) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white/80">
          Step {currentStep} of {totalSteps}
        </span>
        {estimatedTime && (
          <span className="text-xs text-white/50">
            {estimatedTime}
          </span>
        )}
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#0066CC] to-[#2997FF] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/* Step indicators */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`
              w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
              transition-all duration-300
              ${i + 1 <= currentStep
                ? 'bg-[#0066CC] text-white'
                : 'bg-white/10 text-white/40'
              }
              ${i + 1 === currentStep ? 'ring-2 ring-[#2997FF] ring-offset-2 ring-offset-[#1C1C1E]' : ''}
            `}
          >
            {i + 1 < currentStep ? (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Auto-save toast notification
 */
export const AutoSaveToast: React.FC<{ show: boolean }> = ({ show }) => {
  if (!show) return null;

  return (
    <div
      className="fixed bottom-20 left-4 z-50 flex items-center gap-2 px-3 py-2 bg-[#1C1C1E] border border-white/10 rounded-lg shadow-lg"
      style={{ animation: 'fadeInUp 0.3s ease-out' }}
    >
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <svg className="w-4 h-4 text-[#30D158]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-sm text-white/70">Progress saved</span>
    </div>
  );
};

/**
 * Input wrapper with focus glow effect
 */
export const FocusGlowInput: React.FC<{
  children: React.ReactNode;
  isFocused: boolean;
  isValid?: boolean;
}> = ({ children, isFocused, isValid }) => {
  return (
    <div className="relative">
      {children}
      {isFocused && (
        <div
          className={`
            absolute inset-0 rounded-xl pointer-events-none
            ${isValid ? 'ring-2 ring-[#30D158]/30' : 'ring-2 ring-[#2997FF]/30'}
          `}
          style={{ animation: 'pulse-glow 1s ease-in-out infinite' }}
        />
      )}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

/**
 * Selection card with bounce animation
 */
export const SelectionCard: React.FC<{
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({ selected, onClick, children, className = '' }) => {
  const [justSelected, setJustSelected] = useState(false);

  const handleClick = () => {
    onClick();
    setJustSelected(true);
    setTimeout(() => setJustSelected(false), 300);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        relative p-4 rounded-xl border transition-all duration-200
        ${selected
          ? 'border-[#0066CC] bg-[#0066CC]/10'
          : 'border-white/10 bg-[#1C1C1E]/80 hover:border-white/20'
        }
        ${justSelected ? 'scale-95' : 'scale-100'}
        ${className}
      `}
      style={{
        transform: justSelected ? 'scale(0.95)' : 'scale(1)',
        transition: 'transform 0.15s ease-out, border-color 0.2s, background-color 0.2s',
      }}
    >
      {children}
      {selected && (
        <div className="absolute top-2 right-2">
          <FieldCheckmark show={true} />
        </div>
      )}
    </button>
  );
};

/**
 * Number stepper with animation
 */
export const NumberStepper: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
}> = ({ value, onChange, min = 1, max = 10, label }) => {
  const [animate, setAnimate] = useState<'up' | 'down' | null>(null);

  const handleChange = (newValue: number, direction: 'up' | 'down') => {
    if (newValue >= min && newValue <= max) {
      setAnimate(direction);
      onChange(newValue);
      setTimeout(() => setAnimate(null), 200);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm text-white/60">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleChange(value - 1, 'down')}
          disabled={value <= min}
          className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
          </svg>
        </button>
        <span
          className={`
            text-3xl font-bold text-white tabular-nums w-12 text-center
            transition-transform duration-200
            ${animate === 'up' ? '-translate-y-1' : ''}
            ${animate === 'down' ? 'translate-y-1' : ''}
          `}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => handleChange(value + 1, 'up')}
          disabled={value >= max}
          className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default {
  SubmitConfetti,
  FieldCheckmark,
  PriceCounter,
  LoadingButton,
  ProgressBar,
  AutoSaveToast,
  FocusGlowInput,
  SelectionCard,
  NumberStepper,
  useCountAnimation,
  useAutoSave,
};
