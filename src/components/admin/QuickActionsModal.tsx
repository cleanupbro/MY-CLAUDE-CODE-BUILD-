/**
 * Quick Actions Modal - Admin Dashboard
 * 
 * Provides quick actions for submissions:
 * - Approve & Schedule
 * - Complete & Invoice
 * - Request Review
 * 
 * Created: February 2, 2026
 */

import React, { useState } from 'react';
import { Submission, SubmissionStatus } from '../../types';
import { approveBooking, completeBooking, requestReview } from '../../services/bookingOrchestrationService';

interface QuickActionsModalProps {
  submission: Submission;
  onClose: () => void;
  onUpdate: (submission: Submission) => void;
}

type ActionType = 'approve' | 'complete' | 'review';

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  submission,
  onClose,
  onUpdate,
}) => {
  const [activeAction, setActiveAction] = useState<ActionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Approve form state
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [assignedTeam, setAssignedTeam] = useState('');
  const [finalPrice, setFinalPrice] = useState(
    (submission.data as any).estimatedPrice || (submission.data as any).price || 0
  );
  const [approvalNotes, setApprovalNotes] = useState('');

  // Invoice form state
  const [invoiceItems, setInvoiceItems] = useState([
    {
      name: submission.type,
      description: `${submission.type} cleaning service`,
      quantity: 1,
      amount: (submission.data as any).estimatedPrice || (submission.data as any).price || 0,
    },
  ]);
  const [invoiceNotes, setInvoiceNotes] = useState('');

  const customerData = {
    name: (submission.data as any).fullName || (submission.data as any).name || (submission.data as any).contactName || 'Customer',
    email: (submission.data as any).email || '',
    phone: (submission.data as any).phone || '',
    address: (submission.data as any).address || (submission.data as any).suburb || '',
    serviceType: submission.type,
  };

  const handleApprove = async () => {
    if (!scheduleDate) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await approveBooking(
        submission.id,
        {
          scheduledDate: scheduleDate,
          scheduledTime: scheduleTime,
          assignedTeam,
          finalPrice,
          notes: approvalNotes,
        },
        customerData
      );

      if (result.success) {
        setSuccess('✅ Booking approved! Calendar event created & confirmation email sent.');
        onUpdate({ ...submission, status: SubmissionStatus.Approved });
        setTimeout(onClose, 2000);
      } else {
        setError(result.error || 'Failed to approve booking');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await completeBooking(
        submission.id,
        {
          items: invoiceItems,
          notes: invoiceNotes,
        },
        {
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
        }
      );

      if (result.success) {
        setSuccess(`✅ Job completed! Invoice ${result.invoiceId || 'created'} sent to customer.`);
        onUpdate({ ...submission, status: SubmissionStatus.Completed });
        setTimeout(onClose, 2000);
      } else {
        setError(result.error || 'Failed to complete booking');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReview = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await requestReview(submission.id, {
        name: customerData.name,
        email: customerData.email,
        serviceType: customerData.serviceType,
        completedDate: new Date().toISOString().split('T')[0],
      });

      if (result.success) {
        setSuccess('✅ Review request sent to customer!');
        setTimeout(onClose, 2000);
      } else {
        setError(result.error || 'Failed to send review request');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addInvoiceItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { name: '', description: '', quantity: 1, amount: 0 },
    ]);
  };

  const updateInvoiceItem = (index: number, field: string, value: string | number) => {
    const updated = [...invoiceItems];
    (updated[index] as any)[field] = value;
    setInvoiceItems(updated);
  };

  const removeInvoiceItem = (index: number) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
    }
  };

  const totalAmount = invoiceItems.reduce((sum, item) => sum + item.amount * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">⚡ Quick Actions</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Customer Info */}
        <div className="p-4 bg-white/5 border-b border-white/10">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-white/40">Customer:</span> <span className="text-white">{customerData.name}</span></div>
            <div><span className="text-white/40">Type:</span> <span className="text-white">{submission.type}</span></div>
            <div><span className="text-white/40">Email:</span> <span className="text-white">{customerData.email}</span></div>
            <div><span className="text-white/40">Phone:</span> <span className="text-white">{customerData.phone}</span></div>
            <div className="col-span-2"><span className="text-white/40">Address:</span> <span className="text-white">{customerData.address}</span></div>
          </div>
        </div>

        {/* Action Buttons */}
        {!activeAction && (
          <div className="p-4 space-y-3">
            <button
              onClick={() => setActiveAction('approve')}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              ✅ Approve & Schedule
            </button>
            <button
              onClick={() => setActiveAction('complete')}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              💰 Complete & Invoice
            </button>
            <button
              onClick={() => setActiveAction('review')}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              ⭐ Request Review
            </button>
          </div>
        )}

        {/* Approve Form */}
        {activeAction === 'approve' && (
          <div className="p-4 space-y-4">
            <button
              onClick={() => setActiveAction(null)}
              className="text-white/60 hover:text-white text-sm flex items-center gap-1"
            >
              ← Back
            </button>
            
            <h3 className="text-lg font-bold text-white">📅 Schedule Booking</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 text-sm mb-1">Date</label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-1">Time</label>
                <select
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                >
                  {['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-1">Assigned Team</label>
              <input
                type="text"
                value={assignedTeam}
                onChange={(e) => setAssignedTeam(e.target.value)}
                placeholder="e.g., Team Alpha, John"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30"
              />
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-1">Final Price ($)</label>
              <input
                type="number"
                value={finalPrice}
                onChange={(e) => setFinalPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-1">Notes</label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Special instructions..."
                rows={2}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 resize-none"
              />
            </div>

            <button
              onClick={handleApprove}
              disabled={loading}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white rounded-xl font-semibold transition-colors"
            >
              {loading ? '⏳ Processing...' : '✅ Approve Booking'}
            </button>
          </div>
        )}

        {/* Complete & Invoice Form */}
        {activeAction === 'complete' && (
          <div className="p-4 space-y-4">
            <button
              onClick={() => setActiveAction(null)}
              className="text-white/60 hover:text-white text-sm flex items-center gap-1"
            >
              ← Back
            </button>
            
            <h3 className="text-lg font-bold text-white">🧾 Create Invoice</h3>

            <div className="space-y-3">
              {invoiceItems.map((item, index) => (
                <div key={index} className="p-3 bg-white/5 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Item {index + 1}</span>
                    {invoiceItems.length > 1 && (
                      <button
                        onClick={() => removeInvoiceItem(index)}
                        className="text-red-400 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateInvoiceItem(index, 'name', e.target.value)}
                    placeholder="Service name"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-white/40 text-xs">Qty</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateInvoiceItem(index, 'quantity', Number(e.target.value))}
                        min="1"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs">Amount ($)</label>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateInvoiceItem(index, 'amount', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addInvoiceItem}
              className="w-full py-2 border border-dashed border-white/20 text-white/60 rounded-lg hover:bg-white/5"
            >
              + Add Item
            </button>

            <div className="flex justify-between items-center py-3 border-t border-white/10">
              <span className="text-white/60">Total:</span>
              <span className="text-2xl font-bold text-white">${totalAmount.toFixed(2)}</span>
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-1">Invoice Notes</label>
              <textarea
                value={invoiceNotes}
                onChange={(e) => setInvoiceNotes(e.target.value)}
                placeholder="Thank you for your business..."
                rows={2}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/30 resize-none"
              />
            </div>

            <button
              onClick={handleComplete}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl font-semibold transition-colors"
            >
              {loading ? '⏳ Processing...' : '💰 Complete & Send Invoice'}
            </button>
          </div>
        )}

        {/* Review Request */}
        {activeAction === 'review' && (
          <div className="p-4 space-y-4">
            <button
              onClick={() => setActiveAction(null)}
              className="text-white/60 hover:text-white text-sm flex items-center gap-1"
            >
              ← Back
            </button>
            
            <h3 className="text-lg font-bold text-white">⭐ Request Review</h3>

            <p className="text-white/60">
              Send a review request email to <strong className="text-white">{customerData.email}</strong>
            </p>

            <div className="p-3 bg-white/5 rounded-lg text-sm text-white/60">
              <p>The email will include links to:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Google Business reviews</li>
                <li>Facebook page reviews</li>
              </ul>
            </div>

            <button
              onClick={handleRequestReview}
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white rounded-xl font-semibold transition-colors"
            >
              {loading ? '⏳ Sending...' : '⭐ Send Review Request'}
            </button>
          </div>
        )}

        {/* Status Messages */}
        {error && (
          <div className="mx-4 mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mx-4 mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickActionsModal;
