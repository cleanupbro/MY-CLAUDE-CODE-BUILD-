/**
 * Roster View Component
 * Weekly calendar view for scheduling and managing cleaning jobs
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Booking, TeamMember } from '../../lib/supabaseClient';
import {
  getBookings,
  getBookingsByDateRange,
  assignCleaner,
  updateBooking,
} from '../../services/bookingService';
import { getActiveTeamMembers } from '../../services/teamService';

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  scheduled: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  in_progress: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  completed: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  cancelled: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  rescheduled: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
};

const SERVICE_ICONS: Record<string, string> = {
  'General': '🏠',
  'Deep': '✨',
  'End-of-Lease': '📦',
  'Airbnb': '🏡',
  'Commercial': '🏢',
};

export const RosterView: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(now.setDate(diff));
  });
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentWeekStart]);

  const loadData = async () => {
    setLoading(true);
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    const [bookingsData, teamData] = await Promise.all([
      getBookingsByDateRange(
        currentWeekStart.toISOString().split('T')[0],
        weekEnd.toISOString().split('T')[0]
      ),
      getActiveTeamMembers(),
    ]);

    setBookings(bookingsData);
    setTeamMembers(teamData);
    setLoading(false);
  };

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  }, [currentWeekStart]);

  const bookingsByDay = useMemo(() => {
    const byDay: Record<string, Booking[]> = {};
    weekDays.forEach((day) => {
      const dateStr = day.toISOString().split('T')[0];
      byDay[dateStr] = bookings.filter((b) => b.booking_date === dateStr);
    });
    return byDay;
  }, [bookings, weekDays]);

  const stats = useMemo(() => ({
    total: bookings.length,
    scheduled: bookings.filter((b) => b.status === 'scheduled').length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    unassigned: bookings.filter((b) => !b.assigned_to).length,
  }), [bookings]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const goToToday = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    setCurrentWeekStart(new Date(now.setDate(diff)));
  };

  const handleAssign = async (cleanerId: string) => {
    if (!selectedBooking) return;
    const updated = await assignCleaner(selectedBooking.id, cleanerId);
    if (updated) {
      setBookings(bookings.map((b) => (b.id === selectedBooking.id ? updated : b)));
      setShowAssignModal(false);
      setSelectedBooking(null);
    }
  };

  const getCleanerName = (id: string | null): string => {
    if (!id) return 'Unassigned';
    const member = teamMembers.find((m) => m.id === id);
    return member?.full_name || 'Unknown';
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0071e3]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">This Week</p>
          <p className="text-2xl font-bold text-[#1D1D1F]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Scheduled</p>
          <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Unassigned</p>
          <p className="text-2xl font-bold text-red-600">{stats.unassigned}</p>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <button
          onClick={() => navigateWeek('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-[#1D1D1F]">
            {currentWeekStart.toLocaleDateString('en-AU', { day: 'numeric', month: 'long' })} -{' '}
            {weekDays[6].toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
          </h2>
          <button
            onClick={goToToday}
            className="text-sm text-[#0071e3] hover:underline"
          >
            Today
          </button>
        </div>

        <button
          onClick={() => navigateWeek('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {weekDays.map((day) => (
            <div
              key={day.toISOString()}
              className={`p-4 text-center border-r border-gray-100 last:border-r-0 ${
                isToday(day) ? 'bg-blue-50' : ''
              }`}
            >
              <p className="text-xs text-gray-500 uppercase">
                {day.toLocaleDateString('en-AU', { weekday: 'short' })}
              </p>
              <p className={`text-lg font-bold ${isToday(day) ? 'text-[#0071e3]' : 'text-[#1D1D1F]'}`}>
                {day.getDate()}
              </p>
            </div>
          ))}
        </div>

        {/* Bookings Grid */}
        <div className="grid grid-cols-7 min-h-[400px]">
          {weekDays.map((day) => {
            const dateStr = day.toISOString().split('T')[0];
            const dayBookings = bookingsByDay[dateStr] || [];

            return (
              <div
                key={dateStr}
                className={`p-2 border-r border-gray-100 last:border-r-0 ${
                  isToday(day) ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="space-y-2">
                  {dayBookings.map((booking) => {
                    const colors = STATUS_COLORS[booking.status] || STATUS_COLORS.scheduled;
                    return (
                      <button
                        key={booking.id}
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowAssignModal(true);
                        }}
                        className={`w-full text-left p-2 rounded-lg border ${colors.bg} ${colors.border} hover:shadow-md transition-shadow`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <span>{SERVICE_ICONS[booking.service_type] || '🧹'}</span>
                          <span className="text-xs font-semibold truncate">{booking.service_type}</span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{booking.suburb || booking.address}</p>
                        {booking.start_time && (
                          <p className="text-xs text-gray-500">{booking.start_time}</p>
                        )}
                        <div className={`text-xs mt-1 ${!booking.assigned_to ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                          {getCleanerName(booking.assigned_to)}
                        </div>
                      </button>
                    );
                  })}

                  {dayBookings.length === 0 && (
                    <div className="text-center py-4 text-gray-300 text-xs">
                      No jobs
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1D1D1F]">Job Details</h3>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedBooking(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{SERVICE_ICONS[selectedBooking.service_type] || '🧹'}</span>
                  <span className="font-semibold text-[#1D1D1F]">{selectedBooking.service_type}</span>
                </div>
                <p className="text-sm text-gray-600">{selectedBooking.address}</p>
                {selectedBooking.suburb && (
                  <p className="text-sm text-gray-500">{selectedBooking.suburb}</p>
                )}
                <div className="flex gap-4 mt-2 text-sm">
                  <span>{selectedBooking.booking_date}</span>
                  {selectedBooking.start_time && <span>{selectedBooking.start_time}</span>}
                </div>
                {selectedBooking.quoted_price && (
                  <p className="text-lg font-bold text-[#0071e3] mt-2">
                    ${selectedBooking.quoted_price}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Assign Cleaner</p>
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleAssign(member.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selectedBooking.assigned_to === member.id
                          ? 'border-[#0071e3] bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                          {member.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-[#1D1D1F]">{member.full_name}</p>
                          <p className="text-xs text-gray-500">{member.phone}</p>
                        </div>
                        {selectedBooking.assigned_to === member.id && (
                          <svg className="w-5 h-5 text-[#0071e3] ml-auto" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}

                  {teamMembers.length === 0 && (
                    <p className="text-center text-gray-400 py-4">
                      No active team members. Add one in Team Management.
                    </p>
                  )}
                </div>
              </div>

              {selectedBooking.special_instructions && (
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-xs text-yellow-600 uppercase tracking-wide mb-1">Special Instructions</p>
                  <p className="text-sm text-yellow-800">{selectedBooking.special_instructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RosterView;
