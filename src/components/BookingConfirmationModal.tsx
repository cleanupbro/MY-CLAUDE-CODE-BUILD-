import React, { useState } from 'react';
import { Submission } from '../types';
import { WEBHOOK_URLS } from '../constants';
import { createPaymentLink, PaymentLinkData } from '../services/squareService';

interface BookingConfirmationModalProps {
  submission: Submission;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  submission,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [customerName, setCustomerName] = useState(
    submission.data.fullName || submission.data.name || ''
  );
  const [customerEmail, setCustomerEmail] = useState(submission.data.email || '');
  const [finalPrice, setFinalPrice] = useState(
    submission.data.aiEstimate?.estimatedPrice || ''
  );
  const [scheduledDate, setScheduledDate] = useState(
    submission.data.preferredDate || ''
  );
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [paymentLink, setPaymentLink] = useState('');

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!customerName || !customerEmail || !finalPrice) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const priceNumber = parseFloat(finalPrice.toString().replace(/[^0-9.]/g, ''));
      if (isNaN(priceNumber) || priceNumber <= 0) {
        setError('Please enter a valid price');
        setLoading(false);
        return;
      }

      // Prepare payment link data
      const paymentData: PaymentLinkData = {
        customerName,
        customerEmail,
        serviceType: submission.type || 'Cleaning Service',
        amount: priceNumber,
        referenceId: submission.id,
        description: notes || `${submission.type} - Clean Up Bros`,
      };

      // Call n8n webhook to create Square payment link
      const result = await createPaymentLink(paymentData);

      if (result.success && result.paymentLink) {
        setPaymentLink(result.paymentLink);
        setSuccess(true);

        // Also send booking confirmation to n8n
        await fetch(WEBHOOK_URLS.BOOKING_CONFIRMATION, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            submissionId: submission.id,
            customerName,
            customerEmail,
            finalPrice: priceNumber,
            scheduledDate,
            notes,
            paymentLink: result.paymentLink,
            orderId: result.orderId,
            serviceType: submission.type,
            propertyDetails: submission.data.suburb || '',
            timestamp: new Date().toISOString(),
          }),
        });

        // Notify parent component
        setTimeout(() => {
          onConfirm();
          onClose();
        }, 3000);
      } else {
        setError(result.error || 'Failed to create payment link');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink);
      alert('Payment link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background overlay */}
      <div className="glass-overlay flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="glass-modal inline-block align-bottom rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {success ? (
            /* Success State */
            <div className="px-8 py-10 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Payment Link Created!</h3>
                <p className="text-white/80 text-lg">
                  {customerName} will receive an email with the payment link shortly.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
                <p className="text-sm text-white/60 mb-2">Payment Link</p>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={paymentLink}
                    readOnly
                    className="flex-1 bg-white/5 border border-white/20 text-white rounded-xl px-4 py-3 text-sm font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="glass-button text-white px-6 py-3 hover:scale-105 transition-transform"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-left bg-white/5 rounded-2xl p-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Customer:</span>
                  <span className="text-white font-semibold">{customerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Email:</span>
                  <span className="text-white font-semibold">{customerEmail}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Amount:</span>
                  <span className="text-gradient-gold font-bold text-xl">${finalPrice}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="mt-6 w-full glass-button text-white py-3 text-lg font-semibold hover:scale-105 transition-transform"
              >
                Done
              </button>
            </div>
          ) : (
            /* Form State */
            <>
              <div className="px-8 py-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white" id="modal-title">
                      Confirm Booking & Send Payment Link
                    </h3>
                    <p className="text-white/60 text-sm mt-1">
                      Ref: {submission.id}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="px-8 py-6 space-y-5">
                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-200 text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Customer Name */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="John Smith"
                    required
                  />
                </div>

                {/* Customer Email */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Customer Email *
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Final Price */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Final Price (AUD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 text-lg font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(e.target.value)}
                      className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl pl-10 pr-4 py-3 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      placeholder="180.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <p className="text-white/40 text-xs mt-1">
                    Estimated: ${submission.data.aiEstimate?.estimatedPrice || 'N/A'}
                  </p>
                </div>

                {/* Scheduled Date */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                    rows={3}
                    placeholder="Special instructions, access details, etc."
                  />
                </div>

                {/* Info Box */}
                <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
                  <p className="text-blue-200 text-sm leading-relaxed">
                    <strong className="font-semibold">What happens next:</strong>
                    <br />
                    • Square payment link will be created automatically
                    <br />
                    • Customer receives email with payment instructions
                    <br />
                    • You'll get notified when payment is completed
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-8 py-6 bg-white/5 border-t border-white/10 flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 bg-white/10 text-white rounded-xl py-3 font-semibold hover:bg-white/20 transition-all"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 glass-button glow-gold text-white rounded-xl py-3 font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Payment Link...
                    </span>
                  ) : (
                    '💳 Confirm & Send Payment Link'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
