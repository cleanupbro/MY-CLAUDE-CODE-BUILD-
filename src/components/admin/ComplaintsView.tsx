/**
 * Complaints View Component
 * Manage customer complaints and issues
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Complaint } from '../../lib/supabaseClient';
import {
  getComplaints,
  createComplaint,
  updateComplaint,
  assignComplaint,
  resolveComplaint,
  closeComplaint,
  getComplaintStats,
} from '../../services/complaintService';

const TYPE_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  quality: { bg: 'bg-orange-100', text: 'text-orange-700', icon: '⚠️' },
  timing: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '⏰' },
  damage: { bg: 'bg-red-100', text: 'text-red-700', icon: '💥' },
  other: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '📝' },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  open: { bg: 'bg-red-100', text: 'text-red-700' },
  investigating: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  resolved: { bg: 'bg-green-100', text: 'text-green-700' },
  closed: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  low: { bg: 'bg-gray-100', text: 'text-gray-600' },
  medium: { bg: 'bg-blue-100', text: 'text-blue-600' },
  high: { bg: 'bg-orange-100', text: 'text-orange-600' },
  urgent: { bg: 'bg-red-100', text: 'text-red-600' },
};

interface Stats {
  total: number;
  open: number;
  resolved: number;
  avgResolutionDays: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}

export const ComplaintsView: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  // Form state for new complaint
  const [newComplaint, setNewComplaint] = useState({
    type: 'quality' as Complaint['type'],
    description: '',
    priority: 'medium' as Complaint['priority'],
  });

  // Resolution form state
  const [resolution, setResolution] = useState({
    text: '',
    refundAmount: '',
    recleanOffered: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [complaintsData, statsData] = await Promise.all([
      getComplaints(),
      getComplaintStats(),
    ]);
    setComplaints(complaintsData);
    setStats(statsData);
    setLoading(false);
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || complaint.priority === filterPriority;
      return matchesStatus && matchesPriority;
    });
  }, [complaints, filterStatus, filterPriority]);

  const handleCreateComplaint = async () => {
    if (!newComplaint.description.trim()) return;

    const created = await createComplaint({
      type: newComplaint.type,
      description: newComplaint.description,
      priority: newComplaint.priority,
    });

    if (created) {
      setComplaints([created, ...complaints]);
      setIsAdding(false);
      setNewComplaint({ type: 'quality', description: '', priority: 'medium' });
      loadData(); // Refresh stats
    }
  };

  const handleResolve = async () => {
    if (!selectedComplaint || !resolution.text.trim()) return;

    const resolved = await resolveComplaint(
      selectedComplaint.id,
      resolution.text,
      resolution.refundAmount ? parseFloat(resolution.refundAmount) : undefined,
      resolution.recleanOffered
    );

    if (resolved) {
      setComplaints(complaints.map((c) => (c.id === selectedComplaint.id ? resolved : c)));
      setSelectedComplaint(resolved);
      setIsResolving(false);
      setResolution({ text: '', refundAmount: '', recleanOffered: false });
      loadData();
    }
  };

  const handleClose = async (id: string) => {
    const closed = await closeComplaint(id);
    if (closed) {
      setComplaints(complaints.map((c) => (c.id === id ? closed : c)));
      if (selectedComplaint?.id === id) {
        setSelectedComplaint(closed);
      }
      loadData();
    }
  };

  const handleStartInvestigation = async (id: string) => {
    const updated = await updateComplaint(id, { status: 'investigating' });
    if (updated) {
      setComplaints(complaints.map((c) => (c.id === id ? updated : c)));
      if (selectedComplaint?.id === id) {
        setSelectedComplaint(updated);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0071e3]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Complaints</p>
          <p className="text-2xl font-bold text-[#1D1D1F]">{stats?.total || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Open</p>
          <p className="text-2xl font-bold text-red-600">{stats?.open || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Resolved</p>
          <p className="text-2xl font-bold text-green-600">{stats?.resolved || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Avg Resolution</p>
          <p className="text-2xl font-bold text-[#0071e3]">{stats?.avgResolutionDays || 0} days</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary py-3 px-6 whitespace-nowrap"
        >
          + Log Complaint
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Complaints List */}
        <div className="lg:w-[450px] bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1D1D1F] mb-4">
            Complaints ({filteredComplaints.length})
          </h3>

          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredComplaints.map((complaint) => {
              const typeInfo = TYPE_COLORS[complaint.type] || TYPE_COLORS.other;
              const statusInfo = STATUS_COLORS[complaint.status] || STATUS_COLORS.open;
              const priorityInfo = PRIORITY_COLORS[complaint.priority] || PRIORITY_COLORS.medium;

              return (
                <button
                  key={complaint.id}
                  onClick={() => setSelectedComplaint(complaint)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedComplaint?.id === complaint.id
                      ? 'border-[#0071e3] bg-blue-50'
                      : 'border-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{typeInfo.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${typeInfo.bg} ${typeInfo.text}`}>
                          {complaint.type}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${priorityInfo.bg} ${priorityInfo.text}`}>
                          {complaint.priority}
                        </span>
                      </div>
                      <p className="text-sm text-[#1D1D1F] line-clamp-2">{complaint.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusInfo.bg} ${statusInfo.text}`}>
                          {complaint.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(complaint.created_at).toLocaleDateString('en-AU')}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredComplaints.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No complaints found
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          {isAdding ? (
            /* New Complaint Form */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1D1D1F]">Log New Complaint</h2>
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={newComplaint.type}
                    onChange={(e) => setNewComplaint({ ...newComplaint, type: e.target.value as Complaint['type'] })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white"
                  >
                    <option value="quality">Quality Issue</option>
                    <option value="timing">Timing Issue</option>
                    <option value="damage">Damage</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newComplaint.priority}
                    onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value as Complaint['priority'] })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white placeholder-gray-400"
                  placeholder="Describe the complaint in detail..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateComplaint}
                  disabled={!newComplaint.description.trim()}
                  className="btn-primary flex-1 py-3 disabled:opacity-50"
                >
                  Log Complaint
                </button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="py-3 px-6 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : selectedComplaint ? (
            /* Complaint Detail */
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{TYPE_COLORS[selectedComplaint.type]?.icon}</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${TYPE_COLORS[selectedComplaint.type]?.bg} ${TYPE_COLORS[selectedComplaint.type]?.text}`}>
                      {selectedComplaint.type}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${PRIORITY_COLORS[selectedComplaint.priority]?.bg} ${PRIORITY_COLORS[selectedComplaint.priority]?.text}`}>
                      {selectedComplaint.priority}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${STATUS_COLORS[selectedComplaint.status]?.bg} ${STATUS_COLORS[selectedComplaint.status]?.text}`}>
                    {selectedComplaint.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(selectedComplaint.created_at).toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Description</p>
                <p className="text-[#1D1D1F]">{selectedComplaint.description}</p>
              </div>

              {selectedComplaint.resolution && (
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-xs text-green-600 uppercase tracking-wide mb-2">Resolution</p>
                  <p className="text-green-800">{selectedComplaint.resolution}</p>
                  {selectedComplaint.refund_amount && (
                    <p className="mt-2 font-semibold text-green-700">
                      Refund: ${selectedComplaint.refund_amount}
                    </p>
                  )}
                  {selectedComplaint.reclean_offered && (
                    <p className="mt-1 text-sm text-green-600">
                      Reclean offered {selectedComplaint.reclean_completed ? '(completed)' : '(pending)'}
                    </p>
                  )}
                </div>
              )}

              {/* Resolution Form */}
              {isResolving && (
                <div className="bg-blue-50 rounded-xl p-4 space-y-4">
                  <p className="text-xs text-blue-600 uppercase tracking-wide">Resolve Complaint</p>
                  <textarea
                    value={resolution.text}
                    onChange={(e) => setResolution({ ...resolution, text: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white placeholder-gray-400"
                    placeholder="How was this resolved?"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount ($)</label>
                      <input
                        type="number"
                        value={resolution.refundAmount}
                        onChange={(e) => setResolution({ ...resolution, refundAmount: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white placeholder-gray-400"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={resolution.recleanOffered}
                          onChange={(e) => setResolution({ ...resolution, recleanOffered: e.target.checked })}
                          className="w-5 h-5 rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3]"
                        />
                        <span className="text-sm text-gray-700">Offer reclean</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleResolve}
                      disabled={!resolution.text.trim()}
                      className="btn-primary flex-1 py-2 disabled:opacity-50"
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => setIsResolving(false)}
                      className="py-2 px-4 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {!isResolving && (
                <div className="flex flex-wrap gap-3">
                  {selectedComplaint.status === 'open' && (
                    <button
                      onClick={() => handleStartInvestigation(selectedComplaint.id)}
                      className="py-2 px-4 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
                    >
                      Start Investigation
                    </button>
                  )}
                  {(selectedComplaint.status === 'open' || selectedComplaint.status === 'investigating') && (
                    <button
                      onClick={() => setIsResolving(true)}
                      className="btn-primary py-2 px-4"
                    >
                      Resolve
                    </button>
                  )}
                  {selectedComplaint.status === 'resolved' && (
                    <button
                      onClick={() => handleClose(selectedComplaint.id)}
                      className="py-2 px-4 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
                    >
                      Close Complaint
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">Select a complaint to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintsView;
