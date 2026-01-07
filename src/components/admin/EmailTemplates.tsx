import React, { useState, useMemo } from 'react';
import { EmailTemplate, Submission } from '../../types';
import { sendToWebhook } from '../../services/webhookService';
import { WEBHOOK_URLS } from '../../constants';

interface EmailTemplatesProps {
  submissions: Submission[];
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'quote-followup',
    name: 'Quote Follow-up',
    subject: 'Your Clean Up Bros Quote - Ready to Book?',
    body: `Hi {{customerName}},

Thanks for requesting a quote from Clean Up Bros!

We've prepared your estimate for {{serviceType}}:
**Estimated Price: {{price}}**

Ready to book? Simply reply to this email or call us at +61 406 764 585.

We'd love to help make your space shine!

Best regards,
The Clean Up Bros Team`,
    category: 'quote_follow_up',
    placeholders: [
      { key: '{{customerName}}', label: 'Customer Name' },
      { key: '{{serviceType}}', label: 'Service Type' },
      { key: '{{price}}', label: 'Price Estimate' },
    ],
  },
  {
    id: 'booking-confirmation',
    name: 'Booking Confirmation',
    subject: 'Booking Confirmed - Clean Up Bros',
    body: `Hi {{customerName}},

Great news! Your {{serviceType}} booking is confirmed.

**Booking Details:**
- Service: {{serviceType}}
- Date: {{date}}
- Price: {{price}}

Our team will arrive on time and ready to work. If you need to make any changes, please contact us at least 24 hours before.

Thank you for choosing Clean Up Bros!

Best regards,
The Clean Up Bros Team
+61 406 764 585`,
    category: 'booking_confirmation',
    placeholders: [
      { key: '{{customerName}}', label: 'Customer Name' },
      { key: '{{serviceType}}', label: 'Service Type' },
      { key: '{{date}}', label: 'Booking Date' },
      { key: '{{price}}', label: 'Price' },
    ],
  },
  {
    id: 'reminder',
    name: 'Appointment Reminder',
    subject: 'Reminder: Your Clean Up Bros Appointment Tomorrow',
    body: `Hi {{customerName}},

Just a friendly reminder that your {{serviceType}} is scheduled for tomorrow!

**Date:** {{date}}

Please ensure:
- Someone is available to provide access
- Any specific areas of concern are noted
- Pets are secured if applicable

If you need to reschedule, please call us ASAP at +61 406 764 585.

See you soon!
The Clean Up Bros Team`,
    category: 'reminder',
    placeholders: [
      { key: '{{customerName}}', label: 'Customer Name' },
      { key: '{{serviceType}}', label: 'Service Type' },
      { key: '{{date}}', label: 'Appointment Date' },
    ],
  },
  {
    id: 'thank-you',
    name: 'Thank You',
    subject: 'Thank You for Choosing Clean Up Bros!',
    body: `Hi {{customerName}},

Thank you for choosing Clean Up Bros for your {{serviceType}}!

We hope you're happy with the results. Your satisfaction is our priority.

**We'd love your feedback!**
If you have a moment, please leave us a review on Google - it really helps our small business grow.

Need us again? Book your next clean and enjoy our returning customer discount!

Thanks again,
The Clean Up Bros Team
+61 406 764 585`,
    category: 'thank_you',
    placeholders: [
      { key: '{{customerName}}', label: 'Customer Name' },
      { key: '{{serviceType}}', label: 'Service Type' },
    ],
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  quote_follow_up: { bg: 'bg-blue-100', text: 'text-blue-700' },
  booking_confirmation: { bg: 'bg-green-100', text: 'text-green-700' },
  reminder: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  thank_you: { bg: 'bg-purple-100', text: 'text-purple-700' },
  custom: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

const getCustomerName = (data: any): string => {
  return data.fullName || data.contactPerson || data.contactName || 'Customer';
};

const getCustomerEmail = (data: any): string => {
  return data.email || '';
};

export const EmailTemplates: React.FC<EmailTemplatesProps> = ({ submissions }) => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [composedEmail, setComposedEmail] = useState({ subject: '', body: '' });
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  // Replace placeholders in template
  const replacePlaceholders = (text: string, submission: Submission): string => {
    const { data, type } = submission;
    let result = text;

    result = result.replace(/\{\{customerName\}\}/g, getCustomerName(data));
    result = result.replace(/\{\{serviceType\}\}/g, type);
    result = result.replace(/\{\{price\}\}/g, data.priceEstimate ? `$${data.priceEstimate.toFixed(0)}` : 'TBD');
    result = result.replace(/\{\{date\}\}/g, (data as any).preferredDate || (data as any).preferredStartDate || 'TBD');
    result = result.replace(/\{\{email\}\}/g, getCustomerEmail(data));

    return result;
  };

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    if (selectedSubmission) {
      setComposedEmail({
        subject: replacePlaceholders(template.subject, selectedSubmission),
        body: replacePlaceholders(template.body, selectedSubmission),
      });
      setRecipientEmail(getCustomerEmail(selectedSubmission.data));
    } else {
      setComposedEmail({ subject: template.subject, body: template.body });
    }
  };

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setRecipientEmail(getCustomerEmail(submission.data));
    if (selectedTemplate) {
      setComposedEmail({
        subject: replacePlaceholders(selectedTemplate.subject, submission),
        body: replacePlaceholders(selectedTemplate.body, submission),
      });
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail || !composedEmail.subject || !composedEmail.body) return;

    setIsSending(true);
    setSendStatus('idle');

    try {
      // Send via N8N webhook
      const result = await sendToWebhook(WEBHOOK_URLS.SEND_EMAIL || 'https://n8n.cleanupbros.com.au/webhook/send-email', {
        to: recipientEmail,
        subject: composedEmail.subject,
        body: composedEmail.body,
        submissionId: selectedSubmission?.id,
        templateId: selectedTemplate?.id,
      });

      if (result.success) {
        setSendStatus('success');
        setTimeout(() => setSendStatus('idle'), 3000);
      } else {
        setSendStatus('error');
      }
    } catch (error) {
      setSendStatus('error');
    }

    setIsSending(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(`Subject: ${composedEmail.subject}\n\n${composedEmail.body}`);
    setSendStatus('success');
    setTimeout(() => setSendStatus('idle'), 2000);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate) return;

    const index = templates.findIndex(t => t.id === editingTemplate.id);
    if (index >= 0) {
      const newTemplates = [...templates];
      newTemplates[index] = editingTemplate;
      setTemplates(newTemplates);
    } else {
      setTemplates([...templates, { ...editingTemplate, id: `custom-${Date.now()}` }]);
    }

    setIsEditing(false);
    setEditingTemplate(null);
  };

  const handleNewTemplate = () => {
    setEditingTemplate({
      id: '',
      name: '',
      subject: '',
      body: '',
      category: 'custom',
      placeholders: [],
    });
    setIsEditing(true);
  };

  // Recent submissions for quick selection
  const recentSubmissions = useMemo(() => {
    return submissions
      .filter(s => getCustomerEmail(s.data))
      .slice(0, 10);
  }, [submissions]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Templates</p>
          <p className="text-2xl font-bold text-[#1D1D1F]">{templates.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Categories</p>
          <p className="text-2xl font-bold text-[#0071e3]">4</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Recent Leads</p>
          <p className="text-2xl font-bold text-green-600">{recentSubmissions.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Placeholders</p>
          <p className="text-2xl font-bold text-purple-600">5</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Templates List */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#1D1D1F]">Templates</h3>
            <button
              onClick={handleNewTemplate}
              className="text-sm text-[#0071e3] hover:underline"
            >
              + New
            </button>
          </div>

          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-[#0071e3] bg-blue-50'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CATEGORY_COLORS[template.category]?.bg} ${CATEGORY_COLORS[template.category]?.text}`}>
                    {template.category.replace('_', ' ')}
                  </span>
                </div>
                <p className="font-semibold text-[#1D1D1F] text-sm">{template.name}</p>
                <p className="text-xs text-gray-500 truncate">{template.subject}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Composer */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          {isEditing ? (
            // Template Editor
            <div className="space-y-4">
              <h3 className="font-bold text-[#1D1D1F]">
                {editingTemplate?.id ? 'Edit Template' : 'New Template'}
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={editingTemplate?.name || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate!, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                  placeholder="e.g., Welcome Email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={editingTemplate?.subject || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate!, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                  placeholder="Email subject line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <textarea
                  value={editingTemplate?.body || ''}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate!, body: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] font-mono text-sm"
                  placeholder="Use {{customerName}}, {{serviceType}}, {{price}}, {{date}} as placeholders"
                />
              </div>

              <div className="flex gap-3">
                <button onClick={handleSaveTemplate} className="btn-primary flex-1 py-3">
                  Save Template
                </button>
                <button
                  onClick={() => { setIsEditing(false); setEditingTemplate(null); }}
                  className="btn-secondary py-3 px-6"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Email Composer
            <>
              <h3 className="font-bold text-[#1D1D1F] mb-4">Compose Email</h3>

              {/* Quick Select Submission */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select Customer</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {recentSubmissions.map((submission) => (
                    <button
                      key={submission.id}
                      onClick={() => handleSelectSubmission(submission)}
                      className={`flex-shrink-0 px-3 py-2 rounded-lg border text-sm transition-all ${
                        selectedSubmission?.id === submission.id
                          ? 'border-[#0071e3] bg-blue-50 text-[#0071e3]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {getCustomerName(submission.data)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                  placeholder="customer@email.com"
                />
              </div>

              {/* Subject */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={composedEmail.subject}
                  onChange={(e) => setComposedEmail({ ...composedEmail, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                  placeholder="Email subject"
                />
              </div>

              {/* Body */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  value={composedEmail.body}
                  onChange={(e) => setComposedEmail({ ...composedEmail, body: e.target.value })}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                  placeholder="Select a template or write your message..."
                />
              </div>

              {/* Status Message */}
              {sendStatus === 'success' && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm">
                  Email sent successfully!
                </div>
              )}
              {sendStatus === 'error' && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                  Failed to send email. Please try again or copy to clipboard.
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSendEmail}
                  disabled={isSending || !recipientEmail || !composedEmail.subject}
                  className="btn-primary flex-1 py-3 disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Send via N8N'}
                </button>
                <button
                  onClick={handleCopyToClipboard}
                  className="btn-secondary py-3 px-6"
                >
                  Copy to Clipboard
                </button>
                {selectedTemplate && (
                  <button
                    onClick={() => { setEditingTemplate(selectedTemplate); setIsEditing(true); }}
                    className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Placeholders Reference */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-[#1D1D1F] mb-4">Available Placeholders</h3>
        <div className="flex flex-wrap gap-3">
          {['{{customerName}}', '{{serviceType}}', '{{price}}', '{{date}}', '{{email}}'].map((placeholder) => (
            <code
              key={placeholder}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-mono text-gray-700 cursor-pointer hover:bg-gray-200"
              onClick={() => navigator.clipboard.writeText(placeholder)}
              title="Click to copy"
            >
              {placeholder}
            </code>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmailTemplates;
