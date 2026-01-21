import React, { useState, useEffect, useCallback } from 'react';
import {
  getAvailableSlots,
  decrementSlots,
  getUrgencyLevel,
  notifySlotChange
} from '../utils/slotsManager';

interface BookingData {
  name: string;
  suburb: string;
  service: string;
}

// 30 Real names and Western Sydney suburbs
const FIRST_NAMES = [
  'Sarah', 'James', 'Emma', 'Michael', 'Lisa', 'David', 'Jennifer', 'Chris',
  'Rachel', 'Mark', 'Amanda', 'Tony', 'Priya', 'Robert', 'Michelle', 'Alex',
  'Sophie', 'John', 'Fatima', 'Daniel', 'Lauren', 'Kevin', 'Aisha', 'Steve',
  'Nina', 'Hassan', 'Emily', 'Ryan', 'Mei', 'Josh'
];

const LAST_INITIALS = ['M', 'K', 'L', 'R', 'W', 'C', 'S', 'T', 'H', 'P', 'G', 'B', 'N', 'D', 'A', 'Y'];

const SUBURBS = [
  'Liverpool', 'Parramatta', 'Cabramatta', 'Fairfield', 'Bankstown',
  'Blacktown', 'Penrith', 'Auburn', 'Wetherill Park', 'Campbelltown',
  'Ingleburn', 'Harris Park', 'Glenfield', 'Merrylands', 'Greenacre',
  'Lakemba', 'Smithfield', 'Chester Hill', 'Granville', 'Yagoona',
  'Revesby', 'Prestons', 'Leppington', 'Gregory Hills', 'Edmondson Park',
  'Hoxton Park', 'Green Valley', 'Bonnyrigg', 'Bossley Park', 'Cecil Hills'
];

const SERVICES = [
  { name: 'end-of-lease clean', color: '#FF9500' },
  { name: 'deep clean', color: '#30D158' },
  { name: 'Airbnb turnover', color: '#BF5AF2' },
  { name: 'bond clean', color: '#FF375F' },
  { name: 'commercial clean', color: '#0A84FF' },
  { name: 'regular cleaning', color: '#2997FF' },
  { name: 'move-out clean', color: '#FFD60A' },
  { name: 'office cleaning', color: '#64D2FF' },
];

const TIME_AGO_OPTIONS = [
  'just now', '1 min ago', '2 min ago', '3 min ago', '5 min ago',
  '8 min ago', '10 min ago', '12 min ago', '15 min ago', '20 min ago'
];

// Storage key for visitor seed
const VISITOR_SEED_KEY = 'cleanupbros_visitor_seed';

// Generate a random booking
const generateRandomBooking = (seed: number): BookingData => {
  const nameIndex = (seed * 7 + 13) % FIRST_NAMES.length;
  const initialIndex = (seed * 11 + 5) % LAST_INITIALS.length;
  const suburbIndex = (seed * 13 + 7) % SUBURBS.length;
  const serviceIndex = (seed * 17 + 3) % SERVICES.length;

  return {
    name: `${FIRST_NAMES[nameIndex]} ${LAST_INITIALS[initialIndex]}.`,
    suburb: SUBURBS[suburbIndex],
    service: SERVICES[serviceIndex].name,
  };
};

// Get service color
const getServiceColor = (serviceName: string): string => {
  const service = SERVICES.find(s => s.name === serviceName);
  return service?.color || '#2997FF';
};

const getVisitorSeed = (): number => {
  try {
    let seed = localStorage.getItem(VISITOR_SEED_KEY);
    if (!seed) {
      seed = String(Math.floor(Math.random() * 10000));
      localStorage.setItem(VISITOR_SEED_KEY, seed);
    }
    return parseInt(seed, 10);
  } catch {
    return Math.floor(Math.random() * 10000);
  }
};

export const RecentBookingToast: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [bookingIndex, setBookingIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [slots, setSlots] = useState(10);
  const [currentBooking, setCurrentBooking] = useState<BookingData | null>(null);
  const [timeAgo, setTimeAgo] = useState('just now');
  const [visitorSeed, setVisitorSeed] = useState(0);

  // Initialize slots and visitor seed
  useEffect(() => {
    const seed = getVisitorSeed();
    setVisitorSeed(seed);

    // Get slots from shared manager
    const currentSlots = getAvailableSlots();
    setSlots(currentSlots);
  }, []);

  // Generate booking based on visitor seed and index
  const generateNewBooking = useCallback((index: number) => {
    const seed = visitorSeed + index * 31;
    const booking = generateRandomBooking(seed);
    const timeIndex = index % TIME_AGO_OPTIONS.length;
    setCurrentBooking(booking);
    setTimeAgo(TIME_AGO_OPTIONS[timeIndex]);
  }, [visitorSeed]);

  // Initial booking setup
  useEffect(() => {
    if (visitorSeed > 0) {
      generateNewBooking(bookingIndex);
    }
  }, [visitorSeed, bookingIndex, generateNewBooking]);

  // Show first toast after delay
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      setIsVisible(true);
    }, 8000); // 8 seconds after page load

    return () => clearTimeout(initialDelay);
  }, []);

  // Handle toast visibility cycle
  useEffect(() => {
    if (!isVisible) return;

    // Auto-hide after 6 seconds
    const hideTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
      }, 300);
    }, 6000);

    return () => clearTimeout(hideTimer);
  }, [isVisible]);

  // Show next booking periodically
  useEffect(() => {
    if (!visitorSeed) return;

    const interval = setInterval(() => {
      // Move to next booking
      setBookingIndex(prev => prev + 1);

      // Decrease slots occasionally (simulate real bookings)
      if (Math.random() < 0.3 && slots > 1) {
        const newSlots = decrementSlots();
        setSlots(newSlots);
        notifySlotChange(newSlots); // Notify other components
      }

      // Show toast
      setTimeout(() => {
        setIsVisible(true);
      }, 500);
    }, 45000); // Every 45 seconds

    return () => clearInterval(interval);
  }, [visitorSeed, slots]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
    }, 300);
  };

  if (!isVisible || !currentBooking) return null;

  const serviceColor = getServiceColor(currentBooking.service);
  const urgencyLevel = getUrgencyLevel(slots);

  return (
    <div
      className={`
        fixed bottom-24 md:bottom-6 left-4 z-30
        max-w-sm w-full
        transform transition-all duration-300 ease-out
        ${isExiting ? 'translate-x-[-120%] opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <div className="bg-[#1C1C1E]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Urgency Banner */}
        <div className={`px-4 py-2 text-xs font-bold text-center ${
          urgencyLevel === 'high'
            ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400'
            : urgencyLevel === 'medium'
            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400'
            : 'bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-400'
        }`}>
          {urgencyLevel === 'high' ? '🔥' : urgencyLevel === 'medium' ? '⚡' : '✨'} Only {slots} {slots === 1 ? 'slot' : 'slots'} left this week
        </div>

        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar with service color */}
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${serviceColor}, ${serviceColor}88)` }}
            >
              {currentBooking.name.charAt(0)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold leading-tight">
                {currentBooking.name}
                <span className="text-white/50 font-normal"> from </span>
                <span className="text-white/90">{currentBooking.suburb}</span>
              </p>
              <p className="text-white/60 text-xs mt-1">
                just booked a{' '}
                <span className="font-medium" style={{ color: serviceColor }}>
                  {currentBooking.service}
                </span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-white/40 text-[10px]">
                  {timeAgo}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[10px] text-white/40">
                  Verified booking
                </span>
              </div>
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0 -mt-1 -mr-1"
            >
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Live indicator + CTA */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
              </span>
              <span className="text-white/40 text-[10px] font-medium">
                Live activity
              </span>
            </div>
            <span className={`text-[10px] font-semibold ${
              urgencyLevel === 'high' ? 'text-red-400' : 'text-white/50'
            }`}>
              {urgencyLevel === 'high' ? 'Book now before slots fill up!' : 'Limited availability'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook to manage toast visibility and slot updates
export const useRecentBookingToast = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  const disableToasts = () => setIsEnabled(false);
  const enableToasts = () => setIsEnabled(true);

  // Decrease slots when a real booking happens
  const handleDecrementSlots = () => {
    const newSlots = decrementSlots();
    notifySlotChange(newSlots);
    return newSlots;
  };

  return { isEnabled, disableToasts, enableToasts, decrementSlots: handleDecrementSlots };
};

export default RecentBookingToast;
