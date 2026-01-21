/**
 * Analytics View Component
 * Business analytics and performance metrics
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Submission } from '../../types';
import { Booking, Complaint, TeamMember } from '../../lib/supabaseClient';
import { getBookings } from '../../services/bookingService';
import { getComplaints, getComplaintStats } from '../../services/complaintService';
import { getTeamMembers } from '../../services/teamService';

interface AnalyticsProps {
  submissions: Submission[];
}

interface ServiceStats {
  name: string;
  count: number;
  revenue: number;
  color: string;
}

const SERVICE_COLORS: Record<string, string> = {
  'Residential Cleaning': '#0071e3',
  'Commercial Cleaning': '#30D158',
  'Airbnb Cleaning': '#AF52DE',
  'End-of-Lease': '#FF9500',
  'Deep Cleaning': '#5856D6',
};

export const AnalyticsView: React.FC<AnalyticsProps> = ({ submissions }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [bookingsData, complaintsData, teamData] = await Promise.all([
      getBookings(),
      getComplaints(),
      getTeamMembers(),
    ]);
    setBookings(bookingsData);
    setComplaints(complaintsData);
    setTeamMembers(teamData);
    setLoading(false);
  };

  // Filter submissions by time range
  const filteredSubmissions = useMemo(() => {
    const now = new Date();
    let cutoff = new Date(0);

    switch (timeRange) {
      case '7d':
        cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'all':
      default:
        cutoff = new Date(0);
    }

    return submissions.filter((s) => new Date(s.timestamp) >= cutoff);
  }, [submissions, timeRange]);

  // Revenue stats
  const revenueStats = useMemo(() => {
    const total = filteredSubmissions.reduce((sum, s) => {
      return sum + (s.data?.priceEstimate || 0);
    }, 0);

    const confirmed = filteredSubmissions
      .filter((s) => s.status === 'Confirmed' || s.status === 'Completed')
      .reduce((sum, s) => sum + (s.data?.priceEstimate || 0), 0);

    const avgTicket = filteredSubmissions.length > 0 ? total / filteredSubmissions.length : 0;

    return { total, confirmed, avgTicket };
  }, [filteredSubmissions]);

  // Service breakdown
  const serviceStats = useMemo((): ServiceStats[] => {
    const byService: Record<string, { count: number; revenue: number }> = {};

    filteredSubmissions.forEach((s) => {
      const service = s.type || 'Other';
      if (!byService[service]) {
        byService[service] = { count: 0, revenue: 0 };
      }
      byService[service].count++;
      byService[service].revenue += s.data?.priceEstimate || 0;
    });

    return Object.entries(byService)
      .map(([name, data]) => ({
        name,
        count: data.count,
        revenue: data.revenue,
        color: SERVICE_COLORS[name] || '#6B7280',
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredSubmissions]);

  // Conversion funnel
  const funnelStats = useMemo(() => {
    const total = filteredSubmissions.length;
    const pending = filteredSubmissions.filter((s) => s.status === 'Pending').length;
    const contacted = filteredSubmissions.filter((s) => s.status === 'Contacted').length;
    const confirmed = filteredSubmissions.filter((s) => s.status === 'Confirmed').length;
    const completed = filteredSubmissions.filter((s) => s.status === 'Completed').length;

    return {
      total,
      pending,
      contacted,
      confirmed,
      completed,
      conversionRate: total > 0 ? ((confirmed + completed) / total * 100).toFixed(1) : '0',
    };
  }, [filteredSubmissions]);

  // Lead score distribution
  const leadScoreStats = useMemo(() => {
    const withScore = filteredSubmissions.filter((s) => s.leadScore !== undefined);
    const hot = withScore.filter((s) => (s.leadScore || 0) >= 80).length;
    const warm = withScore.filter((s) => (s.leadScore || 0) >= 50 && (s.leadScore || 0) < 80).length;
    const cold = withScore.filter((s) => (s.leadScore || 0) < 50).length;

    return { hot, warm, cold, total: withScore.length };
  }, [filteredSubmissions]);

  // Team performance (mock data since we don't have full booking history)
  const teamStats = useMemo(() => {
    const completed = bookings.filter((b) => b.status === 'completed');
    const teamPerformance: Record<string, { jobs: number; revenue: number }> = {};

    completed.forEach((b) => {
      if (b.assigned_to) {
        if (!teamPerformance[b.assigned_to]) {
          teamPerformance[b.assigned_to] = { jobs: 0, revenue: 0 };
        }
        teamPerformance[b.assigned_to].jobs++;
        teamPerformance[b.assigned_to].revenue += b.final_price || b.quoted_price || 0;
      }
    });

    return teamMembers
      .filter((m) => m.role === 'cleaner')
      .map((m) => ({
        id: m.id,
        name: m.full_name,
        jobs: teamPerformance[m.id]?.jobs || 0,
        revenue: teamPerformance[m.id]?.revenue || 0,
      }))
      .sort((a, b) => b.jobs - a.jobs);
  }, [bookings, teamMembers]);

  // Complaint stats
  const complaintStats = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter((c) => c.status === 'open' || c.status === 'investigating').length;
    const resolved = complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length;
    const byType: Record<string, number> = {};
    complaints.forEach((c) => {
      byType[c.type] = (byType[c.type] || 0) + 1;
    });

    return { total, open, resolved, byType };
  }, [complaints]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0071e3]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#1D1D1F]">Business Analytics</h2>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-[#0071e3] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === 'all' ? 'All Time' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#0071e3] to-[#0066CC] rounded-2xl p-6 text-white">
          <p className="text-sm opacity-80 uppercase tracking-wide">Total Quote Value</p>
          <p className="text-3xl font-bold mt-1">${revenueStats.total.toLocaleString()}</p>
          <p className="text-sm opacity-70 mt-2">{filteredSubmissions.length} quotes</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-80 uppercase tracking-wide">Confirmed Revenue</p>
          <p className="text-3xl font-bold mt-1">${revenueStats.confirmed.toLocaleString()}</p>
          <p className="text-sm opacity-70 mt-2">{funnelStats.confirmed + funnelStats.completed} jobs</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-80 uppercase tracking-wide">Conversion Rate</p>
          <p className="text-3xl font-bold mt-1">{funnelStats.conversionRate}%</p>
          <p className="text-sm opacity-70 mt-2">quote to booking</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-80 uppercase tracking-wide">Avg Ticket</p>
          <p className="text-3xl font-bold mt-1">${Math.round(revenueStats.avgTicket)}</p>
          <p className="text-sm opacity-70 mt-2">per quote</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1D1D1F] mb-4">Service Breakdown</h3>
          <div className="space-y-4">
            {serviceStats.map((service) => {
              const percentage = filteredSubmissions.length > 0
                ? (service.count / filteredSubmissions.length * 100).toFixed(0)
                : 0;
              return (
                <div key={service.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-[#1D1D1F]">{service.name}</span>
                    <span className="text-sm text-gray-500">
                      {service.count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: service.color,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">${service.revenue.toLocaleString()}</p>
                </div>
              );
            })}
            {serviceStats.length === 0 && (
              <p className="text-center text-gray-400 py-4">No data for this period</p>
            )}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1D1D1F] mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {[
              { label: 'Quotes Received', value: funnelStats.total, color: 'bg-blue-500' },
              { label: 'Pending Review', value: funnelStats.pending, color: 'bg-yellow-500' },
              { label: 'Contacted', value: funnelStats.contacted, color: 'bg-orange-500' },
              { label: 'Confirmed', value: funnelStats.confirmed, color: 'bg-green-500' },
              { label: 'Completed', value: funnelStats.completed, color: 'bg-emerald-600' },
            ].map((stage) => {
              const width = funnelStats.total > 0 ? (stage.value / funnelStats.total * 100) : 0;
              return (
                <div key={stage.label} className="flex items-center gap-3">
                  <div className="w-24 text-sm text-gray-600">{stage.label}</div>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full ${stage.color} transition-all`}
                      style={{ width: `${width}%` }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium text-[#1D1D1F]">
                      {stage.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Score Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1D1D1F] mb-4">Lead Quality</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <p className="text-3xl font-bold text-red-600">{leadScoreStats.hot}</p>
              <p className="text-sm text-red-600 mt-1">Hot Leads</p>
              <p className="text-xs text-gray-400">Score 80+</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <p className="text-3xl font-bold text-yellow-600">{leadScoreStats.warm}</p>
              <p className="text-sm text-yellow-600 mt-1">Warm Leads</p>
              <p className="text-xs text-gray-400">Score 50-79</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">{leadScoreStats.cold}</p>
              <p className="text-sm text-blue-600 mt-1">Cold Leads</p>
              <p className="text-xs text-gray-400">Score &lt;50</p>
            </div>
          </div>
          {leadScoreStats.total === 0 && (
            <p className="text-center text-gray-400 text-sm mt-4">
              AI scoring not yet run on these leads
            </p>
          )}
        </div>

        {/* Team Performance */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1D1D1F] mb-4">Team Performance</h3>
          <div className="space-y-3">
            {teamStats.slice(0, 5).map((member, index) => (
              <div key={member.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#1D1D1F]">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.jobs} jobs completed</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#0071e3]">${member.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
            {teamStats.length === 0 && (
              <p className="text-center text-gray-400 py-4">No team data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Complaints Summary */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-[#1D1D1F] mb-4">Customer Satisfaction</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-3xl font-bold text-[#1D1D1F]">{complaintStats.total}</p>
            <p className="text-sm text-gray-500 mt-1">Total Complaints</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-xl">
            <p className="text-3xl font-bold text-red-600">{complaintStats.open}</p>
            <p className="text-sm text-red-600 mt-1">Open</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <p className="text-3xl font-bold text-green-600">{complaintStats.resolved}</p>
            <p className="text-sm text-green-600 mt-1">Resolved</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <p className="text-3xl font-bold text-[#0071e3]">
              {complaintStats.total > 0
                ? ((complaintStats.resolved / complaintStats.total) * 100).toFixed(0)
                : 100}%
            </p>
            <p className="text-sm text-[#0071e3] mt-1">Resolution Rate</p>
          </div>
        </div>
        {Object.keys(complaintStats.byType).length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-2">By Type:</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(complaintStats.byType).map(([type, count]) => (
                <span key={type} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  {type}: {count}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsView;
