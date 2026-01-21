/**
 * Team Management Component
 * Manage cleaners, supervisors, and admin staff
 */

import React, { useState, useEffect, useMemo } from 'react';
import { TeamMember } from '../../lib/supabaseClient';
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../../services/teamService';

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  cleaner: { bg: 'bg-blue-100', text: 'text-blue-700' },
  supervisor: { bg: 'bg-purple-100', text: 'text-purple-700' },
  admin: { bg: 'bg-amber-100', text: 'text-amber-700' },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: 'bg-green-100', text: 'text-green-700' },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-700' },
  on_leave: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
};

const SKILLS_OPTIONS = [
  'residential',
  'commercial',
  'airbnb',
  'deep_clean',
  'end_of_lease',
  'carpet_steam',
  'window_cleaning',
];

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const TeamManagement: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'cleaner' as 'cleaner' | 'supervisor' | 'admin',
    status: 'active' as 'active' | 'inactive' | 'on_leave',
    hourly_rate: '',
    skills: [] as string[],
    notes: '',
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    const data = await getTeamMembers();
    setMembers(data);
    setLoading(false);
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.phone.includes(searchQuery);
      const matchesRole = filterRole === 'all' || member.role === filterRole;
      const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, searchQuery, filterRole, filterStatus]);

  const stats = useMemo(() => ({
    total: members.length,
    active: members.filter((m) => m.status === 'active').length,
    cleaners: members.filter((m) => m.role === 'cleaner').length,
    onLeave: members.filter((m) => m.status === 'on_leave').length,
  }), [members]);

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      role: 'cleaner',
      status: 'active',
      hourly_rate: '',
      skills: [],
      notes: '',
    });
  };

  const handleAdd = () => {
    resetForm();
    setSelectedMember(null);
    setIsAdding(true);
    setIsEditing(false);
  };

  const handleEdit = (member: TeamMember) => {
    setFormData({
      full_name: member.full_name,
      email: member.email || '',
      phone: member.phone,
      role: member.role,
      status: member.status,
      hourly_rate: member.hourly_rate?.toString() || '',
      skills: member.skills || [],
      notes: member.notes || '',
    });
    setSelectedMember(member);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleSave = async () => {
    const memberData = {
      full_name: formData.full_name,
      email: formData.email || null,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
      skills: formData.skills,
      notes: formData.notes || null,
    };

    if (isAdding) {
      const newMember = await createTeamMember(memberData);
      if (newMember) {
        setMembers([newMember, ...members]);
        setIsAdding(false);
        resetForm();
      }
    } else if (isEditing && selectedMember) {
      const updated = await updateTeamMember(selectedMember.id, memberData);
      if (updated) {
        setMembers(members.map((m) => (m.id === selectedMember.id ? updated : m)));
        setIsEditing(false);
        setSelectedMember(updated);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    const success = await deleteTeamMember(id);
    if (success) {
      setMembers(members.filter((m) => m.id !== id));
      if (selectedMember?.id === id) {
        setSelectedMember(null);
      }
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
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
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Team</p>
          <p className="text-2xl font-bold text-[#1D1D1F]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Cleaners</p>
          <p className="text-2xl font-bold text-[#0071e3]">{stats.cleaners}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">On Leave</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.onLeave}</p>
        </div>
      </div>

      {/* Header with Search and Add */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team members..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white"
          >
            <option value="all">All Roles</option>
            <option value="cleaner">Cleaners</option>
            <option value="supervisor">Supervisors</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] text-gray-900 bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>

        <button
          onClick={handleAdd}
          className="btn-primary py-3 px-6 whitespace-nowrap"
        >
          + Add Team Member
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Team List */}
        <div className="lg:w-[400px] bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1D1D1F] mb-4">Team Members ({filteredMembers.length})</h3>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => {
                  setSelectedMember(member);
                  setIsEditing(false);
                  setIsAdding(false);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedMember?.id === member.id
                    ? 'border-[#0071e3] bg-blue-50'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                    {member.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1D1D1F] truncate">{member.full_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${ROLE_COLORS[member.role]?.bg} ${ROLE_COLORS[member.role]?.text}`}>
                        {member.role}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${STATUS_COLORS[member.status]?.bg} ${STATUS_COLORS[member.status]?.text}`}>
                        {member.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {filteredMembers.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No team members found
              </div>
            )}
          </div>
        </div>

        {/* Detail/Form Panel */}
        <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          {(isAdding || isEditing) ? (
            /* Form */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1D1D1F]">
                  {isAdding ? 'Add Team Member' : 'Edit Team Member'}
                </h2>
                <button
                  onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                    placeholder="+61 400 000 000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                  <input
                    type="number"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                    placeholder="35"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                  >
                    <option value="cleaner">Cleaner</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="on_leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS_OPTIONS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        formData.skills.includes(skill)
                          ? 'bg-[#0071e3] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {skill.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={!formData.full_name || !formData.phone}
                  className="btn-primary flex-1 py-3 disabled:opacity-50"
                >
                  {isAdding ? 'Add Member' : 'Save Changes'}
                </button>
                <button
                  onClick={() => { setIsAdding(false); setIsEditing(false); resetForm(); }}
                  className="py-3 px-6 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : selectedMember ? (
            /* Detail View */
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-semibold">
                    {selectedMember.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#1D1D1F]">{selectedMember.full_name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm ${ROLE_COLORS[selectedMember.role]?.bg} ${ROLE_COLORS[selectedMember.role]?.text}`}>
                        {selectedMember.role}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm ${STATUS_COLORS[selectedMember.status]?.bg} ${STATUS_COLORS[selectedMember.status]?.text}`}>
                        {selectedMember.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(selectedMember)}
                    className="py-2 px-4 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMember.id)}
                    className="text-red-500 hover:text-red-700 py-2 px-4"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                    <p className="text-lg text-[#1D1D1F]">{selectedMember.phone}</p>
                  </div>
                  {selectedMember.email && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                      <p className="text-lg text-[#1D1D1F]">{selectedMember.email}</p>
                    </div>
                  )}
                  {selectedMember.hourly_rate && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Hourly Rate</p>
                      <p className="text-lg text-[#1D1D1F]">${selectedMember.hourly_rate}/hr</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {selectedMember.skills && selectedMember.skills.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.skills.map((skill) => (
                          <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {skill.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Joined</p>
                    <p className="text-lg text-[#1D1D1F]">
                      {new Date(selectedMember.created_at).toLocaleDateString('en-AU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {selectedMember.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Notes</p>
                  <p className="text-[#1D1D1F]">{selectedMember.notes}</p>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm">Select a team member or add a new one</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
