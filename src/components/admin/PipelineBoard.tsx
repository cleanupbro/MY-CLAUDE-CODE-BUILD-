import React, { useState, useMemo } from 'react';
import { Submission, PipelineStage, ServiceType } from '../../types';

interface PipelineBoardProps {
  submissions: Submission[];
  onUpdateStage: (submissionId: string, newStage: PipelineStage) => void;
  onViewSubmission: (submission: Submission) => void;
}

const STAGES: PipelineStage[] = [
  PipelineStage.New,
  PipelineStage.Contacted,
  PipelineStage.Quoted,
  PipelineStage.Booked,
  PipelineStage.Completed,
];

const STAGE_COLORS: Record<PipelineStage, { bg: string; border: string; text: string }> = {
  [PipelineStage.New]: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  [PipelineStage.Contacted]: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700' },
  [PipelineStage.Quoted]: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
  [PipelineStage.Booked]: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
  [PipelineStage.Completed]: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' },
};

const SERVICE_COLORS: Record<string, string> = {
  'Residential Cleaning': 'bg-blue-500',
  'Commercial Cleaning': 'bg-green-500',
  'Airbnb Cleaning': 'bg-purple-500',
  'Job Application': 'bg-amber-500',
  'Landing Lead': 'bg-gray-500',
};

const getCustomerName = (data: any): string => {
  return data.fullName || data.contactPerson || data.contactName || data.purchaserName || 'Unknown';
};

const getCustomerEmail = (data: any): string => {
  return data.email || data.purchaserEmail || '';
};

const PipelineCard: React.FC<{
  submission: Submission;
  onDragStart: (e: React.DragEvent, submission: Submission) => void;
  onClick: () => void;
}> = ({ submission, onDragStart, onClick }) => {
  const { data, type } = submission;
  const customerName = getCustomerName(data);
  const priceEstimate = data.priceEstimate;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, submission)}
      onClick={onClick}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 group"
    >
      {/* Service Type Badge */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${SERVICE_COLORS[type] || 'bg-gray-400'}`} />
        <span className="text-xs font-medium text-gray-500 truncate">{type}</span>
      </div>

      {/* Customer Name */}
      <h4 className="font-semibold text-[#1D1D1F] text-sm mb-1 truncate group-hover:text-[#0071e3] transition-colors">
        {customerName}
      </h4>

      {/* Email */}
      <p className="text-xs text-gray-400 truncate mb-3">
        {getCustomerEmail(data)}
      </p>

      {/* Price & Date */}
      <div className="flex items-center justify-between">
        {priceEstimate && (
          <span className="text-sm font-bold text-[#1D1D1F]">
            ${priceEstimate.toFixed(0)}
          </span>
        )}
        <span className="text-xs text-gray-400">
          {new Date(submission.timestamp).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Lead Score Badge */}
      {submission.leadScore !== undefined && (
        <div className="mt-2 flex items-center gap-1">
          <div className={`text-xs px-2 py-0.5 rounded-full ${
            submission.leadScore >= 7 ? 'bg-green-100 text-green-700' :
            submission.leadScore >= 4 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            Score: {submission.leadScore}/10
          </div>
        </div>
      )}
    </div>
  );
};

const PipelineColumn: React.FC<{
  stage: PipelineStage;
  submissions: Submission[];
  onDragStart: (e: React.DragEvent, submission: Submission) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, stage: PipelineStage) => void;
  onViewSubmission: (submission: Submission) => void;
}> = ({ stage, submissions, onDragStart, onDragOver, onDrop, onViewSubmission }) => {
  const colors = STAGE_COLORS[stage];
  const totalValue = submissions.reduce((sum, s) => sum + (s.data.priceEstimate || 0), 0);

  return (
    <div
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stage)}
      className={`flex-1 min-w-[280px] ${colors.bg} rounded-2xl p-4 border-2 ${colors.border} transition-all duration-200`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className={`font-bold ${colors.text}`}>{stage}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
            {submissions.length}
          </span>
        </div>
        {totalValue > 0 && (
          <span className="text-xs font-medium text-gray-500">
            ${totalValue.toLocaleString()}
          </span>
        )}
      </div>

      {/* Cards */}
      <div className="space-y-3 min-h-[200px]">
        {submissions.map((submission) => (
          <PipelineCard
            key={submission.id}
            submission={submission}
            onDragStart={onDragStart}
            onClick={() => onViewSubmission(submission)}
          />
        ))}

        {submissions.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Drop leads here
          </div>
        )}
      </div>
    </div>
  );
};

export const PipelineBoard: React.FC<PipelineBoardProps> = ({
  submissions,
  onUpdateStage,
  onViewSubmission,
}) => {
  const [draggedSubmission, setDraggedSubmission] = useState<Submission | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Filter submissions (exclude Job Applications and Client Feedback)
  const relevantSubmissions = useMemo(() => {
    return submissions.filter(s =>
      s.type !== ServiceType.Jobs &&
      s.type !== ServiceType.ClientFeedback
    );
  }, [submissions]);

  // Apply type filter
  const filteredSubmissions = useMemo(() => {
    if (filterType === 'all') return relevantSubmissions;
    return relevantSubmissions.filter(s => s.type === filterType);
  }, [relevantSubmissions, filterType]);

  // Group by pipeline stage
  const groupedSubmissions = useMemo(() => {
    const groups: Record<PipelineStage, Submission[]> = {
      [PipelineStage.New]: [],
      [PipelineStage.Contacted]: [],
      [PipelineStage.Quoted]: [],
      [PipelineStage.Booked]: [],
      [PipelineStage.Completed]: [],
    };

    filteredSubmissions.forEach((submission) => {
      const stage = submission.pipelineStage || PipelineStage.New;
      groups[stage].push(submission);
    });

    return groups;
  }, [filteredSubmissions]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredSubmissions.length;
    const totalValue = filteredSubmissions.reduce((sum, s) => sum + (s.data.priceEstimate || 0), 0);
    const bookedValue = groupedSubmissions[PipelineStage.Booked].reduce((sum, s) => sum + (s.data.priceEstimate || 0), 0);
    const completedValue = groupedSubmissions[PipelineStage.Completed].reduce((sum, s) => sum + (s.data.priceEstimate || 0), 0);

    return { total, totalValue, bookedValue, completedValue };
  }, [filteredSubmissions, groupedSubmissions]);

  const handleDragStart = (e: React.DragEvent, submission: Submission) => {
    setDraggedSubmission(submission);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    if (draggedSubmission && draggedSubmission.pipelineStage !== stage) {
      onUpdateStage(draggedSubmission.id, stage);
    }
    setDraggedSubmission(null);
  };

  const filterOptions = [
    { value: 'all', label: 'All Leads' },
    { value: 'Residential Cleaning', label: 'Residential' },
    { value: 'Commercial Cleaning', label: 'Commercial' },
    { value: 'Airbnb Cleaning', label: 'Airbnb' },
    { value: 'Landing Lead', label: 'Landing Leads' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Leads</p>
          <p className="text-2xl font-bold text-[#1D1D1F]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Pipeline Value</p>
          <p className="text-2xl font-bold text-[#1D1D1F]">${stats.totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Booked Value</p>
          <p className="text-2xl font-bold text-green-600">${stats.bookedValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Completed</p>
          <p className="text-2xl font-bold text-[#0071e3]">${stats.completedValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {filterOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilterType(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filterType === option.value
                ? 'bg-[#0071e3] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0071e3]'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <PipelineColumn
            key={stage}
            stage={stage}
            submissions={groupedSubmissions[stage]}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onViewSubmission={onViewSubmission}
          />
        ))}
      </div>
    </div>
  );
};

export default PipelineBoard;
