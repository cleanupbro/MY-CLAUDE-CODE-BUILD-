import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { NavigationProps } from '../types';
import {
  getAllContracts,
  getContractStats,
  downloadContractPDF,
  ServiceContract,
} from '../services/contractService';
import { useToast } from '../contexts/ToastContext';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    purple: 'from-purple-500 to-purple-600',
  }[color];

  return (
    <div className={`bg-gradient-to-br ${colorClasses} text-white rounded-2xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-4xl">{icon}</span>
        <div className="text-right">
          <div className="text-3xl font-bold">{value}</div>
        </div>
      </div>
      <div className="text-sm font-medium opacity-90">{title}</div>
    </div>
  );
};

interface ContractRowProps {
  contract: ServiceContract;
  onDownloadPDF: (contract: ServiceContract) => void;
}

const ContractRow: React.FC<ContractRowProps> = ({ contract, onDownloadPDF }) => {
  const statusColors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    signed: 'bg-purple-100 text-purple-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    expired: 'bg-red-100 text-red-800',
  };

  const typeLabels = {
    general_service: '📄 General Service',
    airbnb_long_term: '🏠 Airbnb Long-Term',
    commercial_recurring: '🏢 Commercial Recurring',
    commercial_one_time: '🏢 Commercial One-Time',
    residential_recurring: '🏡 Residential Recurring',
  };

  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="font-mono font-bold text-brand-navy">{contract.contract_number}</div>
        <div className="text-xs text-gray-500">
          {new Date(contract.created_at!).toLocaleDateString()}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-medium">{typeLabels[contract.type]}</span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <div className="font-semibold">{contract.client_name}</div>
          <div className="text-gray-500 text-xs">{contract.client_email}</div>
          {contract.client_company && (
            <div className="text-gray-500 text-xs italic">{contract.client_company}</div>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">{contract.property_address}</div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="font-bold text-gray-700">
          ${contract.total_contract_value.toFixed(2)}
        </div>
        <div className="text-xs text-gray-500">
          {contract.payment_frequency}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="text-sm">
          <div>{new Date(contract.start_date).toLocaleDateString()}</div>
          {contract.end_date && (
            <div className="text-xs text-gray-500">
              to {new Date(contract.end_date).toLocaleDateString()}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[contract.status]}`}>
          {contract.status.toUpperCase()}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={() => onDownloadPDF(contract)}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          📄 Download PDF
        </button>
      </td>
    </tr>
  );
};

export const AdminContractsView: React.FC<NavigationProps> = ({ navigateTo }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<ServiceContract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<ServiceContract[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    draft: 0,
    signed: 0,
    totalValue: 0,
  });
  const [statusFilter, setStatusFilter] = useState<ServiceContract['status'] | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContracts();
    loadStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contracts, statusFilter, searchTerm]);

  const loadContracts = async () => {
    setLoading(true);
    const data = await getAllContracts();
    setContracts(data);
    setLoading(false);
  };

  const loadStats = async () => {
    const data = await getContractStats();
    setStats(data);
  };

  const applyFilters = () => {
    let filtered = [...contracts];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        c.contract_number.toLowerCase().includes(term) ||
        c.client_name.toLowerCase().includes(term) ||
        c.client_email.toLowerCase().includes(term) ||
        c.client_company?.toLowerCase().includes(term) ||
        c.property_address.toLowerCase().includes(term)
      );
    }

    setFilteredContracts(filtered);
  };

  const handleDownloadPDF = (contract: ServiceContract) => {
    try {
      downloadContractPDF(contract);
      showToast('Contract PDF downloaded successfully', 'success');
    } catch (error) {
      showToast('Failed to download PDF', 'error');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-brand-navy mb-2">
              📋 Contracts Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Manage service contracts and agreements
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigateTo('BasicContract')}
              className="btn-primary"
            >
              📄 Create Service Contract
            </button>
            <button
              onClick={() => navigateTo('AirbnbContract')}
              className="btn-secondary"
            >
              🏠 Airbnb Contract
            </button>
            <button
              onClick={() => navigateTo('CommercialInvoice')}
              className="btn-secondary"
            >
              🏢 Square Invoice
            </button>
            <button
              onClick={() => navigateTo('AdminDashboard')}
              className="btn-secondary"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon="📊"
            title="Total Contracts"
            value={stats.total}
            color="blue"
          />
          <StatCard
            icon="✅"
            title="Active Contracts"
            value={stats.active}
            color="green"
          />
          <StatCard
            icon="✍️"
            title="Signed Contracts"
            value={stats.signed}
            color="purple"
          />
          <StatCard
            icon="💰"
            title="Total Contract Value"
            value={`$${stats.totalValue.toLocaleString()}`}
            color="yellow"
          />
        </div>

        {/* Filters */}
        <Card>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">All Contracts</h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by contract #, client name, email, or address..."
                  className="input w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="w-full md:w-48">
                <select
                  className="input w-full"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="signed">Signed</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 mb-4">
              Showing {filteredContracts.length} of {contracts.length} contracts
            </div>

            {/* Contracts Table */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-gold border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Loading contracts...</p>
              </div>
            ) : filteredContracts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'No contracts found' : 'No contracts yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first contract to get started'}
                </p>
                {!(searchTerm || statusFilter !== 'all') && (
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => navigateTo('AirbnbContract')}
                      className="btn-secondary"
                    >
                      🏠 Create Airbnb Contract
                    </button>
                    <button
                      onClick={() => navigateTo('CommercialInvoice')}
                      className="btn-primary"
                    >
                      🏢 Create Square Invoice
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Contract #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Property
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContracts.map((contract) => (
                      <ContractRow
                        key={contract.id}
                        contract={contract}
                        onDownloadPDF={handleDownloadPDF}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminContractsView;
