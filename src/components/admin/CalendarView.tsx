import React, { useState, useMemo, useEffect } from 'react';
import { Submission } from '../../types';
import { Booking, TeamMember } from '../../lib/supabaseClient';
import { createBooking, getBookings, deleteBooking } from '../../services/bookingService';
import { getActiveTeamMembers } from '../../services/teamService';

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
  'General': 'bg-blue-500',
  'Deep': 'bg-teal-500',
  'End-of-Lease': 'bg-orange-500',
  'Airbnb': 'bg-purple-500',
  'Commercial': 'bg-green-500',
};

const SERVICE_TYPES = [
  'General',
  'Deep',
  'End-of-Lease',
  'Airbnb',
  'Commercial',
];

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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    service_type: 'General',
    customer_name: '',
    email: '',
    phone: '',
    address: '',
    suburb: '',
    bedrooms: 2,
    bathrooms: 1,
    start_time: '09:00',
    quoted_price: '',
    assigned_to: '',
    special_instructions: '',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Load bookings and team members
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [bookingsData, teamData] = await Promise.all([
      getBookings(),
      getActiveTeamMembers(),
    ]);
    setBookings(bookingsData);
    setTeamMembers(teamData);
  };

  // Get submissions with dates, grouped by date
  const submissionsByDate = useMemo(() => {
    const map: Record<string, Submission[]> = {};

    submissions.forEach((submission) => {
      const dateStr = getPreferredDate(submission.data);
      if (dateStr) {
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

  // Group bookings by date
  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    bookings.forEach((booking) => {
      const key = booking.booking_date;
      if (!map[key]) map[key] = [];
      map[key].push(booking);
    });
    return map;
  }, [bookings]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }, [year, month]);

  // Get items for selected date
  const selectedDateSubmissions = useMemo(() => {
    if (!selectedDate) return [];
    const key = selectedDate.toISOString().split('T')[0];
    return submissionsByDate[key] || [];
  }, [selectedDate, submissionsByDate]);

  const selectedDateBookings = useMemo(() => {
    if (!selectedDate) return [];
    const key = selectedDate.toISOString().split('T')[0];
    return bookingsByDate[key] || [];
  }, [selectedDate, bookingsByDate]);

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

  const handleOpenAddModal = () => {
    if (!selectedDate) {
      setSelectedDate(new Date());
    }
    setFormData({
      service_type: 'General',
      customer_name: '',
      email: '',
      phone: '',
      address: '',
      suburb: '',
      bedrooms: 2,
      bathrooms: 1,
      start_time: '09:00',
      quoted_price: '',
      assigned_to: '',
      special_instructions: '',
    });
    setShowAddModal(true);
  };

  const handleCreateBooking = async () => {
    if (!selectedDate || !formData.customer_name || !formData.address) {
      setFeedback({ type: 'error', message: 'Please fill in customer name and address' });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    const bookingDate = selectedDate.toISOString().split('T')[0];

    try {
      const newBooking = await createBooking({
        booking_date: bookingDate,
        start_time: formData.start_time,
        service_type: formData.service_type,
        address: formData.address,
        suburb: formData.suburb || null,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        special_instructions: formData.special_instructions || null,
        assigned_to: formData.assigned_to || null,
        status: 'scheduled',
        quoted_price: formData.quoted_price ? parseFloat(formData.quoted_price) : null,
        payment_status: 'pending',
      });

      if (newBooking) {
        setBookings([...bookings, newBooking]);
        setShowAddModal(false);
        setFeedback({ type: 'success', message: 'Booking created successfully!' });
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback({ type: 'error', message: 'Failed to create booking. Check console for details.' });
        setTimeout(() => setFeedback(null), 5000);
      }
    } catch (error) {
      console.error('Booking creation error:', error);
      setFeedback({ type: 'error', message: 'An error occurred. Please try again.' });
      setTimeout(() => setFeedback(null), 5000);
    }

    setIsLoading(false);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    setIsLoading(true);
    setFeedback(null);

    try {
      const success = await deleteBooking(bookingId);

      if (success) {
        setBookings(bookings.filter(b => b.id !== bookingId));
        setFeedback({ type: 'success', message: 'Booking deleted successfully!' });
        setTimeout(() => setFeedback(null), 3000);
      } else {
        setFeedback({ type: 'error', message: 'Failed to delete booking.' });
        setTimeout(() => setFeedback(null), 5000);
      }
    } catch (error) {
      console.error('Booking deletion error:', error);
      setFeedback({ type: 'error', message: 'An error occurred while deleting.' });
      setTimeout(() => setFeedback(null), 5000);
    }

    setDeleteConfirmId(null);
    setIsLoading(false);
  };

  const getCleanerName = (id: string | null): string => {
    if (!id) return 'Unassigned';
    const member = teamMembers.find((m) => m.id === id);
    return member?.full_name || 'Unknown';
  };

  // Stats
  const totalBookings = bookings.length;
  const thisMonthBookings = bookings.filter(b => {
    const d = new Date(b.booking_date);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;

  return (
    <div className="space-y-6">
      {/* Feedback Toast */}
      {feedback && (
        <div className={`fixed top-24 right-6 z-50 px-6 py-4 rounded-xl shadow-lg transition-all ${
          feedback.type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-3">
            {feedback.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className="font-medium">{feedback.message}</span>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Bookings</p>
          <p className="text-2xl font-bold text-[#1D1D1F]">{totalBookings}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">This Month</p>
          <p className="text-2xl font-bold text-[#0071e3]">{thisMonthBookings}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Submissions</p>
          <p className="text-2xl font-bold text-green-600">
            {Object.values(submissionsByDate).flat().length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Today</p>
          <p className="text-2xl font-bold text-purple-600">
            {(bookingsByDate[new Date().toISOString().split('T')[0]]?.length || 0)}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar - Dark Theme */}
        <div className="flex-1 bg-gray-900 rounded-2xl p-6 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">
                {MONTHS[month]} {year}
              </h2>
              <button
                onClick={goToToday}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium"
              >
                Today
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors"
              >
                + Add Booking
              </button>
              <button
                onClick={goToPrevMonth}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
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
              const dayBookings = bookingsByDate[dateKey] || [];
              const hasItems = daySubmissions.length > 0 || dayBookings.length > 0;

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square p-1 rounded-xl transition-all relative ${
                    isSelected(date)
                      ? 'bg-blue-500 text-white'
                      : isToday(date)
                      ? 'bg-blue-900 text-blue-300 font-bold ring-2 ring-blue-500'
                      : 'text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  <span className="text-sm">{date.getDate()}</span>

                  {/* Event dots */}
                  {hasItems && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                      {dayBookings.slice(0, 2).map((booking, i) => (
                        <div
                          key={`b-${i}`}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected(date) ? 'bg-white' : SERVICE_COLORS[booking.service_type] || 'bg-teal-400'
                          }`}
                        />
                      ))}
                      {daySubmissions.slice(0, 1).map((sub, i) => (
                        <div
                          key={`s-${i}`}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected(date) ? 'bg-white' : 'bg-amber-400'
                          }`}
                        />
                      ))}
                      {(dayBookings.length + daySubmissions.length) > 3 && (
                        <span className={`text-[8px] ${isSelected(date) ? 'text-white' : 'text-gray-400'}`}>
                          +{(dayBookings.length + daySubmissions.length) - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-teal-400" />
              <span className="text-xs text-gray-400">Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-xs text-gray-400">Lead/Submission</span>
            </div>
            {Object.entries(SERVICE_COLORS).slice(0, 4).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-xs text-gray-400">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Date Panel */}
        <div className="lg:w-[380px] bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#1D1D1F]">
              {selectedDate
                ? selectedDate.toLocaleDateString('en-AU', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })
                : 'Select a date'}
            </h3>
            {selectedDate && (
              <button
                onClick={handleOpenAddModal}
                className="text-sm text-[#0071e3] hover:underline font-medium"
              >
                + Add
              </button>
            )}
          </div>

          {selectedDate ? (
            <>
              {/* Bookings Section */}
              {selectedDateBookings.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Bookings</p>
                  <div className="space-y-2">
                    {selectedDateBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-gray-50 rounded-xl p-3 border-l-4 border-teal-500 relative group"
                      >
                        {/* Delete button - appears on hover */}
                        <button
                          onClick={() => setDeleteConfirmId(booking.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                          title="Delete booking"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>

                        {/* Delete confirmation overlay */}
                        {deleteConfirmId === booking.id && (
                          <div className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center p-3 z-10">
                            <p className="text-sm font-semibold text-gray-900 mb-3">Delete this booking?</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                disabled={isLoading}
                                className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
                              >
                                {isLoading ? 'Deleting...' : 'Yes, Delete'}
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-teal-600">{booking.service_type}</span>
                          <span className="text-xs text-gray-500 mr-6">{booking.start_time || 'TBD'}</span>
                        </div>
                        <p className="font-semibold text-[#1D1D1F] text-sm mt-1">
                          {booking.suburb || booking.address}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {getCleanerName(booking.assigned_to)}
                          </span>
                          {booking.quoted_price && (
                            <span className="text-sm font-bold text-green-600">
                              ${booking.quoted_price}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submissions Section */}
              {selectedDateSubmissions.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Leads/Submissions</p>
                  <div className="space-y-2">
                    {selectedDateSubmissions.map((submission) => (
                      <button
                        key={submission.id}
                        onClick={() => onViewSubmission(submission)}
                        className="w-full text-left bg-amber-50 rounded-xl p-3 hover:bg-amber-100 transition-colors border-l-4 border-amber-500"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-amber-600">{submission.type}</span>
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
                </div>
              )}

              {/* Empty State */}
              {selectedDateBookings.length === 0 && selectedDateSubmissions.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm mb-3">No bookings on this day</p>
                  <button
                    onClick={handleOpenAddModal}
                    className="text-sm text-[#0071e3] hover:underline font-medium"
                  >
                    + Add a booking
                  </button>
                </div>
              )}
            </>
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

      {/* Add Booking Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                📅 New Booking
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Date Display */}
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-xs text-blue-600 uppercase tracking-wide">Booking Date</p>
                <p className="text-lg font-bold text-[#1D1D1F]">
                  {selectedDate?.toLocaleDateString('en-AU', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
                  <select
                    value={formData.service_type}
                    onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white"
                  >
                    {SERVICE_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white"
                  />
                </div>

                {/* Customer Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white placeholder-gray-400"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main Street"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white placeholder-gray-400"
                  />
                </div>

                {/* Suburb */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Suburb</label>
                  <input
                    type="text"
                    value={formData.suburb}
                    onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                    placeholder="Liverpool"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white placeholder-gray-400"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quoted Price ($)</label>
                  <input
                    type="number"
                    value={formData.quoted_price}
                    onChange={(e) => setFormData({ ...formData, quoted_price: e.target.value })}
                    placeholder="250"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white placeholder-gray-400"
                  />
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white"
                  />
                </div>

                {/* Bathrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white"
                  />
                </div>

                {/* Assign Cleaner */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign Cleaner</label>
                  <select
                    value={formData.assigned_to}
                    onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white"
                  >
                    <option value="">-- Unassigned --</option>
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.id}>{member.full_name}</option>
                    ))}
                  </select>
                </div>

                {/* Special Instructions */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                  <textarea
                    value={formData.special_instructions}
                    onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                    placeholder="Any special notes..."
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBooking}
                disabled={isLoading || !formData.customer_name || !formData.address}
                className="px-6 py-2 text-sm font-semibold text-white bg-green-500 rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : '✓ Create Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
