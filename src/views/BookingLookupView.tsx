
import React, { useState } from 'react';
import { NavigationProps } from '../types';
import { supabase } from '../lib/supabaseClient';

interface BookingResult {
  referenceId: string;
  type: string;
  status: string;
  createdAt: string;
  customerName: string;
  email: string;
  phone: string;
  priceEstimate: number | null;
  suburb?: string;
  bedrooms?: number;
  bathrooms?: number;
  serviceType?: string;
  preferredDate?: string;
}

const BookingLookupView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const [referenceId, setReferenceId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!referenceId.trim()) {
      setError('Please enter a reference ID');
      return;
    }

    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      if (!supabase) {
        setError('Database connection unavailable. Please try again later.');
        setIsSearching(false);
        return;
      }

      // Search for submission by reference ID in the data column
      const { data, error: dbError } = await supabase
        .from('submissions')
        .select('*')
        .or(`data->>referenceId.eq.${referenceId.toUpperCase()},data->>referenceId.eq.${referenceId}`)
        .limit(1)
        .single();

      if (dbError || !data) {
        setError('No booking found with that reference ID. Please check and try again.');
        setIsSearching(false);
        return;
      }

      // Parse the submission data
      const submissionData = data.data;
      const booking: BookingResult = {
        referenceId: submissionData.referenceId || referenceId,
        type: data.type,
        status: data.status || 'pending',
        createdAt: data.created_at,
        customerName: submissionData.fullName || submissionData.contactName || submissionData.contactPerson || 'N/A',
        email: submissionData.email || 'N/A',
        phone: submissionData.phone || 'N/A',
        priceEstimate: submissionData.priceEstimate || null,
        suburb: submissionData.suburb,
        bedrooms: submissionData.bedrooms,
        bathrooms: submissionData.bathrooms,
        serviceType: submissionData.serviceType || submissionData.cleaningFrequency,
        preferredDate: submissionData.preferredDate || submissionData.preferredStartDate,
      };

      setResult(booking);
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
    }

    setIsSearching(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'in_progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'residential': return '🏠';
      case 'commercial': return '🏢';
      case 'airbnb': return '🏨';
      default: return '🧹';
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[35vh] bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(0,102,204,0.08),transparent_50%)]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center pt-28 pb-12 px-6">
          <div className="inline-flex items-center gap-2 bg-[#2997FF]/10 border border-[#2997FF]/30 rounded-full px-4 py-2 mb-6">
            <span className="text-[#2997FF] text-sm font-medium">📋 Track Your Booking</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">
            Booking <span className="text-[#2997FF]">Lookup</span>
          </h1>

          <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
            Enter your reference ID to check the status of your cleaning service booking.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-6">
        <div className="max-w-xl mx-auto">
          {/* Search Form */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Reference ID</label>
                <input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
                  placeholder="e.g. CUB-ABC123"
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-[#2997FF] focus:ring-1 focus:ring-[#2997FF] transition-colors uppercase"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <p className="text-xs text-white/40 mt-2">
                  Your reference ID was provided when you submitted your quote request.
                </p>
              </div>

              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full py-3 px-6 bg-[#2997FF] hover:bg-[#2997FF]/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    🔍 Search Booking
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Result Card */}
          {result && (
            <div className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getServiceIcon(result.type)}</span>
                  <div>
                    <h3 className="text-white font-semibold">{result.type.replace(' Cleaning', '')} Cleaning</h3>
                    <p className="text-white/60 text-sm">{result.referenceId}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(result.status)}`}>
                  {result.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Customer</p>
                    <p className="text-white font-medium">{result.customerName}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Submitted</p>
                    <p className="text-white font-medium">
                      {new Date(result.createdAt).toLocaleDateString('en-AU', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {result.priceEstimate && (
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Price Estimate</p>
                      <p className="text-[#30D158] font-semibold text-lg">${result.priceEstimate}</p>
                    </div>
                  )}
                  {result.preferredDate && (
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Preferred Date</p>
                      <p className="text-white font-medium">{result.preferredDate}</p>
                    </div>
                  )}
                  {result.suburb && (
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Location</p>
                      <p className="text-white font-medium">{result.suburb}</p>
                    </div>
                  )}
                  {result.bedrooms && (
                    <div>
                      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Property</p>
                      <p className="text-white font-medium">{result.bedrooms} bed, {result.bathrooms} bath</p>
                    </div>
                  )}
                </div>

                {/* Status Timeline */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${result.status === 'pending' ? 'bg-orange-500' : 'bg-green-500'}`} />
                    <p className="text-white/80 text-sm">
                      {result.status === 'pending'
                        ? 'Your quote request is being reviewed. We\'ll contact you within 24 hours.'
                        : result.status === 'confirmed'
                        ? 'Your booking has been confirmed! See you soon.'
                        : result.status === 'completed'
                        ? 'Service completed. Thank you for choosing Clean Up Bros!'
                        : 'Status: ' + result.status}
                    </p>
                  </div>
                </div>

                {/* Contact CTA */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-white/60 text-sm mb-3">Questions about your booking?</p>
                  <div className="flex gap-3">
                    <a
                      href="tel:+61406764585"
                      className="flex-1 py-2 px-4 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors text-center"
                    >
                      📞 Call Us
                    </a>
                    <a
                      href="https://wa.me/61406764585"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2 px-4 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-sm font-medium rounded-lg transition-colors text-center"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigateTo('Landing')}
              className="text-white/60 hover:text-white transition-colors text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookingLookupView;
