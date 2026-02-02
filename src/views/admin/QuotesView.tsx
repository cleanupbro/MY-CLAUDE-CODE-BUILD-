/**
 * Quotes View - Admin CRM
 * Simple interface to review and respond to quote requests
 * 
 * Created: February 2, 2026
 */

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

interface Quote {
  id: string;
  created_at: string;
  type: string;
  status: string;
  data: {
    fullName?: string;
    name?: string;
    contactName?: string;
    phone?: string;
    email?: string;
    suburb?: string;
    address?: string;
    bedrooms?: number;
    bathrooms?: number;
    serviceType?: string;
    estimatedPrice?: number;
    price?: number;
    priceEstimate?: number;
    preferredDate?: string;
    message?: string;
    notes?: string;
    [key: string]: any;
  };
}

export const QuotesView: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [filter, setFilter] = useState<'all' | 'Pending' | 'Approved' | 'Completed'>('Pending');

  useEffect(() => {
    loadQuotes();
  }, [filter]);

  const loadQuotes = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Failed to load quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    if (!supabase) return;

    try {
      await supabase
        .from('submissions')
        .update({ status })
        .eq('id', id);

      // Update local state
      setQuotes(quotes.map(q => q.id === id ? { ...q, status } : q));
      setSelectedQuote(null);

      // Show simple feedback
      alert(`Quote ${status.toLowerCase()}!`);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update. Please try again.');
    }
  };

  const getName = (q: Quote): string => {
    return q.data.fullName || q.data.name || q.data.contactName || 'Unknown';
  };

  const getPrice = (q: Quote): string => {
    const price = q.data.estimatedPrice || q.data.price || q.data.priceEstimate;
    return price ? `$${price}` : 'Quote needed';
  };

  const getLocation = (q: Quote): string => {
    return q.data.suburb || q.data.address || 'No location';
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  };

  const getTypeEmoji = (type: string): string => {
    const emojis: Record<string, string> = {
      'Residential': '🏠',
      'Commercial': '🏢',
      'Airbnb': '🏨',
      'Jobs': '👷',
      'EndOfLease': '🔑',
      'Landing Lead': '🎯',
    };
    return emojis[type] || '📝';
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'Pending': 'bg-yellow-100 text-yellow-700',
      'Approved': 'bg-green-100 text-green-700',
      'Completed': 'bg-blue-100 text-blue-700',
      'Cancelled': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
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
        <h1 className="text-2xl font-bold text-gray-800">📝 Quotes</h1>
        <button
          onClick={loadQuotes}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title="Refresh"
        >
          🔄
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['Pending', 'Approved', 'Completed', 'all'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filter === f
                ? 'bg-teal-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f === 'all' ? 'All' : f}
            {f === 'Pending' && quotes.filter(q => q.status === 'Pending').length > 0 && (
              <span className="ml-1.5 bg-white/20 px-1.5 rounded-full">
                {filter === 'Pending' ? quotes.length : ''}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Quote List */}
      {quotes.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
          <span className="text-5xl">
            {filter === 'Pending' ? '🎉' : '📭'}
          </span>
          <p className="text-gray-500 mt-3 text-lg">
            {filter === 'Pending' 
              ? 'No pending quotes! All caught up.' 
              : `No ${filter === 'all' ? '' : filter.toLowerCase()} quotes found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((quote) => (
            <button
              key={quote.id}
              onClick={() => setSelectedQuote(quote)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {getTypeEmoji(quote.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-800 truncate">{getName(quote)}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">
                    {quote.type} • {getLocation(quote)}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-teal-600 font-medium">{getPrice(quote)}</span>
                    <span className="text-gray-400">{formatDate(quote.created_at)}</span>
                  </div>
                </div>
                <span className="text-gray-300 text-2xl">›</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Quote Detail Modal */}
      {selectedQuote && (
        <QuoteDetailModal
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onUpdateStatus={updateStatus}
        />
      )}
    </div>
  );
};

// Quote Detail Modal
const QuoteDetailModal: React.FC<{
  quote: Quote;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
}> = ({ quote, onClose, onUpdateStatus }) => {
  const data = quote.data;

  const getName = (): string => {
    return data.fullName || data.name || data.contactName || 'Unknown';
  };

  const getPrice = (): string => {
    const price = data.estimatedPrice || data.price || data.priceEstimate;
    return price ? `$${price}` : 'Quote needed';
  };

  const callCustomer = () => {
    if (data.phone) {
      window.location.href = `tel:${data.phone}`;
    }
  };

  const emailCustomer = () => {
    if (data.email) {
      window.location.href = `mailto:${data.email}`;
    }
  };

  const whatsappCustomer = () => {
    if (data.phone) {
      const phone = data.phone.replace(/\D/g, '');
      const formattedPhone = phone.startsWith('0') ? `61${phone.slice(1)}` : phone;
      window.open(`https://wa.me/${formattedPhone}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Quote Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-lg text-gray-800">{getName()}</h3>
            <p className="text-gray-500">{quote.type}</p>

            {/* Contact Buttons */}
            <div className="flex gap-2 mt-3">
              {data.phone && (
                <>
                  <button
                    onClick={callCustomer}
                    className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition flex items-center justify-center gap-2"
                  >
                    📞 Call
                  </button>
                  <button
                    onClick={whatsappCustomer}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    💬 WhatsApp
                  </button>
                </>
              )}
              {data.email && (
                <button
                  onClick={emailCustomer}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                  📧 Email
                </button>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <DetailRow label="📱 Phone" value={data.phone} />
            <DetailRow label="📧 Email" value={data.email} />
            <DetailRow label="📍 Location" value={data.suburb || data.address} />
            <DetailRow label="🧹 Service" value={data.serviceType || quote.type} />
            {data.bedrooms && <DetailRow label="🛏️ Bedrooms" value={data.bedrooms} />}
            {data.bathrooms && <DetailRow label="🚿 Bathrooms" value={data.bathrooms} />}
            <DetailRow label="📅 Preferred Date" value={data.preferredDate} />
            <DetailRow label="💰 Est. Price" value={getPrice()} highlight />
            {(data.message || data.notes) && (
              <DetailRow label="📝 Notes" value={data.message || data.notes} />
            )}
            <DetailRow label="🔗 Reference" value={quote.id} small />
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          {quote.status === 'Pending' ? (
            <div className="flex gap-3">
              <button
                onClick={() => onUpdateStatus(quote.id, 'Cancelled')}
                className="flex-1 py-3 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition"
              >
                ❌ Reject
              </button>
              <button
                onClick={() => onUpdateStatus(quote.id, 'Approved')}
                className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition"
              >
                ✅ Approve
              </button>
            </div>
          ) : quote.status === 'Approved' ? (
            <button
              onClick={() => onUpdateStatus(quote.id, 'Completed')}
              className="w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition"
            >
              ✅ Mark as Completed
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{
  label: string;
  value?: string | number;
  highlight?: boolean;
  small?: boolean;
}> = ({ label, value, highlight, small }) => {
  if (!value) return null;

  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-100">
      <span className="text-gray-500">{label}</span>
      <span className={`text-right ${
        highlight ? 'text-teal-600 font-bold text-lg' : 
        small ? 'text-gray-400 text-xs font-mono' : 'text-gray-800 font-medium'
      }`}>
        {value}
      </span>
    </div>
  );
};

export default QuotesView;
