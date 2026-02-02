/**
 * Money View - Admin CRM
 * Simple invoicing and payment tracking
 * 
 * Created: February 2, 2026
 */

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { createPaymentLink } from '../../services/squareService';

interface CompletedJob {
  id: string;
  customer: string;
  phone: string;
  email: string;
  service: string;
  price: number;
  date: string;
  paid: boolean;
}

export const MoneyView: React.FC = () => {
  const [completedJobs, setCompletedJobs] = useState<CompletedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'unpaid' | 'paid' | 'all'>('unpaid');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<CompletedJob | null>(null);
  const [stats, setStats] = useState({ unpaid: 0, paid: 0, thisWeek: 0, thisMonth: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false);
      return;
    }

    try {
      // Get completed submissions
      const { data: submissions } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'Completed')
        .order('created_at', { ascending: false });

      const jobs: CompletedJob[] = (submissions || []).map((sub: any) => ({
        id: sub.id,
        customer: sub.data?.fullName || sub.data?.name || sub.data?.contactName || 'Customer',
        phone: sub.data?.phone || '',
        email: sub.data?.email || '',
        service: sub.type,
        price: sub.data?.estimatedPrice || sub.data?.price || sub.data?.priceEstimate || 0,
        date: sub.created_at,
        paid: sub.data?.paid || false,
      }));

      setCompletedJobs(jobs);

      // Calculate stats
      const unpaidTotal = jobs.filter(j => !j.paid).reduce((sum, j) => sum + j.price, 0);
      const paidTotal = jobs.filter(j => j.paid).reduce((sum, j) => sum + j.price, 0);
      
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const thisWeek = jobs
        .filter(j => j.paid && new Date(j.date) >= weekAgo)
        .reduce((sum, j) => sum + j.price, 0);
      
      const thisMonth = jobs
        .filter(j => j.paid && new Date(j.date) >= monthAgo)
        .reduce((sum, j) => sum + j.price, 0);

      setStats({ unpaid: unpaidTotal, paid: paidTotal, thisWeek, thisMonth });
    } catch (error) {
      console.error('Failed to load money data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = completedJobs.filter(job => {
    if (view === 'unpaid') return !job.paid;
    if (view === 'paid') return job.paid;
    return true;
  });

  const markAsPaid = async (jobId: string) => {
    if (!supabase) return;

    try {
      const job = completedJobs.find(j => j.id === jobId);
      if (!job) return;

      await supabase
        .from('submissions')
        .update({
          data: { ...job, paid: true }
        })
        .eq('id', jobId);

      // Update local state
      setCompletedJobs(completedJobs.map(j => 
        j.id === jobId ? { ...j, paid: true } : j
      ));

      alert('Marked as paid! ✅');
    } catch (error) {
      console.error('Failed to mark as paid:', error);
      alert('Failed to update. Please try again.');
    }
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
    });
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
        <h1 className="text-2xl font-bold text-gray-800">💰 Money</h1>
        <button
          onClick={loadData}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          🔄
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm">⏳ Unpaid</p>
          <p className="text-2xl font-bold text-red-700">${stats.unpaid}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-600 text-sm">✅ This Month</p>
          <p className="text-2xl font-bold text-green-700">${stats.thisMonth}</p>
        </div>
      </div>

      {/* Bank Details Quick Reference */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <p className="text-sm text-gray-500 mb-2">🏦 Bank Details (for customers)</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-400">BSB:</span>
            <span className="font-mono font-medium ml-2">067873</span>
          </div>
          <div>
            <span className="text-gray-400">Account:</span>
            <span className="font-mono font-medium ml-2">21358726</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-400">Name:</span>
            <span className="font-medium ml-2">Hafsah Nuzhat</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('unpaid')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            view === 'unpaid'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ⏳ Unpaid ({completedJobs.filter(j => !j.paid).length})
        </button>
        <button
          onClick={() => setView('paid')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            view === 'paid'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ✅ Paid
        </button>
        <button
          onClick={() => setView('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            view === 'all'
              ? 'bg-teal-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
          <span className="text-5xl">{view === 'unpaid' ? '🎉' : '📋'}</span>
          <p className="text-gray-500 mt-3 text-lg">
            {view === 'unpaid' ? 'All payments received!' : 'No completed jobs yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  job.paid ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {job.paid ? '✅' : '⏳'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{job.customer}</h3>
                  <p className="text-sm text-gray-500">{job.service}</p>
                  <p className="text-xs text-gray-400">{formatDate(job.date)}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${job.paid ? 'text-green-600' : 'text-red-600'}`}>
                    ${job.price}
                  </p>
                  {!job.paid && (
                    <div className="flex gap-1 mt-2">
                      <button
                        onClick={() => markAsPaid(job.id)}
                        className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        ✓ Paid
                      </button>
                      <button
                        onClick={() => {
                          setSelectedJob(job);
                          setShowInvoiceModal(true);
                        }}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        📧 Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && selectedJob && (
        <InvoiceModal
          job={selectedJob}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedJob(null);
          }}
          onSent={() => {
            setShowInvoiceModal(false);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};

// Invoice Modal
const InvoiceModal: React.FC<{
  job: CompletedJob;
  onClose: () => void;
  onSent: () => void;
}> = ({ job, onClose, onSent }) => {
  const [sending, setSending] = useState(false);
  const [method, setMethod] = useState<'whatsapp' | 'sms' | 'square'>('whatsapp');

  const handleSend = async () => {
    setSending(true);

    try {
      if (method === 'square') {
        // Create Square payment link
        const result = await createPaymentLink({
          customerName: job.customer,
          customerEmail: job.email,
          serviceType: job.service,
          amount: job.price,
          referenceId: job.id,
        });

        if (result.success && result.paymentLink) {
          // Open WhatsApp with payment link
          const message = `Hi ${job.customer}! Here's your invoice for ${job.service}:\n\n💰 Amount: $${job.price}\n🔗 Pay here: ${result.paymentLink}\n\nThank you for choosing Clean Up Bros! 🧹`;
          const phone = job.phone.replace(/\D/g, '');
          const formattedPhone = phone.startsWith('0') ? `61${phone.slice(1)}` : phone;
          window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
        } else {
          throw new Error('Failed to create payment link');
        }
      } else {
        // WhatsApp/SMS with bank details
        const message = `Hi ${job.customer}! Here's your invoice for ${job.service}:\n\n💰 Amount: $${job.price}\n\n🏦 Bank Transfer:\nBSB: 067873\nAccount: 21358726\nName: Hafsah Nuzhat\nRef: ${job.id.slice(0, 8)}\n\nThank you for choosing Clean Up Bros! 🧹`;
        
        if (method === 'whatsapp') {
          const phone = job.phone.replace(/\D/g, '');
          const formattedPhone = phone.startsWith('0') ? `61${phone.slice(1)}` : phone;
          window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
        } else {
          window.location.href = `sms:${job.phone}?body=${encodeURIComponent(message)}`;
        }
      }

      alert('Invoice sent! 📧');
      onSent();
    } catch (error) {
      console.error('Send invoice error:', error);
      alert('Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Send Invoice</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Job Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-800">{job.customer}</p>
                <p className="text-sm text-gray-500">{job.service}</p>
              </div>
              <p className="text-xl font-bold text-teal-600">${job.price}</p>
            </div>
          </div>

          {/* Send Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How to send?
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setMethod('whatsapp')}
                className={`w-full p-3 rounded-xl border-2 text-left flex items-center gap-3 transition ${
                  method === 'whatsapp'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-xs text-gray-500">Send with bank details</p>
                </div>
              </button>
              
              <button
                onClick={() => setMethod('square')}
                className={`w-full p-3 rounded-xl border-2 text-left flex items-center gap-3 transition ${
                  method === 'square'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">💳</span>
                <div>
                  <p className="font-medium">Square Payment Link</p>
                  <p className="text-xs text-gray-500">Pay online with card</p>
                </div>
              </button>

              <button
                onClick={() => setMethod('sms')}
                className={`w-full p-3 rounded-xl border-2 text-left flex items-center gap-3 transition ${
                  method === 'sms'
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-medium">SMS</p>
                  <p className="text-xs text-gray-500">Send text message</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full py-4 bg-teal-500 text-white rounded-xl font-bold text-lg hover:bg-teal-600 transition disabled:opacity-50"
          >
            {sending ? '⏳ Sending...' : '📧 Send Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoneyView;
