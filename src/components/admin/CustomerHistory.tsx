import React, { useState, useMemo } from 'react';
import { Submission, CustomerNote } from '../../types';

interface CustomerHistoryProps {
  submissions: Submission[];
  onViewSubmission: (submission: Submission) => void;
}

const SERVICE_COLORS: Record<string, string> = {
  'Residential Cleaning': 'bg-blue-500',
  'Commercial Cleaning': 'bg-green-500',
  'Airbnb Cleaning': 'bg-purple-500',
  'Job Application': 'bg-amber-500',
  'Landing Lead': 'bg-gray-500',
};

const getCustomerEmail = (data: any): string => {
  return data.email || data.purchaserEmail || '';
};

const getCustomerName = (data: any): string => {
  return data.fullName || data.contactPerson || data.contactName || data.purchaserName || 'Unknown';
};

const getCustomerPhone = (data: any): string => {
  return data.phone || data.purchaserPhone || '';
};

interface TimelineEntry {
  id: string;
  date: Date;
  type: 'submission' | 'note';
  title: string;
  subtitle: string;
  details?: string;
  submission?: Submission;
  note?: CustomerNote;
}

export const CustomerHistory: React.FC<CustomerHistoryProps> = ({
  submissions,
  onViewSubmission,
}) => {
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [notes, setNotes] = useState<CustomerNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<CustomerNote['note_type']>('internal');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Get unique customers from submissions
  const customers = useMemo(() => {
    const customerMap = new Map<string, { email: string; name: string; phone: string; count: number; totalValue: number }>();

    submissions.forEach((submission) => {
      const email = getCustomerEmail(submission.data);
      if (email) {
        const existing = customerMap.get(email);
        if (existing) {
          existing.count++;
          existing.totalValue += submission.data.priceEstimate || 0;
        } else {
          customerMap.set(email, {
            email,
            name: getCustomerName(submission.data),
            phone: getCustomerPhone(submission.data),
            count: 1,
            totalValue: submission.data.priceEstimate || 0,
          });
        }
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => b.count - a.count);
  }, [submissions]);

  // Filter customers by search
  const filteredCustomers = useMemo(() => {
    if (!searchEmail) return customers;
    const query = searchEmail.toLowerCase();
    return customers.filter(c =>
      c.email.toLowerCase().includes(query) ||
      c.name.toLowerCase().includes(query)
    );
  }, [customers, searchEmail]);

  // Get submissions for selected customer
  const customerSubmissions = useMemo(() => {
    if (!selectedCustomer) return [];
    return submissions.filter(s => getCustomerEmail(s.data) === selectedCustomer);
  }, [submissions, selectedCustomer]);

  // Build timeline
  const timeline = useMemo((): TimelineEntry[] => {
    const entries: TimelineEntry[] = [];

    // Add submissions
    customerSubmissions.forEach((submission) => {
      entries.push({
        id: `sub-${submission.id}`,
        date: new Date(submission.timestamp),
        type: 'submission',
        title: submission.type,
        subtitle: `Status: ${submission.status}`,
        details: submission.data.priceEstimate ? `$${submission.data.priceEstimate.toFixed(0)}` : undefined,
        submission,
      });
    });

    // Add notes
    notes.forEach((note) => {
      entries.push({
        id: `note-${note.id}`,
        date: new Date(note.created_at),
        type: 'note',
        title: `${note.note_type.charAt(0).toUpperCase() + note.note_type.slice(1)} Note`,
        subtitle: note.note,
        note,
      });
    });

    // Sort by date descending
    return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [customerSubmissions, notes]);

  const selectedCustomerData = customers.find(c => c.email === selectedCustomer);

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedCustomer) return;

    const note: CustomerNote = {
      id: `note-${Date.now()}`,
      customer_email: selectedCustomer,
      note: newNote,
      note_type: noteType,
      created_at: new Date().toISOString(),
    };

    setNotes([note, ...notes]);
    setNewNote('');
    setIsAddingNote(false);
  };

  const NOTE_TYPE_COLORS: Record<CustomerNote['note_type'], { bg: string; text: string; icon: string }> = {
    call: { bg: 'bg-green-100', text: 'text-green-700', icon: '📞' },
    email: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '📧' },
    meeting: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '🤝' },
    internal: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '📝' },
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Customers</p>
          <p className="text-2xl font-bold text-[#1D1D1F]">{customers.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Repeat Customers</p>
          <p className="text-2xl font-bold text-green-600">
            {customers.filter(c => c.count > 1).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Lifetime Value</p>
          <p className="text-2xl font-bold text-[#0071e3]">
            ${customers.reduce((sum, c) => sum + c.totalValue, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Avg. Per Customer</p>
          <p className="text-2xl font-bold text-purple-600">
            ${customers.length > 0
              ? Math.round(customers.reduce((sum, c) => sum + c.totalValue, 0) / customers.length)
              : 0}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Customer List */}
        <div className="lg:w-[400px] bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1D1D1F] mb-4">Customers</h3>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Search by email or name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Customer List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredCustomers.map((customer) => (
              <button
                key={customer.email}
                onClick={() => setSelectedCustomer(customer.email)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedCustomer === customer.email
                    ? 'border-[#0071e3] bg-blue-50'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1D1D1F] truncate">{customer.name}</p>
                    <p className="text-sm text-gray-500 truncate">{customer.email}</p>
                  </div>
                  <div className="text-right ml-3">
                    <p className="text-sm font-bold text-[#1D1D1F]">{customer.count} booking{customer.count !== 1 ? 's' : ''}</p>
                    <p className="text-xs text-gray-500">${customer.totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </button>
            ))}

            {filteredCustomers.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No customers found
              </div>
            )}
          </div>
        </div>

        {/* Customer Detail & Timeline */}
        <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          {selectedCustomerData ? (
            <>
              {/* Customer Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#1D1D1F]">{selectedCustomerData.name}</h2>
                  <p className="text-gray-500">{selectedCustomerData.email}</p>
                  {selectedCustomerData.phone && (
                    <p className="text-gray-500">{selectedCustomerData.phone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-[#0071e3]">${selectedCustomerData.totalValue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Lifetime Value</p>
                </div>
              </div>

              {/* Add Note Button */}
              <div className="mb-6">
                {!isAddingNote ? (
                  <button
                    onClick={() => setIsAddingNote(true)}
                    className="btn-secondary w-full py-3"
                  >
                    + Add Note
                  </button>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex gap-2">
                      {(Object.keys(NOTE_TYPE_COLORS) as CustomerNote['note_type'][]).map((type) => (
                        <button
                          key={type}
                          onClick={() => setNoteType(type)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            noteType === type
                              ? `${NOTE_TYPE_COLORS[type].bg} ${NOTE_TYPE_COLORS[type].text}`
                              : 'bg-white border border-gray-200 text-gray-600'
                          }`}
                        >
                          {NOTE_TYPE_COLORS[type].icon} {type}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                        className="btn-primary flex-1 py-2 disabled:opacity-50"
                      >
                        Save Note
                      </button>
                      <button
                        onClick={() => { setIsAddingNote(false); setNewNote(''); }}
                        className="btn-secondary py-2 px-4"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                <div className="space-y-6">
                  {timeline.map((entry) => (
                    <div key={entry.id} className="relative pl-10">
                      {/* Timeline dot */}
                      <div className={`absolute left-2 w-5 h-5 rounded-full border-2 border-white shadow ${
                        entry.type === 'submission'
                          ? SERVICE_COLORS[entry.title] || 'bg-gray-400'
                          : NOTE_TYPE_COLORS[entry.note?.note_type || 'internal'].bg
                      }`} />

                      {/* Content */}
                      <div
                        onClick={() => entry.submission && onViewSubmission(entry.submission)}
                        className={`bg-gray-50 rounded-xl p-4 ${entry.submission ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-[#1D1D1F] text-sm">{entry.title}</span>
                          <span className="text-xs text-gray-400">
                            {entry.date.toLocaleDateString('en-AU', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{entry.subtitle}</p>
                        {entry.details && (
                          <p className="text-sm font-bold text-[#0071e3] mt-1">{entry.details}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {timeline.length === 0 && (
                    <div className="text-center py-8 text-gray-400 pl-10">
                      No history yet
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm">Select a customer to view their history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerHistory;
