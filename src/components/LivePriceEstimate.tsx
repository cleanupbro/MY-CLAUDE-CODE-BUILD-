/**
 * LivePriceEstimate.tsx - Enhanced price estimation display
 *
 * Features:
 * - Animated price counter
 * - Price range display (low-high)
 * - Mandatory disclaimer
 * - Confidence indicator
 * - Sparkle effect on price change
 */

import React, { useState, useEffect, useRef } from 'react';

interface PriceEstimateProps {
  lowEstimate?: number;
  highEstimate?: number;
  estimate: number | null;
  isLoading: boolean;
  error: string | null;
  confidence?: 'high' | 'medium' | 'low';
  frequency?: string;
  perUnit?: string;
  showRange?: boolean;
  onGetExactQuote?: () => void;
}

// Animated counter hook
const useAnimatedCounter = (targetValue: number, duration: number = 800) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValue = useRef(0);

  useEffect(() => {
    if (targetValue === previousValue.current) return;

    setIsAnimating(true);
    const startValue = previousValue.current;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (targetValue - startValue) * eased);

      setCurrentValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        previousValue.current = targetValue;
      }
    };

    requestAnimationFrame(animate);
  }, [targetValue, duration]);

  return { currentValue, isAnimating };
};

export const LivePriceEstimate: React.FC<PriceEstimateProps> = ({
  lowEstimate,
  highEstimate,
  estimate,
  isLoading,
  error,
  confidence = 'medium',
  frequency,
  perUnit = 'per clean',
  showRange = false,
  onGetExactQuote,
}) => {
  const [showSparkle, setShowSparkle] = useState(false);
  const previousEstimate = useRef<number | null>(null);

  // Use animated counter for the main estimate
  const { currentValue: animatedPrice, isAnimating } = useAnimatedCounter(
    estimate ?? 0,
    800
  );

  // Show sparkle when price changes
  useEffect(() => {
    if (estimate !== null && previousEstimate.current !== null && estimate !== previousEstimate.current) {
      setShowSparkle(true);
      const timer = setTimeout(() => setShowSparkle(false), 1000);
      return () => clearTimeout(timer);
    }
    previousEstimate.current = estimate;
  }, [estimate]);

  const getConfidenceColor = () => {
    switch (confidence) {
      case 'high':
        return 'bg-[#30D158]';
      case 'medium':
        return 'bg-[#FFD60A]';
      case 'low':
        return 'bg-[#FF9500]';
      default:
        return 'bg-[#FFD60A]';
    }
  };

  const getConfidenceText = () => {
    switch (confidence) {
      case 'high':
        return 'High confidence';
      case 'medium':
        return 'Medium confidence';
      case 'low':
        return 'Estimate only';
      default:
        return 'Estimate';
    }
  };

  const getFrequencyText = () => {
    if (!frequency || frequency === 'One-time') return perUnit;
    return `per ${frequency.replace('-weekly', ' week').replace('ly', '').toLowerCase()}`;
  };

  return (
    <div className="relative">
      <style>{`
        @keyframes sparkle-float {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-10px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0);
          }
        }
        @keyframes price-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>

      {/* Main Container */}
      <div className="p-6 bg-gradient-to-br from-[#0066CC]/15 to-[#0066CC]/5 border border-[#0066CC]/30 rounded-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <p className="text-sm font-semibold text-[#2997FF] uppercase tracking-wider">
              Instant Estimate
            </p>
          </div>
          {estimate !== null && !isLoading && (
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getConfidenceColor()}`} />
              <span className="text-xs text-white/50">{getConfidenceText()}</span>
            </div>
          )}
        </div>

        {/* Price Display */}
        <div className="text-center relative">
          {isLoading ? (
            <div className="flex justify-center items-center my-6">
              <div
                className="h-12 w-48 rounded-lg"
                style={{
                  background: 'linear-gradient(90deg, #1C1C1E 25%, #2C2C2E 50%, #1C1C1E 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            </div>
          ) : error ? (
            <div className="my-4 p-4 bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-xl">
              <p className="font-semibold text-sm text-[#FF453A]">Unable to Calculate</p>
              <p className="text-xs mt-1 text-white/60">{error}</p>
            </div>
          ) : estimate !== null ? (
            <div className="relative inline-block">
              {/* Sparkle effects */}
              {showSparkle && (
                <>
                  <span
                    className="absolute -top-2 -left-2 text-xl"
                    style={{ animation: 'sparkle-float 0.8s ease-out forwards' }}
                  >
                    ✨
                  </span>
                  <span
                    className="absolute -top-2 -right-2 text-xl"
                    style={{ animation: 'sparkle-float 0.8s ease-out 0.1s forwards' }}
                  >
                    ✨
                  </span>
                </>
              )}

              {/* Price */}
              <p
                className={`text-5xl font-bold text-white ${isAnimating ? 'text-[#30D158]' : ''} transition-colors duration-300`}
                style={{ animation: isAnimating ? 'price-pulse 0.4s ease-out' : 'none' }}
              >
                ${animatedPrice.toLocaleString()}
              </p>

              {/* Range display */}
              {showRange && lowEstimate !== undefined && highEstimate !== undefined && (
                <p className="text-sm text-white/50 mt-1">
                  Range: ${lowEstimate.toLocaleString()} - ${highEstimate.toLocaleString()}
                </p>
              )}

              {/* Per unit */}
              <p className="text-xl font-semibold text-[#2997FF] mt-2">
                {getFrequencyText()}
              </p>
            </div>
          ) : (
            <div className="my-6">
              <p className="text-white/50">Complete the form to see an estimate</p>
              <div className="flex justify-center gap-2 mt-2">
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>
          )}
        </div>

        {/* Get Exact Quote Button */}
        {estimate !== null && !isLoading && onGetExactQuote && (
          <button
            onClick={onGetExactQuote}
            className="w-full mt-4 py-3 bg-[#0066CC] text-white font-semibold rounded-xl hover:bg-[#0077ED] transition-all duration-200 hover:scale-[1.02]"
          >
            Get Exact Quote →
          </button>
        )}
      </div>

      {/* MANDATORY DISCLAIMER */}
      <div className="mt-3 p-3 bg-[#FF9500]/10 border border-[#FF9500]/30 rounded-xl">
        <div className="flex items-start gap-2">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="text-xs font-semibold text-[#FF9500] uppercase tracking-wide mb-1">
              Estimate Only
            </p>
            <p className="text-xs text-white/60 leading-relaxed">
              This price is an estimate based on the information provided.
              Final price will be confirmed after property inspection.
              Prices may vary based on property condition and access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact version for sidebar use
export const CompactPriceEstimate: React.FC<{
  estimate: number | null;
  isLoading: boolean;
  perUnit?: string;
}> = ({ estimate, isLoading, perUnit = 'per clean' }) => {
  const { currentValue } = useAnimatedCounter(estimate ?? 0, 600);

  return (
    <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/60">Estimate</span>
        {isLoading ? (
          <div className="w-16 h-6 bg-white/10 rounded animate-pulse" />
        ) : estimate !== null ? (
          <span className="text-xl font-bold text-white">
            ${currentValue.toLocaleString()}
          </span>
        ) : (
          <span className="text-white/30">---</span>
        )}
      </div>
      {estimate !== null && !isLoading && (
        <p className="text-xs text-[#2997FF] text-right mt-1">{perUnit}</p>
      )}
    </div>
  );
};

export default LivePriceEstimate;
