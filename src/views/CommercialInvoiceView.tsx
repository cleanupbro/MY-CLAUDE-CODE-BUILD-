import React, { useState } from 'react';
import { Card } from '../components/Card';
import { NavigationProps } from '../types';
import { createSquareInvoice, SquareInvoiceData } from '../services/squareService';
import { useToast } from '../contexts/ToastContext';

export const CommercialInvoiceView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState<string>('');
  const [invoiceCreated, setInvoiceCreated] = useState(false);

  const [formData, setFormData] = useState({
    // Customer Info
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerCompany: '',

    // Invoice Items
    serviceName: 'Weekly Office Cleaning',
    serviceDescription: '',
    quantity: '1',
    pricePerUnit: '',

    // Terms
    dueDate: '',
    paymentTerms: 'Payment due within 14 days of invoice date',
    serviceTerms: 'Clean Up Bros will provide professional commercial cleaning services as described. Services include general office cleaning, bathroom sanitation, kitchen cleaning, and waste removal. All work will be completed to professional standards.',

    // Notes
    notes: '',
  });

  const [lineItems, setLineItems] = useState<Array<{
    name: string;
    description: string;
    quantity: number;
    amount: number;
  }>>([]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addLineItem = () => {
    if (!formData.serviceName || !formData.pricePerUnit) {
      showToast('Please fill in service name and price', 'error');
      return;
    }

    const item = {
      name: formData.serviceName,
      description: formData.serviceDescription,
      quantity: parseFloat(formData.quantity),
      amount: parseFloat(formData.pricePerUnit),
    };

    setLineItems(prev => [...prev, item]);

    // Reset item fields
    setFormData(prev => ({
      ...prev,
      serviceName: '',
      serviceDescription: '',
      quantity: '1',
      pricePerUnit: '',
    }));

    showToast('Line item added', 'success');
  };

  const removeLineItem = (index: number) => {
    setLineItems(prev => prev.filter((_, i) => i !== index));
  };

  const getTotalAmount = () => {
    return lineItems.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
  };

  const validateForm = (): boolean => {
    if (!formData.customerName || !formData.customerEmail) {
      showToast('Please fill in customer name and email', 'error');
      return false;
    }

    if (lineItems.length === 0) {
      showToast('Please add at least one line item', 'error');
      return false;
    }

    return true;
  };

  const handleCreateInvoice = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const invoiceData: SquareInvoiceData = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerCompany: formData.customerCompany,
        items: lineItems,
        dueDate: formData.dueDate,
        paymentTerms: formData.paymentTerms,
        serviceTerms: formData.serviceTerms,
        referenceId: `INV-${Date.now()}`,
        note: formData.notes,
      };

      const result = await createSquareInvoice(invoiceData);

      if (result.success && result.publicUrl) {
        setInvoiceUrl(result.publicUrl);
        setInvoiceCreated(true);
        showToast('Square Invoice created successfully!', 'success');
      } else {
        showToast(result.error || 'Failed to create invoice', 'error');
      }
    } catch (error) {
      showToast('Error creating invoice', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (invoiceCreated) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-brand-navy mb-2">Invoice Sent!</h2>
              <p className="text-lg text-gray-600 mb-8">
                Square Invoice has been sent to {formData.customerEmail}
              </p>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-brand-navy mb-3">What happens next:</h3>
                <ol className="text-left space-y-2">
                  <li>✉️ Client receives invoice email from Square</li>
                  <li>📄 They can review the service terms</li>
                  <li>✅ They click "Accept" to agree to terms</li>
                  <li>💳 They pay online via credit card or bank transfer</li>
                  <li>📧 You receive payment confirmation</li>
                </ol>
              </div>

              {invoiceUrl && (
                <div className="mb-6">
                  <a
                    href={invoiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    View Invoice in Square →
                  </a>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setInvoiceCreated(false);
                    setLineItems([]);
                    setFormData({
                      customerName: '',
                      customerEmail: '',
                      customerPhone: '',
                      customerCompany: '',
                      serviceName: 'Weekly Office Cleaning',
                      serviceDescription: '',
                      quantity: '1',
                      pricePerUnit: '',
                      dueDate: '',
                      paymentTerms: 'Payment due within 14 days of invoice date',
                      serviceTerms: 'Clean Up Bros will provide professional commercial cleaning services as described. Services include general office cleaning, bathroom sanitation, kitchen cleaning, and waste removal. All work will be completed to professional standards.',
                      notes: '',
                    });
                  }}
                  className="btn-secondary flex-1"
                >
                  Create Another Invoice
                </button>
                <button
                  onClick={() => navigateTo('AdminDashboard')}
                  className="btn-primary flex-1"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-navy mb-3">
            📄 Create Square Invoice
          </h1>
          <p className="text-lg text-gray-600">
            Send a professional invoice with service terms that clients can sign and pay online
          </p>
        </div>

        <Card>
          <h2 className="text-2xl font-bold text-brand-navy mb-6">Invoice Details</h2>

          {/* Customer Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-brand-navy mb-4">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Customer Name *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="label">Email *</label>
                <input
                  type="email"
                  className="input"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  className="input"
                  value={formData.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  placeholder="+61 4XX XXX XXX"
                />
              </div>
              <div>
                <label className="label">Company</label>
                <input
                  type="text"
                  className="input"
                  value={formData.customerCompany}
                  onChange={(e) => handleInputChange('customerCompany', e.target.value)}
                  placeholder="ABC Company Pty Ltd"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-brand-navy mb-4">Services</h3>

            {/* Add Line Item Form */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="label">Service Name *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.serviceName}
                    onChange={(e) => handleInputChange('serviceName', e.target.value)}
                    placeholder="Weekly Office Cleaning"
                  />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={formData.serviceDescription}
                    onChange={(e) => handleInputChange('serviceDescription', e.target.value)}
                    placeholder="Detailed description of the service..."
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label">Quantity</label>
                    <input
                      type="number"
                      className="input"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="label">Price per Unit *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        className="input pl-8"
                        value={formData.pricePerUnit}
                        onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                        placeholder="150.00"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addLineItem}
                      className="btn-primary w-full"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items List */}
            {lineItems.length > 0 && (
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3">Service</th>
                      <th className="text-center p-3">Qty</th>
                      <th className="text-right p-3">Price</th>
                      <th className="text-right p-3">Total</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-3">
                          <div className="font-semibold">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-gray-600">{item.description}</div>
                          )}
                        </td>
                        <td className="text-center p-3">{item.quantity}</td>
                        <td className="text-right p-3">${item.amount.toFixed(2)}</td>
                        <td className="text-right p-3 font-semibold">
                          ${(item.quantity * item.amount).toFixed(2)}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => removeLineItem(idx)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-bold">
                      <td colSpan={3} className="text-right p-3">Total:</td>
                      <td className="text-right p-3 text-xl text-green-600">
                        ${getTotalAmount().toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment Terms */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-brand-navy mb-4">Payment Terms</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="label">Due Date (Optional)</label>
                <input
                  type="date"
                  className="input"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Payment Terms</label>
                <input
                  type="text"
                  className="input"
                  value={formData.paymentTerms}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Service Terms */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-brand-navy mb-4">Service Agreement Terms</h3>
            <textarea
              className="input"
              rows={4}
              value={formData.serviceTerms}
              onChange={(e) => handleInputChange('serviceTerms', e.target.value)}
              placeholder="Service terms that the client will see and accept..."
            />
            <p className="text-xs text-gray-500 mt-2">
              These terms will be displayed on the invoice. Client must accept them before paying.
            </p>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="label">Additional Notes (Optional)</label>
            <textarea
              className="input"
              rows={2}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional notes for the customer..."
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigateTo('AdminDashboard')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateInvoice}
              disabled={loading || lineItems.length === 0}
              className="btn-primary flex-1"
            >
              {loading ? 'Creating Invoice...' : `Create & Send Invoice ($${getTotalAmount().toFixed(2)})`}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CommercialInvoiceView;
