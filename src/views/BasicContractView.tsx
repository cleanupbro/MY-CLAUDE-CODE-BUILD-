import React, { useState } from 'react';
import { Card } from '../components/Card';
import { NavigationProps } from '../types';
import SignaturePad from '../components/SignaturePad';
import {
  createContract,
  downloadContractPDF,
  CreateContractData,
  ServiceContract,
} from '../services/contractService';
import { useToast } from '../contexts/ToastContext';

export const BasicContractView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<'details' | 'review' | 'sign' | 'complete'>('details');
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState<ServiceContract | null>(null);
  const [signature, setSignature] = useState<string>('');

  // Form data
  const [formData, setFormData] = useState({
    // Client Info
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',

    // Service Location
    serviceLocation: '',
    propertyType: 'Residential',

    // Service Details
    serviceDescription: 'Professional cleaning services including all rooms, surfaces, and common areas as agreed upon.',
    serviceFrequency: 'Weekly',
    specialRequirements: '',

    // Financial Terms
    serviceRate: '',
    paymentFrequency: 'monthly' as 'monthly' | 'weekly' | 'bi-weekly',
    totalContractValue: '',

    // Duration
    startDate: '',
    durationMonths: '12',
    autoRenew: false,

    // Notes
    internalNotes: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate total contract value based on rate and duration
      if (field === 'serviceRate' || field === 'durationMonths' || field === 'serviceFrequency' || field === 'paymentFrequency') {
        const rate = parseFloat(field === 'serviceRate' ? value : updated.serviceRate) || 0;
        const months = parseFloat(field === 'durationMonths' ? value : updated.durationMonths) || 0;

        // Calculate based on payment frequency
        let multiplier = 1;
        if (updated.paymentFrequency === 'weekly') multiplier = 4.33; // avg weeks per month
        else if (updated.paymentFrequency === 'bi-weekly') multiplier = 2.17; // avg bi-weeks per month
        else multiplier = 1; // monthly

        updated.totalContractValue = (rate * multiplier * months).toFixed(2);
      }

      return updated;
    });
  };

  const validateForm = (): boolean => {
    if (!formData.clientName || !formData.clientEmail || !formData.serviceLocation) {
      showToast('Please fill in all required client and service details', 'error');
      return false;
    }

    if (!formData.serviceRate || parseFloat(formData.serviceRate) <= 0) {
      showToast('Please enter a valid service rate', 'error');
      return false;
    }

    if (!formData.startDate) {
      showToast('Please select a start date', 'error');
      return false;
    }

    return true;
  };

  const handleCreateDraft = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const contractData: CreateContractData = {
        type: 'general_service',
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhone,
        client_company: formData.clientCompany,
        property_address: formData.serviceLocation,
        property_type: formData.propertyType,
        service_description: formData.serviceDescription,
        service_frequency: formData.serviceFrequency,
        special_requirements: formData.specialRequirements,
        total_contract_value: parseFloat(formData.totalContractValue),
        payment_frequency: formData.paymentFrequency,
        payment_amount_per_period: parseFloat(formData.serviceRate),
        start_date: formData.startDate,
        duration_months: parseInt(formData.durationMonths),
        auto_renew: formData.autoRenew,
        internal_notes: formData.internalNotes,
        service_scope: {
          serviceType: formData.propertyType,
          frequency: formData.serviceFrequency,
        },
      };

      const result = await createContract(contractData);

      if (result.success && result.contract) {
        setContract(result.contract);
        setStep('review');
        showToast('Contract draft created successfully!', 'success');
      } else {
        showToast(result.error || 'Failed to create contract', 'error');
      }
    } catch (error) {
      showToast('Error creating contract', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!contract) return;
    downloadContractPDF(contract);
    showToast('Contract PDF downloaded!', 'success');
  };

  const handleSignature = (signatureData: string) => {
    setSignature(signatureData);
  };

  const handleComplete = () => {
    showToast('Contract created! You can now download the PDF or send it to the client.', 'success');
    setStep('complete');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-brand-navy mb-3">
            📄 Service Contract
          </h1>
          <p className="text-lg text-gray-600">
            Create a professional service agreement for any cleaning service
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {['details', 'review', 'sign', 'complete'].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                step === s ? 'bg-brand-gold text-brand-navy' :
                ['review', 'sign', 'complete'].includes(step) && idx < ['details', 'review', 'sign', 'complete'].indexOf(step)
                  ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              } font-bold`}>
                {idx + 1}
              </div>
              {idx < 3 && (
                <div className={`w-16 h-1 ${
                  ['review', 'sign', 'complete'].includes(step) && idx < ['details', 'review', 'sign', 'complete'].indexOf(step)
                    ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Contract Details */}
        {step === 'details' && (
          <Card>
            <h2 className="text-2xl font-bold text-brand-navy mb-6">Contract Details</h2>

            {/* Client Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Client Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Client Name *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.clientEmail}
                    onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.clientPhone}
                    onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                    placeholder="+61 4XX XXX XXX"
                  />
                </div>
                <div>
                  <label className="label">Company (Optional)</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.clientCompany}
                    onChange={(e) => handleInputChange('clientCompany', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
              </div>
            </div>

            {/* Service Location */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Service Location</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="label">Service Address *</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={formData.serviceLocation}
                    onChange={(e) => handleInputChange('serviceLocation', e.target.value)}
                    placeholder="123 Main St, Sydney NSW 2000"
                  />
                </div>
                <div>
                  <label className="label">Property Type</label>
                  <select
                    className="input"
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  >
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Airbnb/Short-term Rental</option>
                    <option>Office</option>
                    <option>Retail</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Service Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="label">Service Description</label>
                  <textarea
                    className="input"
                    rows={4}
                    value={formData.serviceDescription}
                    onChange={(e) => handleInputChange('serviceDescription', e.target.value)}
                    placeholder="Describe the cleaning services to be provided..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Service Frequency</label>
                    <select
                      className="input"
                      value={formData.serviceFrequency}
                      onChange={(e) => handleInputChange('serviceFrequency', e.target.value)}
                    >
                      <option>Weekly</option>
                      <option>Bi-weekly</option>
                      <option>Monthly</option>
                      <option>One-time</option>
                      <option>As Needed</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Payment Frequency</label>
                    <select
                      className="input"
                      value={formData.paymentFrequency}
                      onChange={(e) => handleInputChange('paymentFrequency', e.target.value as any)}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Special Requirements (Optional)</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    placeholder="Any specific requirements or preferences..."
                  />
                </div>
              </div>
            </div>

            {/* Financial Terms */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Financial Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Service Rate (per {formData.paymentFrequency}) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      className="input pl-8"
                      value={formData.serviceRate}
                      onChange={(e) => handleInputChange('serviceRate', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Contract Duration (months)</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.durationMonths}
                    onChange={(e) => handleInputChange('durationMonths', e.target.value)}
                    min="1"
                    max="36"
                  />
                </div>
              </div>
              {formData.serviceRate && formData.durationMonths && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Estimated Total Contract Value:</span>
                    <span className="text-2xl font-bold text-brand-navy">
                      ${formData.totalContractValue}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Based on {formData.paymentFrequency} payments over {formData.durationMonths} months
                  </p>
                </div>
              )}
            </div>

            {/* Contract Period */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Contract Period</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date *</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="flex items-center mt-8">
                  <input
                    type="checkbox"
                    id="autoRenew"
                    checked={formData.autoRenew}
                    onChange={(e) => handleInputChange('autoRenew', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <label htmlFor="autoRenew" className="ml-3 text-sm font-medium">
                    Auto-renew contract at end of term
                  </label>
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Internal Notes (Not shown to client)</h3>
              <textarea
                className="input"
                rows={3}
                value={formData.internalNotes}
                onChange={(e) => handleInputChange('internalNotes', e.target.value)}
                placeholder="Any internal notes or reminders..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigateTo('AdminContracts')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDraft}
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Creating...' : 'Create Contract →'}
              </button>
            </div>
          </Card>
        )}

        {/* Step 2: Review */}
        {step === 'review' && contract && (
          <Card>
            <h2 className="text-2xl font-bold text-brand-navy mb-6">Review Contract</h2>

            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-brand-navy mb-3">Contract Number</h3>
                <p className="text-lg">{contract.contract_number}</p>
              </div>

              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-brand-navy mb-3">Client Details</h3>
                <p><strong>Name:</strong> {contract.client_name}</p>
                <p><strong>Email:</strong> {contract.client_email}</p>
                {contract.client_phone && <p><strong>Phone:</strong> {contract.client_phone}</p>}
                {contract.client_company && <p><strong>Company:</strong> {contract.client_company}</p>}
              </div>

              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-brand-navy mb-3">Service Details</h3>
                <p><strong>Location:</strong> {contract.property_address}</p>
                <p><strong>Type:</strong> {contract.property_type}</p>
                <p><strong>Description:</strong> {contract.service_description}</p>
              </div>

              <div className="p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <h3 className="font-semibold text-brand-navy mb-3">Financial Terms</h3>
                <p><strong>Payment Amount:</strong> ${contract.payment_amount.toFixed(2)} per {contract.payment_frequency}</p>
                <p><strong>Total Contract Value:</strong> ${contract.total_contract_value.toFixed(2)}</p>
                <p><strong>Duration:</strong> {contract.duration_months} months</p>
                <p><strong>Start Date:</strong> {new Date(contract.start_date).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep('details')}
                className="btn-secondary flex-1"
              >
                ← Back to Edit
              </button>
              <button
                onClick={handleDownloadPDF}
                className="btn-secondary flex-1"
              >
                📥 Download PDF
              </button>
              <button
                onClick={handleComplete}
                className="btn-primary flex-1"
              >
                Complete →
              </button>
            </div>
          </Card>
        )}

        {/* Step 3: Complete */}
        {step === 'complete' && contract && (
          <Card>
            <div className="text-center py-8">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-3xl font-bold text-brand-navy mb-4">
                Contract Created Successfully!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Contract #{contract.contract_number} has been created and saved.
              </p>

              <div className="space-y-4 max-w-md mx-auto">
                <button
                  onClick={handleDownloadPDF}
                  className="btn-primary w-full"
                >
                  📥 Download Contract PDF
                </button>
                <button
                  onClick={() => navigateTo('AdminContracts')}
                  className="btn-secondary w-full"
                >
                  View All Contracts
                </button>
                <button
                  onClick={() => {
                    setStep('details');
                    setContract(null);
                    setFormData({
                      clientName: '',
                      clientEmail: '',
                      clientPhone: '',
                      clientCompany: '',
                      serviceLocation: '',
                      propertyType: 'Residential',
                      serviceDescription: 'Professional cleaning services including all rooms, surfaces, and common areas as agreed upon.',
                      serviceFrequency: 'Weekly',
                      specialRequirements: '',
                      serviceRate: '',
                      paymentFrequency: 'monthly',
                      totalContractValue: '',
                      startDate: '',
                      durationMonths: '12',
                      autoRenew: false,
                      internalNotes: '',
                    });
                  }}
                  className="btn-secondary w-full"
                >
                  Create Another Contract
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BasicContractView;
