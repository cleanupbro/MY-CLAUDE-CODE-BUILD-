
import React, { useState } from 'react';
import { Submission, SubmissionStatus, SubmissionData } from '../types';
import { Card } from './Card';
import { generateSubmissionSummary, generateLeadScore, generateEmailDraft } from '../services/geminiService';
import { updateSubmissionSummary, updateSubmissionScore, updateSubmissionData } from '../services/submissionService';
import { BookingConfirmationModal } from './BookingConfirmationModal';

// N8N Webhook URLs for backend triggers
const N8N_WEBHOOKS = {
  LANDING: 'https://nioctibinu.online/webhook/8fe0b2c9-3d5b-44f5-84ff-0d0ef896e1fa',
  HOMES: 'https://nioctibinu.online/webhook/98d35453-4f18-40ca-bdfa-ba3aaa02646c',
  COMMERCIAL: 'https://nioctibinu.online/webhook/bb5fdb61-31d7-4001-9dd1-44ef7dc64d32',
  AIRBNB: 'https://nioctibinu.online/webhook/5d3f6ff4-5f08-4ccf-9b78-03b62ae6b72f',
  JOBS: 'https://nioctibinu.online/webhook/67f764f2-adff-481e-aa49-fd3de1feecde',
};


interface SubmissionCardProps {
  submission: Submission;
  onStatusChange: (id: string, status: SubmissionStatus) => void;
  onSubmissionsUpdate: (submissions: Submission[]) => void;
}

const StatusBadge: React.FC<{ status: SubmissionStatus }> = ({ status }) => {
  const baseClasses = "px-2 py-1 text-xs font-bold rounded-full";
  const statusClasses = {
    [SubmissionStatus.Pending]: "bg-yellow-200 text-yellow-800",
    [SubmissionStatus.Confirmed]: "bg-green-200 text-green-800",
    [SubmissionStatus.Canceled]: "bg-red-200 text-red-800",
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const ScoreBadge: React.FC<{ score?: number }> = ({ score }) => {
    if (score === undefined) return null;
    
    let colorClass = "bg-gray-200 text-gray-800";
    if (score >= 8) colorClass = "bg-green-100 text-green-800 border border-green-300";
    else if (score >= 5) colorClass = "bg-blue-100 text-blue-800 border border-blue-300";
    else colorClass = "bg-orange-100 text-orange-800 border border-orange-300";

    return (
        <div className={`flex items-center px-3 py-1 rounded-full font-bold text-xs ${colorClass}`}>
            <span className="mr-1">Lead Score:</span>
            <span className="text-lg">{score}/10</span>
        </div>
    );
};

const DataRow: React.FC<{ label: string; value: any }> = ({ label, value }) => {
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return null;

  const displayValue = Array.isArray(value) ? value.join(', ') : 
                       typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                       value;

  return (
    <div className="py-2 px-3 grid grid-cols-3 gap-4 text-sm even:bg-gray-50">
      <dt className="font-medium text-gray-600">{label}</dt>
      <dd className="text-gray-800 col-span-2 text-wrap break-words">{displayValue}</dd>
    </div>
  );
};

export const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission, onStatusChange, onSubmissionsUpdate }) => {
  const { id, timestamp, type, status, data } = submission;
  const submissionDate = new Date(timestamp).toLocaleString('en-AU');
  
  // Summary State
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(submission.summary || null);

  // Lead Score State
  const [isScoringLoading, setIsScoringLoading] = useState(false);
  const [score, setScore] = useState<number | undefined>(submission.leadScore);
  const [reasoning, setReasoning] = useState<string | undefined>(submission.leadReasoning);

  // Email Draft State
  const [isDrafting, setIsDrafting] = useState(false);
  const [emailDraft, setEmailDraft] = useState<string | null>(null);
  const [showDraft, setShowDraft] = useState(false);

  // Booking Confirmation Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState<any>(data);
  const [isSaving, setIsSaving] = useState(false);

  // Trigger Backend State
  const [isTriggering, setIsTriggering] = useState(false);
  const [triggerStatus, setTriggerStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const updatedSubmissions = await updateSubmissionData(id, editData as SubmissionData);
      onSubmissionsUpdate(updatedSubmissions);
      setShowEditModal(false);
      setTriggerStatus('success');
      setTimeout(() => setTriggerStatus('idle'), 3000);
    } catch (error) {
      console.error('Failed to save edit:', error);
      setTriggerStatus('error');
    }
    setIsSaving(false);
  };

  const handleTriggerBackend = async () => {
    setIsTriggering(true);
    setTriggerStatus('idle');

    // Determine which webhook to use based on submission type
    let webhookUrl = N8N_WEBHOOKS.LANDING;
    if (type === 'Residential Cleaning') webhookUrl = N8N_WEBHOOKS.HOMES;
    else if (type === 'Commercial Cleaning') webhookUrl = N8N_WEBHOOKS.COMMERCIAL;
    else if (type === 'Airbnb Cleaning') webhookUrl = N8N_WEBHOOKS.AIRBNB;
    else if (type === 'Job Application') webhookUrl = N8N_WEBHOOKS.JOBS;

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          submissionId: id,
          submissionType: type,
          triggeredAt: new Date().toISOString(),
          triggeredFrom: 'Admin CRM',
        }),
      });

      if (response.ok) {
        setTriggerStatus('success');
        setTimeout(() => setTriggerStatus('idle'), 5000);
      } else {
        setTriggerStatus('error');
      }
    } catch (error) {
      console.error('Failed to trigger backend:', error);
      setTriggerStatus('error');
    }
    setIsTriggering(false);
  };

  const handleGenerateSummary = async () => {
      setIsSummaryLoading(true);
      setSummaryError(null);
      const result = await generateSubmissionSummary(submission);
      if (result.summary) {
          setSummary(result.summary);
          const updatedSubmissions = updateSubmissionSummary(submission.id, result.summary);
          onSubmissionsUpdate(updatedSubmissions);
      } else {
          setSummaryError(result.error);
      }
      setIsSummaryLoading(false);
  };

  const handleGenerateScore = async () => {
      setIsScoringLoading(true);
      const result = await generateLeadScore(submission);
      if (result.score !== null && result.reasoning) {
          setScore(result.score);
          setReasoning(result.reasoning);
          const updatedSubmissions = updateSubmissionScore(submission.id, result.score, result.reasoning);
          onSubmissionsUpdate(updatedSubmissions);
      }
      setIsScoringLoading(false);
  };

  const handleGenerateDraft = async () => {
      setIsDrafting(true);
      setShowDraft(true);
      const result = await generateEmailDraft(submission);
      if (result.draft) {
          setEmailDraft(result.draft);
      }
      setIsDrafting(false);
  };

  const dataEntries = Object.entries(data).map(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      return { label, value };
  });

  return (
    <Card className="mb-6 animate-fade-in-up border-l-4 border-l-brand-gold">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4 border-b pb-4 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-brand-navy">{type}</h3>
             {score !== undefined && <ScoreBadge score={score} />}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Received: {submissionDate} | ID: {id}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <StatusBadge status={status} />
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditData(data);
                setShowEditModal(true);
              }}
              className="px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleTriggerBackend}
              disabled={isTriggering}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                triggerStatus === 'success' ? 'bg-green-100 text-green-700 border border-green-300' :
                triggerStatus === 'error' ? 'bg-red-100 text-red-700 border border-red-300' :
                'bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              {isTriggering ? '🔄 Sending...' :
               triggerStatus === 'success' ? '✅ Sent!' :
               triggerStatus === 'error' ? '❌ Failed' :
               '🚀 Trigger N8N'}
            </button>
          </div>
          <select
            value={status}
            onChange={(e) => onStatusChange(id, e.target.value as SubmissionStatus)}
            className="select text-xs py-1 h-8 min-w-[120px]"
          >
            <option value={SubmissionStatus.Pending}>Pending</option>
            <option value={SubmissionStatus.Confirmed}>Confirmed</option>
            <option value={SubmissionStatus.Canceled}>Canceled</option>
          </select>
        </div>
      </div>
      
      {/* AI Intelligence Suite */}
      <div className="mt-4 bg-brand-off-white rounded-xl p-4 border border-gray-200">
         <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brand-gold" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Gemini 3 Pro Intelligence
            </h4>
         </div>

         {/* Action Buttons */}
         <div className="flex gap-2 mb-4 flex-wrap">
             {!summary && (
                <button onClick={handleGenerateSummary} disabled={isSummaryLoading} className="btn-secondary py-1 px-3 text-xs border border-gray-300 bg-white">
                    {isSummaryLoading ? 'Summarizing...' : 'Generate Summary'}
                </button>
             )}
             {score === undefined && (
                 <button onClick={handleGenerateScore} disabled={isScoringLoading} className="btn-secondary py-1 px-3 text-xs border border-gray-300 bg-white">
                     {isScoringLoading ? 'Scoring...' : 'Analyze Lead Value'}
                 </button>
             )}
             <button onClick={handleGenerateDraft} disabled={isDrafting} className="btn-secondary py-1 px-3 text-xs border border-gray-300 bg-white">
                  {isDrafting ? 'Drafting...' : 'Draft Email Response'}
             </button>
             {status === SubmissionStatus.Pending && (
                 <button
                     onClick={() => setShowBookingModal(true)}
                     className="btn-primary py-1 px-3 text-xs bg-gradient-to-r from-green-500 to-green-600 text-white font-bold border-0 hover:from-green-600 hover:to-green-700 shadow-md"
                 >
                     💳 Confirm Booking & Send Payment Link
                 </button>
             )}
         </div>

         <div className="space-y-3">
            {/* Summary Output */}
            {summaryError && <p className="text-xs text-red-600">{summaryError}</p>}
            {summary && (
                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                    <span className="text-xs font-bold text-gray-500 block mb-1">SUMMARY</span>
                    <p className="text-sm text-gray-700">{summary}</p>
                </div>
            )}

            {/* Score Output */}
            {reasoning && (
                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                     <span className="text-xs font-bold text-gray-500 block mb-1">LEAD ANALYSIS</span>
                     <p className="text-sm text-gray-700">{reasoning}</p>
                </div>
            )}

            {/* Email Draft Output */}
            {showDraft && (
                <div className="bg-white p-3 rounded-md border border-gray-100 shadow-sm animate-fade-in-up">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500">EMAIL DRAFT</span>
                        <button onClick={() => setShowDraft(false)} className="text-xs text-red-400 hover:text-red-600">Close</button>
                    </div>
                    {isDrafting ? (
                        <div className="animate-pulse h-24 bg-gray-100 rounded"></div>
                    ) : (
                        <textarea 
                            className="w-full text-sm p-2 border rounded-md bg-gray-50 h-40 focus:ring-2 focus:ring-brand-gold focus:outline-none" 
                            value={emailDraft || ''} 
                            onChange={(e) => setEmailDraft(e.target.value)}
                        />
                    )}
                    {!isDrafting && (
                        <button 
                            onClick={() => navigator.clipboard.writeText(emailDraft || '')}
                            className="mt-2 text-xs text-brand-navy font-bold hover:underline"
                        >
                            Copy to Clipboard
                        </button>
                    )}
                </div>
            )}
         </div>
      </div>

      {/* Data Section */}
      <div className="mt-6">
         <h4 className="text-md font-semibold text-gray-800 mb-3 px-2">Full Submission Details</h4>
         <dl className="rounded-lg border border-gray-200 overflow-hidden">
          {dataEntries.map(({ label, value }) => <DataRow key={label} label={label} value={value} />)}
         </dl>
      </div>

      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        submission={submission}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={() => {
          // Refresh submissions after confirmation
          onStatusChange(submission.id, SubmissionStatus.Confirmed);
        }}
      />

      {/* Edit Submission Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-navy to-navy-light px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                ✏️ Edit Submission
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white/80 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Common fields based on data */}
                {editData.fullName !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editData.fullName || ''}
                      onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>
                )}
                {editData.contactName !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Name</label>
                    <input
                      type="text"
                      value={editData.contactName || ''}
                      onChange={(e) => setEditData({ ...editData, contactName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>
                )}
                {editData.contactPerson !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={editData.contactPerson || ''}
                      onChange={(e) => setEditData({ ...editData, contactPerson: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>
                )}
                {editData.companyName !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={editData.companyName || ''}
                      onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>
                )}
                {editData.email !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>
                )}
                {editData.phone !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editData.phone || ''}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>
                )}
                {editData.suburb !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Suburb</label>
                    <input
                      type="text"
                      value={editData.suburb || ''}
                      onChange={(e) => setEditData({ ...editData, suburb: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>
                )}
                {editData.bedrooms !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={editData.bedrooms || ''}
                      onChange={(e) => setEditData({ ...editData, bedrooms: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>
                )}
                {editData.bathrooms !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={editData.bathrooms || ''}
                      onChange={(e) => setEditData({ ...editData, bathrooms: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>
                )}
                {editData.priceEstimate !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price Estimate ($)</label>
                    <input
                      type="number"
                      value={editData.priceEstimate || ''}
                      onChange={(e) => setEditData({ ...editData, priceEstimate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>
                )}
                {editData.preferredDate !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={editData.preferredDate || ''}
                      onChange={(e) => setEditData({ ...editData, preferredDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>
                )}
                {editData.preferredStartDate !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Start Date</label>
                    <input
                      type="date"
                      value={editData.preferredStartDate || ''}
                      onChange={(e) => setEditData({ ...editData, preferredStartDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>
                )}
                {editData.notes !== undefined && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={editData.notes || ''}
                      onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-gold to-amber-500 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
