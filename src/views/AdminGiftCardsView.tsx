import React, { useState, useEffect } from 'react';
import {
  getAllGiftCards,
  getGiftCardStats,
  GiftCard,
} from '../services/giftCardService';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
  }[color];

  return (
    <div className={`bg-gradient-to-br ${colorClasses} text-white rounded-2xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-4xl">{icon}</span>
        <div className="text-right">
          <div className="text-3xl font-bold">{value}</div>
        </div>
      </div>
      <div className="text-sm font-medium opacity-90">{title}</div>
    </div>
  );
};

interface GiftCardRowProps {
  giftCard: GiftCard;
  onViewDetails: (giftCard: GiftCard) => void;
}

const GiftCardRow: React.FC<GiftCardRowProps> = ({ giftCard, onViewDetails }) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    redeemed: 'bg-gray-100 text-gray-800',
    expired: 'bg-red-100 text-red-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const typeLabels = {
    digital: '📧 Digital',
    physical: '💳 Physical',
    prepaid: '💰 Prepaid',
  };

  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="font-mono font-bold text-brand-navy">{giftCard.code}</div>
        <div className="text-xs text-gray-500">
          {new Date(giftCard.created_at).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-medium">{typeLabels[giftCard.type]}</span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <div className="font-semibold">{giftCard.purchaser_name}</div>
          <div className="text-gray-500 text-xs">{giftCard.purchaser_email}</div>
        </div>
      </td>
      <td className="px-6 py-4">
        {giftCard.recipient_name ? (
          <div className="text-sm">
            <div className="font-semibold">{giftCard.recipient_name}</div>
            <div className="text-gray-500 text-xs">{giftCard.recipient_email}</div>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="font-semibold text-gray-700">
          ${(giftCard.original_amount + giftCard.bonus_amount).toFixed(2)}
        </div>
        <div className="text-xs text-gray-500">
          +${giftCard.bonus_amount.toFixed(2)} bonus
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="text-xl font-bold text-brand-navy">
          ${giftCard.current_balance.toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[giftCard.status]}`}>
          {giftCard.status.toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={() => onViewDetails(giftCard)}
          className="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline"
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

interface GiftCardDetailsModalProps {
  giftCard: GiftCard;
  isOpen: boolean;
  onClose: () => void;
}

const GiftCardDetailsModal: React.FC<GiftCardDetailsModalProps> = ({
  giftCard,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const usagePercentage = giftCard.original_amount > 0
    ? ((giftCard.original_amount + giftCard.bonus_amount - giftCard.current_balance) / (giftCard.original_amount + giftCard.bonus_amount)) * 100
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
        <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"></div>

        <div
          className="glass-modal inline-block align-bottom rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">Gift Card Details</h3>
                <p className="text-white/60 text-sm mt-1 font-mono">{giftCard.code}</p>
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

          {/* Content */}
          <div className="px-8 py-6 space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-brand-navy to-blue-900 rounded-2xl p-6 text-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm opacity-80">Current Balance</span>
                <span className="text-sm opacity-80">
                  {usagePercentage.toFixed(0)}% Used
                </span>
              </div>
              <div className="text-4xl font-bold mb-2">
                ${giftCard.current_balance.toFixed(2)}
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-brand-gold rounded-full h-2 transition-all duration-500"
                  style={{ width: `${100 - usagePercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                <div className="text-white/60 text-sm mb-1">Original Amount</div>
                <div className="text-white text-xl font-bold">
                  ${giftCard.original_amount.toFixed(2)}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
                <div className="text-white/60 text-sm mb-1">Bonus Credit</div>
                <div className="text-brand-gold text-xl font-bold">
                  +${giftCard.bonus_amount.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Purchase Info */}
            <div className="bg-white/5 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-white mb-3">Purchase Information</h4>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Purchaser:</span>
                <span className="text-white font-medium">{giftCard.purchaser_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Email:</span>
                <span className="text-white font-medium">{giftCard.purchaser_email}</span>
              </div>
              {giftCard.purchaser_phone && (
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Phone:</span>
                  <span className="text-white font-medium">{giftCard.purchaser_phone}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Purchase Date:</span>
                <span className="text-white font-medium">
                  {new Date(giftCard.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Type:</span>
                <span className="text-white font-medium capitalize">{giftCard.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Status:</span>
                <span className="text-white font-medium capitalize">{giftCard.status}</span>
              </div>
            </div>

            {/* Recipient Info (if gift) */}
            {giftCard.recipient_name && (
              <div className="bg-purple-500/20 border border-purple-500/50 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-white mb-3">🎁 Gift Recipient</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Name:</span>
                  <span className="text-white font-medium">{giftCard.recipient_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Email:</span>
                  <span className="text-white font-medium">{giftCard.recipient_email}</span>
                </div>
                {giftCard.gift_message && (
                  <div className="mt-3 pt-3 border-t border-purple-500/30">
                    <div className="text-white/60 text-xs mb-1">Gift Message:</div>
                    <div className="text-white text-sm italic">"{giftCard.gift_message}"</div>
                  </div>
                )}
              </div>
            )}

            {/* Redemption Info */}
            {giftCard.redeemed_by_email && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-white mb-3">✅ Redemption Info</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Redeemed By:</span>
                  <span className="text-white font-medium">{giftCard.redeemed_by_email}</span>
                </div>
                {giftCard.redeemed_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">First Redemption:</span>
                    <span className="text-white font-medium">
                      {new Date(giftCard.redeemed_at).toLocaleString()}
                    </span>
                  </div>
                )}
                {giftCard.fully_redeemed_at && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Fully Redeemed:</span>
                    <span className="text-white font-medium">
                      {new Date(giftCard.fully_redeemed_at).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-white/5 border-t border-white/10">
            <button
              onClick={onClose}
              className="w-full glass-button text-white py-3 font-semibold hover:scale-105 transition-transform"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminGiftCardsView: React.FC = () => {
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'redeemed' | 'pending'>('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSold: 0,
    totalActiveBalance: 0,
    activeCards: 0,
    redeemedCards: 0,
    pendingCards: 0,
  });
  const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    setLoading(true);
    const [cardsData, statsData] = await Promise.all([
      getAllGiftCards(filter),
      getGiftCardStats(),
    ]);
    setGiftCards(cardsData);
    setStats(statsData);
    setLoading(false);
  };

  const filteredCards = giftCards.filter(gc =>
    gc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gc.purchaser_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gc.purchaser_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gc.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gc.recipient_email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-brand-navy mb-2">Gift Card Management</h1>
          <p className="text-gray-600">Manage and track all gift cards</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sold"
            value={`$${stats.totalSold.toFixed(2)}`}
            icon="💰"
            color="green"
          />
          <StatCard
            title="Active Balance"
            value={`$${stats.totalActiveBalance.toFixed(2)}`}
            icon="💳"
            color="blue"
          />
          <StatCard
            title="Active Cards"
            value={stats.activeCards}
            icon="✅"
            color="yellow"
          />
          <StatCard
            title="Fully Redeemed"
            value={stats.redeemedCards}
            icon="🎉"
            color="purple"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'pending', 'active', 'redeemed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    filter === f
                      ? 'bg-brand-navy text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search codes, names, emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <svg className="animate-spin h-12 w-12 mx-auto text-brand-navy" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600 mt-4">Loading gift cards...</p>
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">🎁</div>
              <p className="text-xl font-semibold text-gray-700 mb-2">No gift cards found</p>
              <p className="text-gray-500">
                {searchQuery ? 'Try a different search term' : 'No gift cards match this filter'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Purchaser
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Original
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCards.map(gc => (
                    <GiftCardRow
                      key={gc.id}
                      giftCard={gc}
                      onViewDetails={setSelectedCard}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results Count */}
        {!loading && filteredCards.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-600">
            Showing {filteredCards.length} of {giftCards.length} gift cards
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedCard && (
        <GiftCardDetailsModal
          giftCard={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};

export default AdminGiftCardsView;
