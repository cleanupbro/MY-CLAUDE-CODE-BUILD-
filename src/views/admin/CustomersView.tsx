/**
 * Customers View - Admin CRM
 * Simple customer database
 * 
 * Created: February 2, 2026
 */

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  suburb: string;
  address: string;
  totalJobs: number;
  lastJob: string;
  notes: string;
}

export const CustomersView: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false);
      return;
    }

    try {
      // Get unique customers from submissions
      const { data: submissions } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      // Extract unique customers by phone/email
      const customerMap = new Map<string, Customer>();
      
      (submissions || []).forEach((sub: any) => {
        const phone = sub.data?.phone;
        const email = sub.data?.email;
        const key = phone || email;
        
        if (!key) return;

        if (!customerMap.has(key)) {
          customerMap.set(key, {
            id: key,
            name: sub.data?.fullName || sub.data?.name || sub.data?.contactName || 'Unknown',
            phone: phone || '',
            email: email || '',
            suburb: sub.data?.suburb || '',
            address: sub.data?.address || '',
            totalJobs: 1,
            lastJob: sub.created_at,
            notes: '',
          });
        } else {
          const existing = customerMap.get(key)!;
          existing.totalJobs++;
        }
      });

      setCustomers(Array.from(customerMap.values()));
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(c => {
    const query = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.suburb.toLowerCase().includes(query)
    );
  });

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">👥 Customers</h1>
        <span className="text-gray-500">{customers.length} total</span>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or suburb..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-200">
          <span className="text-5xl">{search ? '🔍' : '👥'}</span>
          <p className="text-gray-500 mt-3 text-lg">
            {search ? 'No customers found' : 'No customers yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredCustomers.map((customer) => (
            <button
              key={customer.id}
              onClick={() => setSelectedCustomer(customer)}
              className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-xl font-bold text-teal-600 shrink-0">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{customer.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {customer.suburb || customer.phone || customer.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-teal-600 font-medium">{customer.totalJobs} jobs</p>
                  <p className="text-xs text-gray-400">Last: {formatDate(customer.lastJob)}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
};

// Customer Detail Modal
const CustomerDetailModal: React.FC<{
  customer: Customer;
  onClose: () => void;
}> = ({ customer, onClose }) => {
  const callCustomer = () => {
    if (customer.phone) {
      window.location.href = `tel:${customer.phone}`;
    }
  };

  const whatsappCustomer = () => {
    if (customer.phone) {
      const phone = customer.phone.replace(/\D/g, '');
      const formattedPhone = phone.startsWith('0') ? `61${phone.slice(1)}` : phone;
      window.open(`https://wa.me/${formattedPhone}`, '_blank');
    }
  };

  const emailCustomer = () => {
    if (customer.email) {
      window.location.href = `mailto:${customer.email}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Customer Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
        </div>

        <div className="p-4 space-y-4">
          {/* Customer Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-3xl font-bold text-teal-600 mx-auto">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mt-3">{customer.name}</h3>
            <p className="text-gray-500">{customer.suburb}</p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            {customer.phone && (
              <>
                <button
                  onClick={callCustomer}
                  className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  📞 Call
                </button>
                <button
                  onClick={whatsappCustomer}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  💬 WhatsApp
                </button>
              </>
            )}
            {customer.email && (
              <button
                onClick={emailCustomer}
                className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2"
              >
                📧 Email
              </button>
            )}
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            {customer.phone && (
              <div className="flex justify-between">
                <span className="text-gray-500">📱 Phone</span>
                <span className="text-gray-800 font-medium">{customer.phone}</span>
              </div>
            )}
            {customer.email && (
              <div className="flex justify-between">
                <span className="text-gray-500">📧 Email</span>
                <span className="text-gray-800 font-medium truncate ml-4">{customer.email}</span>
              </div>
            )}
            {customer.address && (
              <div className="flex justify-between">
                <span className="text-gray-500">📍 Address</span>
                <span className="text-gray-800 font-medium text-right">{customer.address}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">🧹 Total Jobs</span>
              <span className="text-teal-600 font-bold">{customer.totalJobs}</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomersView;
