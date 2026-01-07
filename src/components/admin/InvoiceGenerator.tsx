import React, { useState, useMemo } from 'react';
import { Submission, Invoice, InvoiceItem } from '../../types';
import jsPDF from 'jspdf';

interface InvoiceGeneratorProps {
  submissions: Submission[];
  onClose?: () => void;
}

const getCustomerName = (data: any): string => {
  return data.fullName || data.contactPerson || data.contactName || 'Unknown';
};

const getCustomerEmail = (data: any): string => {
  return data.email || data.purchaserEmail || '';
};

const getCustomerPhone = (data: any): string => {
  return data.phone || '';
};

const generateInvoiceNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `INV-${year}${month}-${random}`;
};

const generateInvoicePDF = (
  submission: Submission,
  invoiceNumber: string,
  items: InvoiceItem[],
  dueDate: string,
  notes: string
): Blob => {
  const doc = new jsPDF();
  const { data, type } = submission;

  // Colors
  const navy = [11, 37, 69] as const;
  const gold = [242, 183, 5] as const;

  // Header
  doc.setFontSize(28);
  doc.setTextColor(...navy);
  doc.text('INVOICE', 20, 25);

  // Company Info (Right side)
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Clean Up Bros', 140, 20);
  doc.text('ABN: 26 443 426 374', 140, 26);
  doc.text('Liverpool, NSW', 140, 32);
  doc.text('+61 406 764 585', 140, 38);
  doc.text('cleanupbros.au@gmail.com', 140, 44);

  // Invoice Details Box
  doc.setFillColor(245, 245, 247);
  doc.roundedRect(20, 55, 170, 25, 3, 3, 'F');

  doc.setFontSize(10);
  doc.setTextColor(...navy);
  doc.text(`Invoice #: ${invoiceNumber}`, 25, 65);
  doc.text(`Date: ${new Date().toLocaleDateString('en-AU')}`, 25, 72);
  doc.text(`Due Date: ${new Date(dueDate).toLocaleDateString('en-AU')}`, 100, 65);
  doc.text(`Service Type: ${type}`, 100, 72);

  // Bill To Section
  doc.setFontSize(12);
  doc.setTextColor(...navy);
  doc.text('Bill To:', 20, 95);

  doc.setFontSize(11);
  doc.setTextColor(60, 60, 60);
  doc.text(getCustomerName(data), 20, 103);
  doc.text(getCustomerEmail(data), 20, 110);
  if (getCustomerPhone(data)) {
    doc.text(getCustomerPhone(data), 20, 117);
  }

  // Line Items Table Header
  let y = 135;
  doc.setFillColor(...gold);
  doc.rect(20, y, 170, 10, 'F');

  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('Description', 25, y + 7);
  doc.text('Qty', 120, y + 7);
  doc.text('Price', 140, y + 7);
  doc.text('Total', 165, y + 7);

  // Line Items
  y += 15;
  doc.setTextColor(60, 60, 60);

  let subtotal = 0;
  items.forEach((item, index) => {
    const itemTotal = item.quantity * item.unit_price;
    subtotal += itemTotal;

    // Alternate row background
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(20, y - 5, 170, 10, 'F');
    }

    doc.text(item.description.substring(0, 40), 25, y);
    doc.text(item.quantity.toString(), 125, y);
    doc.text(`$${item.unit_price.toFixed(2)}`, 140, y);
    doc.text(`$${itemTotal.toFixed(2)}`, 165, y);

    y += 10;
  });

  // Totals
  y += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(120, y, 190, y);

  y += 10;
  doc.setFontSize(10);
  doc.text('Subtotal:', 130, y);
  doc.text(`$${subtotal.toFixed(2)}`, 165, y);

  y += 8;
  const tax = subtotal * 0.1; // 10% GST
  doc.text('GST (10%):', 130, y);
  doc.text(`$${tax.toFixed(2)}`, 165, y);

  y += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navy);
  doc.text('Total:', 130, y);
  doc.text(`$${(subtotal + tax).toFixed(2)}`, 165, y);

  // Notes
  if (notes) {
    y += 20;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Notes:', 20, y);
    const noteLines = doc.splitTextToSize(notes, 150);
    doc.text(noteLines, 20, y + 7);
  }

  // Payment Terms
  y = 260;
  doc.setFillColor(245, 245, 247);
  doc.roundedRect(20, y, 170, 25, 3, 3, 'F');

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text('Payment Terms: Payment due within 7 days of invoice date.', 25, y + 8);
  doc.text('Bank Transfer: Clean Up Bros | BSB: XXXXXX | ACC: XXXXXXXX', 25, y + 15);
  doc.text('Or pay online via the payment link sent to your email.', 25, y + 22);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for choosing Clean Up Bros!', 105, 292, { align: 'center' });

  return doc.output('blob');
};

export const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({
  submissions,
  onClose,
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter confirmed submissions
  const confirmedSubmissions = useMemo(() => {
    return submissions.filter(s =>
      s.status === 'Confirmed' || s.data.priceEstimate
    );
  }, [submissions]);

  // Search submissions
  const filteredSubmissions = useMemo(() => {
    if (!searchQuery) return confirmedSubmissions;
    const query = searchQuery.toLowerCase();
    return confirmedSubmissions.filter(s => {
      const name = getCustomerName(s.data).toLowerCase();
      const email = getCustomerEmail(s.data).toLowerCase();
      return name.includes(query) || email.includes(query);
    });
  }, [confirmedSubmissions, searchQuery]);

  const handleSelectSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    // Pre-populate items from submission
    const defaultItem: InvoiceItem = {
      description: `${submission.type}`,
      quantity: 1,
      unit_price: submission.data.priceEstimate || 0,
      total: submission.data.priceEstimate || 0,
    };
    setItems([defaultItem]);
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, total: 0 }]);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    // Recalculate total
    newItems[index].total = newItems[index].quantity * newItems[index].unit_price;
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleDownloadPDF = () => {
    if (!selectedSubmission) return;
    setIsGenerating(true);

    const invoiceNumber = generateInvoiceNumber();
    const blob = generateInvoicePDF(selectedSubmission, invoiceNumber, items, dueDate, notes);

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${invoiceNumber}.pdf`;
    link.click();
    URL.revokeObjectURL(url);

    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1D1D1F]">Invoice Generator</h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Submission Selector */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-[#1D1D1F] mb-4">Select Booking</h3>

          {/* Search */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3] focus:border-transparent"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Submission List */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {filteredSubmissions.map((submission) => (
              <button
                key={submission.id}
                onClick={() => handleSelectSubmission(submission)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedSubmission?.id === submission.id
                    ? 'border-[#0071e3] bg-blue-50'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[#1D1D1F]">{getCustomerName(submission.data)}</p>
                    <p className="text-sm text-gray-500">{submission.type}</p>
                  </div>
                  {submission.data.priceEstimate && (
                    <span className="font-bold text-[#1D1D1F]">
                      ${submission.data.priceEstimate.toFixed(0)}
                    </span>
                  )}
                </div>
              </button>
            ))}

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No confirmed bookings found
              </div>
            )}
          </div>
        </div>

        {/* Right: Invoice Editor */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          {selectedSubmission ? (
            <>
              <h3 className="font-bold text-[#1D1D1F] mb-4">Invoice Details</h3>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="font-semibold text-[#1D1D1F]">{getCustomerName(selectedSubmission.data)}</p>
                <p className="text-sm text-gray-500">{getCustomerEmail(selectedSubmission.data)}</p>
                <p className="text-sm text-gray-500">{getCustomerPhone(selectedSubmission.data)}</p>
              </div>

              {/* Due Date */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>

              {/* Line Items */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Line Items</label>
                  <button
                    onClick={addItem}
                    className="text-sm text-[#0071e3] hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        placeholder="Description"
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-2 border border-gray-200 rounded-lg text-sm text-center"
                        min="1"
                      />
                      <input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-2 border border-gray-200 rounded-lg text-sm"
                        step="0.01"
                      />
                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes for the invoice..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0071e3]"
                />
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">GST (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-[#0071e3]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGenerating || items.length === 0}
                  className="flex-1 btn-primary py-3 disabled:opacity-50"
                >
                  {isGenerating ? 'Generating...' : 'Download PDF'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">Select a booking to create an invoice</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
