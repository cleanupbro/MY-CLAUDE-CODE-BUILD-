/**
 * Jobs View - Admin CRM
 * Simple job/booking management
 * 
 * Created: February 2, 2026
 */

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

interface Job {
  id: string;
  created_at: string;
  booking_date: string;
  start_time: string;
  service_type: string;
  address: string;
  suburb: string;
  status: string;
  quoted_price: number;
  customer_name?: string;
  customer_phone?: string;
  assigned_to?: string;
  notes?: string;
}

export const JobsView: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [approvedQuotes, setApprovedQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'upcoming' | 'schedule'>('upcoming');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false);
      return;
    }

    try {
      // Load approved quotes that need scheduling
      const { data: quotes } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'Approved')
        .order('created_at', { ascending: false });

      setApprovedQuotes(quotes || []);

      // Load scheduled jobs (from bookings table if exists)
      // For now, we'll show approved quotes as "to be scheduled"
      setJobs([]);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">📅 Jobs</h1>
        <button
          onClick={loadData}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title="Refresh"
        >
          🔄
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('upcoming')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            view === 'upcoming'
              ? 'bg-teal-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📆 Upcoming
        </button>
        <button
          onClick={() => setView('schedule')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            view === 'schedule'
              ? 'bg-teal-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ⏳ To Schedule ({approvedQuotes.length})
        </button>
      </div>

      {/* Content */}
      {view === 'upcoming' ? (
        // Upcoming Jobs
        jobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
            <span className="text-5xl">📅</span>
            <p className="text-gray-500 mt-3 text-lg">No upcoming jobs scheduled</p>
            <p className="text-gray-400 text-sm mt-1">
              Approve quotes and schedule them to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-teal-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs text-teal-600 font-medium">
                      {new Date(job.booking_date).toLocaleDateString('en-AU', { weekday: 'short' })}
                    </span>
                    <span className="text-lg font-bold text-teal-700">
                      {new Date(job.booking_date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800">{job.customer_name || 'Customer'}</h3>
                    <p className="text-sm text-gray-500">{job.service_type}</p>
                    <p className="text-sm text-gray-400">{job.address}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-gray-500">🕐 {job.start_time}</span>
                      <span className="text-sm text-teal-600 font-medium">${job.quoted_price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        // To Schedule
        approvedQuotes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
            <span className="text-5xl">✅</span>
            <p className="text-gray-500 mt-3 text-lg">All jobs are scheduled!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {approvedQuotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                    ⏳
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800">
                      {quote.data?.fullName || quote.data?.name || 'Customer'}
                    </h3>
                    <p className="text-sm text-gray-500">{quote.type}</p>
                    <p className="text-sm text-gray-400">
                      {quote.data?.suburb || quote.data?.address || 'Location TBD'}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm text-teal-600 font-medium">
                        ${quote.data?.estimatedPrice || quote.data?.price || 'TBD'}
                      </span>
                      {quote.data?.preferredDate && (
                        <span className="text-sm text-gray-400">
                          Preferred: {quote.data.preferredDate}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedQuote(quote);
                      setShowScheduleModal(true);
                    }}
                    className="px-4 py-2 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition"
                  >
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Schedule Modal */}
      {showScheduleModal && selectedQuote && (
        <ScheduleModal
          quote={selectedQuote}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedQuote(null);
          }}
          onScheduled={() => {
            setShowScheduleModal(false);
            setSelectedQuote(null);
            loadData();
          }}
        />
      )}
    </div>
  );
};

// Schedule Modal Component
const ScheduleModal: React.FC<{
  quote: any;
  onClose: () => void;
  onScheduled: () => void;
}> = ({ quote, onClose, onScheduled }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSchedule = async () => {
    if (!date) {
      alert('Please select a date');
      return;
    }

    setSaving(true);

    try {
      // For now, we'll just update the quote with schedule info
      // In full version, this would create a booking record
      if (supabase) {
        await supabase
          .from('submissions')
          .update({
            data: {
              ...quote.data,
              scheduledDate: date,
              scheduledTime: time,
              scheduleNotes: notes,
            }
          })
          .eq('id', quote.id);
      }

      alert(`Job scheduled for ${date} at ${time}!`);
      onScheduled();
    } catch (error) {
      console.error('Schedule error:', error);
      alert('Failed to schedule. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Schedule Job</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="font-medium text-gray-800">
              {quote.data?.fullName || quote.data?.name || 'Customer'}
            </p>
            <p className="text-sm text-gray-500">{quote.type}</p>
            <p className="text-sm text-gray-400">
              {quote.data?.suburb || quote.data?.address}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📅 Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🕐 Time
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500"
            >
              <option value="07:00">7:00 AM</option>
              <option value="08:00">8:00 AM</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="13:00">1:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📝 Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500"
              placeholder="Any special instructions..."
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSchedule}
            disabled={saving || !date}
            className="w-full py-4 bg-teal-500 text-white rounded-xl font-bold text-lg hover:bg-teal-600 transition disabled:opacity-50"
          >
            {saving ? '⏳ Scheduling...' : '✅ Confirm Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobsView;
