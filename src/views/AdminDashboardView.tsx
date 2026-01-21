import React, { useState, useEffect, useMemo } from 'react';
import { getSubmissions, updateSubmissionStatus } from '../services/submissionService';
import { Submission, SubmissionStatus, SubmissionType, ServiceType, ViewType, PipelineStage } from '../types';
import { SubmissionCard } from '../components/SubmissionCard';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { PipelineBoard } from '../components/admin/PipelineBoard';
import { CalendarView } from '../components/admin/CalendarView';
import { InvoiceGenerator } from '../components/admin/InvoiceGenerator';
import { CustomerHistory } from '../components/admin/CustomerHistory';
import { EmailTemplates } from '../components/admin/EmailTemplates';
import { TeamManagement } from '../components/admin/TeamManagement';
import { RosterView } from '../components/admin/RosterView';
import { ComplaintsView } from '../components/admin/ComplaintsView';
import { AnalyticsView } from '../components/admin/AnalyticsView';

interface AdminDashboardViewProps {
  onLogout: () => void;
  adminEmail: string;
  navigateTo: (view: ViewType) => void;
}

const FILTERS: { label: string; type: SubmissionType | 'All'; icon: string }[] = [
  { label: 'All', type: 'All', icon: '📊' },
  { label: 'Landing Leads', type: 'Landing Lead', icon: '🎯' },
  { label: 'Residential', type: ServiceType.Residential, icon: '🏠' },
  { label: 'Commercial', type: ServiceType.Commercial, icon: '🏢' },
  { label: 'Airbnb', type: ServiceType.Airbnb, icon: '🏨' },
  { label: 'Job Apps', type: ServiceType.Jobs, icon: '💼' },
];

type TabType = 'overview' | 'submissions' | 'pipeline' | 'calendar' | 'invoices' | 'customers' | 'templates' | 'team' | 'roster' | 'complaints' | 'analytics';

const TABS: { id: TabType; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'pipeline', label: 'Pipeline', icon: '🎯' },
  { id: 'submissions', label: 'Submissions', icon: '📋' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'customers', label: 'Customers', icon: '👥' },
  { id: 'invoices', label: 'Invoices', icon: '🧾' },
  { id: 'team', label: 'Team', icon: '👷' },
  { id: 'roster', label: 'Roster', icon: '📆' },
  { id: 'complaints', label: 'Complaints', icon: '⚠️' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'templates', label: 'Templates', icon: '📧' },
];

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onLogout, adminEmail, navigateTo }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activeFilter, setActiveFilter] = useState<SubmissionType | 'All'>('All');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadSubmissions = async () => {
      const data = await getSubmissions();
      setSubmissions(data);
    };
    loadSubmissions();

    if (isSupabaseConfigured() && supabase) {
      const channel = supabase
        .channel('submissions-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'submissions'
        }, async () => {
          const updatedData = await getSubmissions();
          setSubmissions(updatedData);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleStatusChange = async (id: string, status: SubmissionStatus) => {
    const updatedSubmissions = await updateSubmissionStatus(id, status);
    setSubmissions(updatedSubmissions);
  };

  const handleSubmissionsUpdate = (updatedSubmissions: Submission[]) => {
    setSubmissions(updatedSubmissions);
  };

  const handlePipelineStageUpdate = (submissionId: string, newStage: PipelineStage) => {
    setSubmissions(prev => prev.map(s =>
      s.id === submissionId
        ? { ...s, pipelineStage: newStage, pipelineUpdatedAt: new Date().toISOString() }
        : s
    ));
  };

  const handleViewSubmission = (submission: Submission) => {
    setActiveTab('submissions');
    setSearchQuery(submission.id);
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter(s => s.status === SubmissionStatus.Pending).length;
    const confirmed = submissions.filter(s => s.status === SubmissionStatus.Confirmed).length;
    const revenue = submissions
      .filter(s => s.status === SubmissionStatus.Confirmed)
      .reduce((sum, s) => sum + ((s.data as Record<string, unknown>).priceEstimate as number || 0), 0);
    const scoresWithValues = submissions.filter(s => s.leadScore);
    const avgLeadScore = scoresWithValues.length > 0
      ? (scoresWithValues.reduce((sum, s) => sum + (s.leadScore || 0), 0) / scoresWithValues.length).toFixed(1)
      : '0';
    const conversionRate = total > 0 ? ((confirmed / total) * 100).toFixed(1) : '0';

    return { total, pending, confirmed, revenue, avgLeadScore, conversionRate };
  }, [submissions]);

  // Submissions by type for chart
  const submissionsByType = useMemo(() => {
    return FILTERS.filter(f => f.type !== 'All').map(filter => ({
      label: filter.label,
      value: submissions.filter(s => s.type === filter.type).length,
      color: filter.type === ServiceType.Residential ? '#3B82F6'
        : filter.type === ServiceType.Commercial ? '#10B981'
        : filter.type === ServiceType.Airbnb ? '#8B5CF6'
        : filter.type === ServiceType.Jobs ? '#F59E0B'
        : '#6B7280'
    }));
  }, [submissions]);

  const filteredSubmissions = useMemo(() => {
    let filtered = activeFilter === 'All'
      ? submissions
      : submissions.filter(s => s.type === activeFilter);

    if (searchQuery) {
      filtered = filtered.filter(s => {
        const data = s.data as Record<string, unknown>;
        const searchLower = searchQuery.toLowerCase();
        return (
          s.id.toLowerCase().includes(searchLower) ||
          (data.fullName && String(data.fullName).toLowerCase().includes(searchLower)) ||
          (data.email && String(data.email).toLowerCase().includes(searchLower)) ||
          (data.phone && String(data.phone).toLowerCase().includes(searchLower)) ||
          (data.suburb && String(data.suburb).toLowerCase().includes(searchLower))
        );
      });
    }

    return filtered;
  }, [submissions, activeFilter, searchQuery]);

  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) {
      alert('No submissions to export in the current filter.');
      return;
    }

    const headers = [
      'ID', 'Timestamp', 'Type', 'Status', 'AI Summary', 'Lead Score', 'Price Estimate',
      'Full Name', 'Email', 'Phone', 'Suburb', 'Property Type', 'Bedrooms', 'Bathrooms',
      'Service Type', 'Frequency', 'Notes'
    ];

    const sanitizeCSVField = (field: unknown): string => {
      if (field === null || field === undefined) return '';
      if (Array.isArray(field)) return field.join('; ');
      if (typeof field === 'boolean') return field ? 'Yes' : 'No';
      let str = String(field);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        str = `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvRows = [headers.join(',')];

    filteredSubmissions.forEach(submission => {
      const data = submission.data as Record<string, unknown>;
      const row = [
        submission.id,
        new Date(submission.timestamp).toISOString(),
        submission.type,
        submission.status,
        submission.summary,
        submission.leadScore,
        data.priceEstimate,
        data.fullName || data.contactPerson || data.contactName,
        data.email,
        data.phone,
        data.suburb,
        data.propertyType,
        data.bedrooms,
        data.bathrooms,
        data.serviceType,
        data.frequency,
        data.notes
      ];
      csvRows.push(row.map(sanitizeCSVField).join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);

    const date = new Date().toISOString().split('T')[0];
    const filename = `clean_up_bros_submissions_${activeFilter.toString().replace(/\s+/g, '_').toLowerCase()}_${date}.csv`;
    link.setAttribute('download', filename);

    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-24">
      {/* Admin Header - Clean, No Glassmorphism */}
      {/* pt-20 above accounts for the fixed main navigation header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          {/* Title Row */}
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1D1D1F]">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back, {adminEmail?.split('@')[0]}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo('AdminGiftCards')}
                className="px-4 py-2.5 bg-[#0071e3] text-white rounded-lg hover:bg-[#0077ED] transition-colors text-sm font-medium"
              >
                🎁 Gift Cards
              </button>
              <button
                onClick={() => navigateTo('AdminContracts')}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                📋 Contracts
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                disabled={filteredSubmissions.length === 0}
              >
                📥 Export
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 overflow-x-auto -mb-px">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#0071e3] text-[#0071e3]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.id === 'submissions' ? `${tab.label} (${submissions.length})` : tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Submissions</p>
                <p className="text-3xl font-bold text-[#1D1D1F] mt-2">{metrics.total}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Quotes</p>
                <p className="text-3xl font-bold text-orange-500 mt-2">{metrics.pending}</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Confirmed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{metrics.confirmed}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">+12% vs last month</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Est. Revenue</p>
                <p className="text-3xl font-bold text-[#1D1D1F] mt-2">${metrics.revenue.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">+8% vs last month</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Lead Score</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{metrics.avgLeadScore}/10</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Submissions by Type */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-6">Submissions by Type</h3>
                <div className="space-y-4">
                  {submissionsByType.map((item, idx) => {
                    const maxValue = Math.max(...submissionsByType.map(d => d.value), 1);
                    return (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">{item.label}</span>
                          <span className="font-bold text-gray-900">{item.value}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(item.value / maxValue) * 100}%`,
                              backgroundColor: item.color
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-[#1D1D1F] mb-6">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-100">
                    <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
                    <span className="text-2xl font-bold text-green-600">{metrics.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-sm font-medium text-gray-700">Response Time</span>
                    <span className="text-2xl font-bold text-blue-600">&lt;2h</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <span className="text-sm font-medium text-gray-700">Customer Satisfaction</span>
                    <span className="text-2xl font-bold text-purple-600">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#1D1D1F]">Recent Submissions</h3>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className="text-[#0071e3] hover:underline font-medium text-sm"
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {submissions.slice(0, 5).map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {sub.type === ServiceType.Residential ? '🏠'
                          : sub.type === ServiceType.Commercial ? '🏢'
                          : sub.type === ServiceType.Airbnb ? '🏨'
                          : sub.type === ServiceType.Jobs ? '💼'
                          : '🎯'}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1D1D1F]">
                          {(sub.data as Record<string, unknown>).fullName as string ||
                           (sub.data as Record<string, unknown>).contactName as string ||
                           'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-500">{sub.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {sub.leadScore && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                          ⭐ {sub.leadScore}/10
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        sub.status === SubmissionStatus.Confirmed ? 'bg-green-100 text-green-800'
                          : sub.status === SubmissionStatus.Pending ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  </div>
                ))}
                {submissions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No submissions yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="🔍 Search by name, email, phone, or suburb..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent text-[#1D1D1F]"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {FILTERS.map(filter => (
                    <button
                      key={filter.label}
                      onClick={() => setActiveFilter(filter.type)}
                      className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        activeFilter === filter.type
                          ? 'bg-[#0071e3] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.icon} {filter.label}
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                        activeFilter === filter.type ? 'bg-white/20' : 'bg-gray-200'
                      }`}>
                        {filter.type === 'All' ? submissions.length : submissions.filter(s => s.type === filter.type).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map(sub => (
                  <SubmissionCard
                    key={sub.id}
                    submission={sub}
                    onStatusChange={handleStatusChange}
                    onSubmissionsUpdate={handleSubmissionsUpdate}
                  />
                ))
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-200">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-bold text-[#1D1D1F] mb-2">No Submissions Found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? 'Try a different search term' : 'No submissions in this category yet'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <PipelineBoard
            submissions={submissions}
            onUpdateStage={handlePipelineStageUpdate}
            onViewSubmission={handleViewSubmission}
          />
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <CalendarView
            submissions={submissions}
            onViewSubmission={handleViewSubmission}
          />
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <CustomerHistory
            submissions={submissions}
            onViewSubmission={handleViewSubmission}
          />
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && <InvoiceGenerator submissions={submissions} />}

        {/* Templates Tab */}
        {activeTab === 'templates' && <EmailTemplates submissions={submissions} />}

        {/* Team Tab */}
        {activeTab === 'team' && <TeamManagement />}

        {/* Roster Tab */}
        {activeTab === 'roster' && <RosterView />}

        {/* Complaints Tab */}
        {activeTab === 'complaints' && <ComplaintsView />}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && <AnalyticsView submissions={submissions} />}
      </div>
    </div>
  );
};

export default AdminDashboardView;
