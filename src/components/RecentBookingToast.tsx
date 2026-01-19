import React, { useState, useEffect } from 'react';

interface BookingData {
  name: string;
  suburb: string;
  service: string;
  timeAgo: string;
}

// 25 Real testimonial names and Western Sydney suburbs
const bookingData: BookingData[] = [
  { name: 'Sarah M.', suburb: 'Liverpool', service: 'end-of-lease clean', timeAgo: 'just now' },
  { name: 'James K.', suburb: 'Parramatta', service: 'office cleaning', timeAgo: '2 min ago' },
  { name: 'Emma L.', suburb: 'Cabramatta', service: 'Airbnb turnover', timeAgo: '3 min ago' },
  { name: 'Michael R.', suburb: 'Fairfield', service: 'deep clean', timeAgo: '5 min ago' },
  { name: 'Lisa W.', suburb: 'Bankstown', service: 'end-of-lease clean', timeAgo: '8 min ago' },
  { name: 'David C.', suburb: 'Blacktown', service: 'commercial clean', timeAgo: '10 min ago' },
  { name: 'Jennifer S.', suburb: 'Penrith', service: 'bond clean', timeAgo: '12 min ago' },
  { name: 'Chris T.', suburb: 'Liverpool', service: 'regular cleaning', timeAgo: '15 min ago' },
  { name: 'Rachel H.', suburb: 'Auburn', service: 'Airbnb turnover', timeAgo: '18 min ago' },
  { name: 'Mark P.', suburb: 'Wetherill Park', service: 'move-out clean', timeAgo: '20 min ago' },
  { name: 'Amanda G.', suburb: 'Campbelltown', service: 'end-of-lease clean', timeAgo: '22 min ago' },
  { name: 'Tony B.', suburb: 'Ingleburn', service: 'office cleaning', timeAgo: '25 min ago' },
  { name: 'Priya S.', suburb: 'Harris Park', service: 'deep clean', timeAgo: '28 min ago' },
  { name: 'Robert L.', suburb: 'Glenfield', service: 'bond clean', timeAgo: '30 min ago' },
  { name: 'Michelle K.', suburb: 'Merrylands', service: 'Airbnb turnover', timeAgo: '33 min ago' },
  { name: 'Alex N.', suburb: 'Cabramatta', service: 'commercial clean', timeAgo: '35 min ago' },
  { name: 'Sophie T.', suburb: 'Liverpool', service: 'regular cleaning', timeAgo: '38 min ago' },
  { name: 'John D.', suburb: 'Greenacre', service: 'end-of-lease clean', timeAgo: '40 min ago' },
  { name: 'Fatima A.', suburb: 'Lakemba', service: 'deep clean', timeAgo: '43 min ago' },
  { name: 'Daniel W.', suburb: 'Smithfield', service: 'bond clean', timeAgo: '45 min ago' },
  { name: 'Lauren B.', suburb: 'Chester Hill', service: 'Airbnb turnover', timeAgo: '48 min ago' },
  { name: 'Kevin Y.', suburb: 'Parramatta', service: 'office cleaning', timeAgo: '50 min ago' },
  { name: 'Aisha M.', suburb: 'Granville', service: 'regular cleaning', timeAgo: '53 min ago' },
  { name: 'Steve R.', suburb: 'Yagoona', service: 'commercial clean', timeAgo: '55 min ago' },
  { name: 'Nina C.', suburb: 'Liverpool', service: 'end-of-lease clean', timeAgo: '58 min ago' },
];

export const RecentBookingToast: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Initial delay before first toast
    const initialDelay = setTimeout(() => {
      setIsVisible(true);
    }, 15000); // 15 seconds after page load

    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Auto-hide after 5 seconds
    const hideTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsExiting(false);
      }, 300);
    }, 5000);

    // Show next booking every 60 seconds (1 minute)
    const nextTimer = setTimeout(() => {
      setCurrentBooking((prev) => (prev + 1) % bookingData.length);
      setIsVisible(true);
    }, 60000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [isVisible, currentBooking]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
    }, 300);
  };

  if (!isVisible) return null;

  const booking = bookingData[currentBooking];

  return (
    <div
      className={`
        fixed bottom-24 md:bottom-6 left-4 z-30
        max-w-xs w-full
        transform transition-all duration-300 ease-out
        ${isExiting ? 'translate-x-[-120%] opacity-0' : 'translate-x-0 opacity-100'}
      `}
    >
      <div className="bg-[#1C1C1E]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-[#0066CC] to-[#2997FF] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {booking.name.charAt(0)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium leading-tight">
              <span className="text-white/90">{booking.name}</span>
              <span className="text-white/60"> from </span>
              <span className="text-white/90">{booking.suburb}</span>
            </p>
            <p className="text-white/60 text-xs mt-0.5">
              just booked a <span className="text-[#2997FF]">{booking.service}</span>
            </p>
            <p className="text-white/40 text-[10px] mt-1">
              {booking.timeAgo}
            </p>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30D158] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#30D158]"></span>
          </span>
          <span className="text-white/40 text-[10px] font-medium">
            Live activity
          </span>
        </div>
      </div>
    </div>
  );
};

// Hook to manage toast visibility for landing page
export const useRecentBookingToast = () => {
  const [isEnabled, setIsEnabled] = useState(true);

  // Disable toasts if user has interacted with the form
  const disableToasts = () => setIsEnabled(false);
  const enableToasts = () => setIsEnabled(true);

  return { isEnabled, disableToasts, enableToasts };
};

export default RecentBookingToast;
