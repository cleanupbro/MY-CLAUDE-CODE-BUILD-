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

export const AirbnbContractView: React.FC<NavigationProps> = ({ navigateTo }) => {
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

    // Property Details
    propertyAddress: '',
    propertyType: 'Apartment',
    bedroomCount: '2',
    bathroomCount: '2',

    // Service Details
    serviceDescription: 'Full Airbnb turnover cleaning including bedrooms, bathrooms, kitchen, living areas, laundry, and outdoor spaces as required between guest stays.',
    serviceFrequency: 'Per Turnover (as needed)',
    specialRequirements: '',

    // Financial Terms
    pricePerTurnover: '',
    estimatedTurnoversPerMonth: '8',
    totalContractValue: '',
    paymentFrequency: 'monthly' as 'monthly' | 'weekly' | 'bi-weekly',

    // Duration
    startDate: '',
    durationMonths: '6',
    autoRenew: false,

    // Notes
    internalNotes: '',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate total contract value
      if (field === 'pricePerTurnover' || field === 'estimatedTurnoversPerMonth' || field === 'durationMonths') {
        const price = parseFloat(field === 'pricePerTurnover' ? value : updated.pricePerTurnover) || 0;
        const turnovers = parseFloat(field === 'estimatedTurnoversPerMonth' ? value : updated.estimatedTurnoversPerMonth) || 0;
        const months = parseFloat(field === 'durationMonths' ? value : updated.durationMonths) || 0;
        updated.totalContractValue = (price * turnovers * months).toFixed(2);
      }

      return updated;
    });
  };

  const validateForm = (): boolean => {
    if (!formData.clientName || !formData.clientEmail || !formData.propertyAddress) {
      showToast('Please fill in all required client and property details', 'error');
      return false;
    }

    if (!formData.pricePerTurnover || parseFloat(formData.pricePerTurnover) <= 0) {
      showToast('Please enter a valid price per turnover', 'error');
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
        type: 'airbnb_long_term',
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        client_phone: formData.clientPhone,
        client_company: formData.clientCompany,
        property_address: formData.propertyAddress,
        property_type: `${formData.propertyType} - ${formData.bedroomCount}BR/${formData.bathroomCount}BA`,
        service_description: formData.serviceDescription,
        service_frequency: formData.serviceFrequency,
        special_requirements: formData.specialRequirements,
        total_contract_value: parseFloat(formData.totalContractValue),
        payment_frequency: formData.paymentFrequency,
        payment_amount_per_period: parseFloat(formData.pricePerTurnover) * parseFloat(formData.estimatedTurnoversPerMonth),
        start_date: formData.startDate,
        duration_months: parseInt(formData.durationMonths),
        auto_renew: formData.autoRenew,
        internal_notes: formData.internalNotes,
        service_scope: {
          pricePerTurnover: parseFloat(formData.pricePerTurnover),
          estimatedTurnoversPerMonth: parseFloat(formData.estimatedTurnoversPerMonth),
          bedroomCount: formData.bedroomCount,
          bathroomCount: formData.bathroomCount,
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
            🏠 Airbnb Long-Term Contract
          </h1>
          <p className="text-lg text-gray-600">
            Create a professional 6+ month service agreement for Airbnb property management
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
                    placeholder="Property Management Co."
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Property Details</h3>
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <label className="label">Property Address *</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={formData.propertyAddress}
                    onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                    placeholder="123 Main St, Sydney NSW 2000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">Property Type</label>
                  <select
                    className="input"
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  >
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Townhouse</option>
                    <option>Studio</option>
                  </select>
                </div>
                <div>
                  <label className="label">Bedrooms</label>
                  <select
                    className="input"
                    value={formData.bedroomCount}
                    onChange={(e) => handleInputChange('bedroomCount', e.target.value)}
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Bathrooms</label>
                  <select
                    className="input"
                    value={formData.bathroomCount}
                    onChange={(e) => handleInputChange('bathroomCount', e.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map(n => <option key={n}>{n}</option>)}
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
                    rows={3}
                    value={formData.serviceDescription}
                    onChange={(e) => handleInputChange('serviceDescription', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Service Frequency</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.serviceFrequency}
                    onChange={(e) => handleInputChange('serviceFrequency', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Special Requirements</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    placeholder="Any special cleaning requirements or access instructions..."
                  />
                </div>
              </div>
            </div>

            {/* Financial Terms */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Financial Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Price Per Turnover *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      className="input pl-8"
                      value={formData.pricePerTurnover}
                      onChange={(e) => handleInputChange('pricePerTurnover', e.target.value)}
                      placeholder="150.00"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label className="label">Est. Turnovers/Month</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.estimatedTurnoversPerMonth}
                    onChange={(e) => handleInputChange('estimatedTurnoversPerMonth', e.target.value)}
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="label">Payment Frequency</label>
                  <select
                    className="input"
                    value={formData.paymentFrequency}
                    onChange={(e) => handleInputChange('paymentFrequency', e.target.value)}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="bi-weekly">Bi-weekly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div>
                  <label className="label">Total Contract Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      className="input pl-8 bg-gray-50"
                      value={formData.totalContractValue}
                      readOnly
                      placeholder="Auto-calculated"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Contract Duration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Start Date *</label>
                  <input
                    type="date"
                    className="input"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Duration (Months)</label>
                  <select
                    className="input"
                    value={formData.durationMonths}
                    onChange={(e) => handleInputChange('durationMonths', e.target.value)}
                  >
                    {[6, 12, 18, 24, 36].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.autoRenew}
                    onChange={(e) => handleInputChange('autoRenew', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Auto-renew at end of term</span>
                </label>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="mb-6">
              <label className="label">Internal Notes (Not shown to client)</label>
              <textarea
                className="input"
                rows={2}
                value={formData.internalNotes}
                onChange={(e) => handleInputChange('internalNotes', e.target.value)}
                placeholder="Any internal notes about this contract..."
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

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Contract Number</p>
                  <p className="font-bold text-brand-navy">{contract.contract_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-bold text-brand-navy">{contract.client_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Property</p>
                  <p className="font-bold text-brand-navy">{contract.property_address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="font-bold text-green-600 text-xl">${contract.total_contract_value.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-bold text-brand-navy">{contract.duration_months} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="font-bold text-brand-navy">{new Date(contract.start_date).toLocaleDateString('en-AU')}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep('details')}
                className="btn-secondary flex-1"
              >
                ← Edit Details
              </button>
              <button
                onClick={handleDownloadPDF}
                className="btn-secondary flex-1"
              >
                📄 Download PDF
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

        {/* Step 4: Complete */}
        {step === 'complete' && contract && (
          <Card>
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>

              <h2 className="text-3xl font-bold text-brand-navy mb-2">Contract Created!</h2>
              <p className="text-lg text-gray-600 mb-8">
                Contract #{contract.contract_number} is ready
              </p>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-brand-navy mb-3">Next Steps:</h3>
                <ol className="text-left space-y-2">
                  <li>1. Download the PDF contract</li>
                  <li>2. Send it to the client for review and signature</li>
                  <li>3. Upload the signed contract to your records</li>
                  <li>4. Create payment schedules and invoices</li>
                </ol>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleDownloadPDF}
                  className="btn-primary flex-1"
                >
                  📄 Download PDF Contract
                </button>
                <button
                  onClick={() => navigateTo('AdminDashboard')}
                  className="btn-secondary flex-1"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AirbnbContractView;
