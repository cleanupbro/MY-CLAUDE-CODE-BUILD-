import React, { useState, useMemo } from 'react';
import { Submission, ServiceType } from '../../types';

interface CalendarViewProps {
  submissions: Submission[];
  onViewSubmission: (submission: Submission) => void;
}

const SERVICE_COLORS: Record<string, string> = {
  'Residential Cleaning': 'bg-blue-500',
  'Commercial Cleaning': 'bg-green-500',
  'Airbnb Cleaning': 'bg-purple-500',
  'Job Application': 'bg-amber-500',
  'Landing Lead': 'bg-gray-500',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getPreferredDate = (data: any): string | null => {
  return data.preferredDate || data.preferredStartDate || null;
};

const getCustomerName = (data: any): string => {
  return data.fullName || data.contactPerson || data.contactName || 'Unknown';
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  submissions,
  onViewSubmission,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get submissions with dates, grouped by date
  const submissionsByDate = useMemo(() => {
    const map: Record<string, Submission[]> = {};

    submissions.forEach((submission) => {
      const dateStr = getPreferredDate(submission.data);
      if (dateStr) {
        // Parse date and normalize to YYYY-MM-DD
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          const key = date.toISOString().split('T')[0];
          if (!map[key]) map[key] = [];
          map[key].push(submission);
        }
      }
    });

    return map;
  }, [submissions]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first of the month
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [year, month]);

  // Get submissions for selected date
  const selectedDateSubmissions = useMemo(() => {
    if (!selectedDate) return [];
    const key = selectedDate.toISOString().split('T')[0];
    return submissionsByDate[key] || [];
  }, [selectedDate, submissionsByDate]);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Bookings</p>
          <p className="text-2xl font-bold text-[#1D1D1F]">
            {Object.values(submissionsByDate).flat().length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">This Month</p>
          <p className="text-2xl font-bold text-[#0071e3]">
            {Object.entries(submissionsByDate).filter(([key]) => {
              const date = new Date(key);
              return date.getMonth() === month && date.getFullYear() === year;
            }).reduce((sum, [, subs]) => sum + subs.length, 0)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Days with Bookings</p>
          <p className="text-2xl font-bold text-green-600">
            {Object.keys(submissionsByDate).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Today</p>
          <p className="text-2xl font-bold text-purple-600">
            {submissionsByDate[new Date().toISOString().split('T')[0]]?.length || 0}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-[#1D1D1F]">
                {MONTHS[month]} {year}
              </h2>
              <button
                onClick={goToToday}
                className="text-sm text-[#0071e3] hover:underline font-medium"
              >
                Today
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dateKey = date.toISOString().split('T')[0];
              const daySubmissions = submissionsByDate[dateKey] || [];
              const hasSubmissions = daySubmissions.length > 0;

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square p-1 rounded-xl transition-all relative ${
                    isSelected(date)
                      ? 'bg-[#0071e3] text-white'
                      : isToday(date)
                      ? 'bg-blue-50 text-[#0071e3] font-bold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-sm">{date.getDate()}</span>

                  {/* Event dots */}
                  {hasSubmissions && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      {daySubmissions.slice(0, 3).map((sub, i) => (
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected(date) ? 'bg-white' : SERVICE_COLORS[sub.type] || 'bg-gray-400'
                          }`}
                        />
                      ))}
                      {daySubmissions.length > 3 && (
                        <span className={`text-[8px] ${isSelected(date) ? 'text-white' : 'text-gray-500'}`}>
                          +{daySubmissions.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-gray-100">
            {Object.entries(SERVICE_COLORS).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-xs text-gray-500">{type.replace(' Cleaning', '')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Panel */}
        <div className="lg:w-[350px] bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-[#1D1D1F] mb-4">
            {selectedDate
              ? selectedDate.toLocaleDateString('en-AU', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'Select a date'}
          </h3>

          {selectedDate ? (
            selectedDateSubmissions.length > 0 ? (
              <div className="space-y-3">
                {selectedDateSubmissions.map((submission) => (
                  <button
                    key={submission.id}
                    onClick={() => onViewSubmission(submission)}
                    className="w-full text-left bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${SERVICE_COLORS[submission.type] || 'bg-gray-400'}`} />
                      <span className="text-xs font-medium text-gray-500">{submission.type}</span>
                    </div>
                    <p className="font-semibold text-[#1D1D1F] text-sm">
                      {getCustomerName(submission.data)}
                    </p>
                    {submission.data.priceEstimate && (
                      <p className="text-sm text-gray-500 mt-1">
                        ${submission.data.priceEstimate.toFixed(0)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">No bookings on this day</p>
              </div>
            )
          ) : (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <p className="text-sm">Click a date to see bookings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
