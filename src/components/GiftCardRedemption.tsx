import React, { useState } from 'react';
import { verifyGiftCard, GiftCard } from '../services/giftCardService';

interface GiftCardRedemptionProps {
  totalAmount: number;
  onApply: (giftCard: GiftCard, amountToApply: number) => void;
  onRemove?: () => void;
  appliedGiftCard?: { code: string; amount: number };
}

export const GiftCardRedemption: React.FC<GiftCardRedemptionProps> = ({
  totalAmount,
  onApply,
  onRemove,
  appliedGiftCard,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedCard, setVerifiedCard] = useState<GiftCard | null>(null);

  const handleVerifyCode = async () => {
    if (!code || code.length < 10) {
      setError('Please enter a valid gift card code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await verifyGiftCard(code);

      if (!result.success || !result.giftCard) {
        setError(result.error || 'Invalid gift card code');
        setVerifiedCard(null);
        return;
      }

      setVerifiedCard(result.giftCard);
      setError('');
    } catch (err) {
      setError('Error verifying gift card');
      setVerifiedCard(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!verifiedCard) return;

    const amountToApply = Math.min(verifiedCard.current_balance, totalAmount);
    onApply(verifiedCard, amountToApply);
    setCode('');
    setVerifiedCard(null);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!verifiedCard) {
        handleVerifyCode();
      } else {
        handleApply();
      }
    }
  };

  // If a gift card is already applied, show the applied state
  if (appliedGiftCard) {
    return (
      <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-green-800 text-lg">Gift Card Applied!</h3>
              <p className="text-sm text-green-700">Code: {appliedGiftCard.code}</p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="text-green-700 hover:text-green-900 font-medium text-sm"
          >
            Remove
          </button>
        </div>

        <div className="bg-white rounded-xl p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-semibold">Credit Applied:</span>
            <span className="text-3xl font-bold text-green-600">
              -${appliedGiftCard.amount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-brand-gold rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-brand-navy" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-brand-navy text-lg">Have a Gift Card?</h3>
          <p className="text-sm text-gray-600">Enter your code to apply credit</p>
        </div>
      </div>

      {!verifiedCard ? (
        <div>
          <div className="flex gap-3 mb-3">
            <input
              type="text"
              placeholder="Enter code (e.g., CLEAN-XXXX-XXXX)"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              onKeyPress={handleKeyPress}
              className="input flex-1 font-mono font-semibold"
              maxLength={17}
            />
            <button
              onClick={handleVerifyCode}
              disabled={!code || loading}
              className="btn-primary px-6 disabled:opacity-50"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Verify'
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 rounded-xl p-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-3">
            💡 Don't have a gift card? <a href="/gift-cards" className="text-blue-600 hover:underline font-semibold">Purchase one now</a> and get 15% bonus credit!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border-2 border-green-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-green-800">Valid Gift Card!</p>
                <p className="text-sm text-gray-600">Code: {verifiedCard.code}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Available Balance:</span>
                <span className="text-2xl font-bold text-brand-navy">
                  ${verifiedCard.current_balance.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-2"></div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Booking Total:</span>
                <span className="text-lg font-semibold text-gray-900">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-green-700">Credit to Apply:</span>
                <span className="text-2xl font-bold text-green-600">
                  -${Math.min(verifiedCard.current_balance, totalAmount).toFixed(2)}
                </span>
              </div>

              {verifiedCard.current_balance > totalAmount && (
                <p className="text-xs text-gray-600 bg-gray-50 rounded p-2">
                  ℹ️ Remaining balance of ${(verifiedCard.current_balance - totalAmount).toFixed(2)}
                  can be used for future bookings.
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setVerifiedCard(null);
                setCode('');
              }}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 btn-primary font-bold"
            >
              ✅ Apply Gift Card
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
