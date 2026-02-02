/**
 * Today View - Admin Dashboard
 * Shows what needs attention RIGHT NOW
 * 
 * Created: February 2, 2026
 */

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

interface TodayStats {
  newQuotes: number;
  todayJobs: number;
  pendingPayments: number;
  totalThisWeek: number;
}

interface QuickItem {
  id: string;
  type: 'quote' | 'job' | 'payment';
  title: string;
  subtitle: string;
  time: string;
  urgent?: boolean;
}

export const TodayView: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [stats, setStats] = useState<TodayStats>({
    newQuotes: 0,
    todayJobs: 0,
    pendingPayments: 0,
    totalThisWeek: 0,
  });
  const [quickItems, setQuickItems] = useState<QuickItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false);
      return;
    }

    try {
      // Get pending submissions (quotes)
      const { data: submissions } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'Pending')
        .order('created_at', { ascending: false });

      // Map submissions to quick items
      const items: QuickItem[] = (submissions || []).slice(0, 5).map((sub: any) => ({
        id: sub.id,
        type: 'quote' as const,
        title: sub.data?.fullName || sub.data?.name || sub.data?.contactName || 'New Lead',
        subtitle: `${sub.type} - ${sub.data?.suburb || sub.data?.address || 'No location'}`,
        time: formatTimeAgo(new Date(sub.created_at)),
        urgent: isUrgent(new Date(sub.created_at)),
      }));

      setStats({
        newQuotes: submissions?.length || 0,
        todayJobs: 0, // Will come from bookings table
        pendingPayments: 0, // Will come from invoices table
        totalThisWeek: 0, // Calculate from completed jobs
      });

      setQuickItems(items);
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const isUrgent = (date: Date): boolean => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    return diff < 3600000; // Less than 1 hour old
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">
          {getGreeting()} 👋
        </h1>
        <p className="text-teal-100 mt-1">
          Here's what needs your attention today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          emoji="📝"
          label="New Quotes"
          value={stats.newQuotes}
          color="blue"
          onClick={() => onNavigate('quotes')}
        />
        <StatCard
          emoji="📅"
          label="Today's Jobs"
          value={stats.todayJobs}
          color="green"
          onClick={() => onNavigate('jobs')}
        />
        <StatCard
          emoji="⏳"
          label="Unpaid"
          value={stats.pendingPayments}
          color="orange"
          onClick={() => onNavigate('money')}
        />
        <StatCard
          emoji="💰"
          label="This Week"
          value={`$${stats.totalThisWeek}`}
          color="teal"
          onClick={() => onNavigate('money')}
        />
      </div>

      {/* Action Required */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
            🔔 Action Required
            {quickItems.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {quickItems.length}
              </span>
            )}
          </h2>
        </div>

        {quickItems.length === 0 ? (
          <div className="p-8 text-center">
            <span className="text-5xl">✅</span>
            <p className="text-gray-500 mt-3 text-lg">All caught up! Nothing needs attention.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {quickItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate('quotes')}
                className="w-full p-4 hover:bg-gray-50 transition text-left flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  item.urgent ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {item.type === 'quote' ? '📝' : item.type === 'job' ? '📅' : '💰'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{item.title}</p>
                  <p className="text-sm text-gray-500 truncate">{item.subtitle}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${item.urgent ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                    {item.time}
                  </p>
                  {item.urgent && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                      HOT
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <h2 className="font-bold text-lg text-gray-800 mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction
            emoji="📝"
            label="View Quotes"
            onClick={() => onNavigate('quotes')}
          />
          <QuickAction
            emoji="📅"
            label="Schedule Job"
            onClick={() => onNavigate('jobs')}
          />
          <QuickAction
            emoji="👥"
            label="Find Customer"
            onClick={() => onNavigate('customers')}
          />
          <QuickAction
            emoji="💰"
            label="Create Invoice"
            onClick={() => onNavigate('money')}
          />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard: React.FC<{
  emoji: string;
  label: string;
  value: number | string;
  color: string;
  onClick: () => void;
}> = ({ emoji, label, value, color, onClick }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    orange: 'bg-orange-50 border-orange-200',
    teal: 'bg-teal-50 border-teal-200',
  };

  return (
    <button
      onClick={onClick}
      className={`${colorClasses[color]} border rounded-2xl p-4 text-left hover:shadow-md transition`}
    >
      <span className="text-3xl">{emoji}</span>
      <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </button>
  );
};

const QuickAction: React.FC<{
  emoji: string;
  label: string;
  onClick: () => void;
}> = ({ emoji, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
  >
    <span className="text-2xl">{emoji}</span>
    <span className="font-medium text-gray-700">{label}</span>
  </button>
);

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export default TodayView;
