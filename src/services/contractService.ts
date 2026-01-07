/**
 * Contract Service
 * Handles service contracts and agreements for long-term clients
 */

import { supabase } from '../lib/supabaseClient';
import jsPDF from 'jspdf';

export interface ServiceContract {
  id?: string;
  created_at?: string;
  updated_at?: string;

  // Contract Basics
  contract_number: string;
  template_id?: string;
  type: 'airbnb_long_term' | 'commercial_recurring' | 'commercial_one_time' | 'residential_recurring';
  status: 'draft' | 'sent' | 'signed' | 'active' | 'completed' | 'cancelled' | 'expired';

  // Client Information
  client_name: string;
  client_email: string;
  client_phone?: string;
  client_company?: string;

  // Property/Service Details
  property_address: string;
  property_type?: string;
  service_description: string;

  // Financial Terms
  total_contract_value: number;
  payment_frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'one-time';
  payment_amount_per_period: number;
  currency: string;

  // Duration
  start_date: string;
  end_date?: string;
  duration_months?: number;
  auto_renew: boolean;

  // Service Specifics
  service_frequency?: string;
  service_scope?: any;
  special_requirements?: string;

  // Signatures
  client_signature_data?: string;
  client_signed_at?: string;
  client_ip_address?: string;

  business_signature_data?: string;
  business_signed_at?: string;
  business_signed_by?: string;

  // Documents
  pdf_url?: string;
  pdf_generated_at?: string;

  // Square Integration
  square_invoice_id?: string;
  square_payment_status?: string;

  // Tracking
  sent_at?: string;
  viewed_at?: string;
  last_reminded_at?: string;

  // Notes
  internal_notes?: string;

  metadata?: any;
}

export interface CreateContractData {
  type: ServiceContract['type'];
  client_name: string;
  client_email: string;
  client_phone?: string;
  client_company?: string;
  property_address: string;
  property_type?: string;
  service_description: string;
  total_contract_value: number;
  payment_frequency: ServiceContract['payment_frequency'];
  payment_amount_per_period: number;
  start_date: string;
  end_date?: string;
  duration_months?: number;
  auto_renew?: boolean;
  service_frequency?: string;
  service_scope?: any;
  special_requirements?: string;
  internal_notes?: string;
}

/**
 * Generate next contract number
 */
export const generateContractNumber = async (): Promise<string> => {
  try {
    if (!supabase) {
      // Fallback to timestamp-based number if Supabase not configured
      return `CUB-${new Date().getFullYear().toString().slice(-2)}-${Date.now().toString().slice(-6)}`;
    }

    const { data, error } = await supabase.rpc('generate_contract_number');

    if (error) throw error;

    return data || `CUB-${new Date().getFullYear().toString().slice(-2)}-0001`;
  } catch (error) {
    console.error('Error generating contract number:', error);
    // Fallback to timestamp-based number
    return `CUB-${new Date().getFullYear().toString().slice(-2)}-${Date.now().toString().slice(-6)}`;
  }
};

/**
 * Create a new service contract
 */
export const createContract = async (
  data: CreateContractData
): Promise<{ success: boolean; contract?: ServiceContract; error?: string }> => {
  try {
    if (!supabase) {
      return { success: false, error: 'Database not configured' };
    }

    const contractNumber = await generateContractNumber();

    const contractData = {
      contract_number: contractNumber,
      ...data,
      status: 'draft',
      currency: 'AUD',
      auto_renew: data.auto_renew || false,
    };

    const { data: contract, error } = await supabase
      .from('service_contracts')
      .insert(contractData)
      .select()
      .single();

    if (error) throw error;

    return { success: true, contract: contract as ServiceContract };
  } catch (error) {
    console.error('Error creating contract:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create contract',
    };
  }
};

/**
 * Get contract by ID
 */
export const getContract = async (
  contractId: string
): Promise<{ success: boolean; contract?: ServiceContract; error?: string }> => {
  try {
    if (!supabase) {
      return { success: false, error: 'Database not configured' };
    }

    const { data, error } = await supabase
      .from('service_contracts')
      .select('*')
      .eq('id', contractId)
      .single();

    if (error) throw error;

    return { success: true, contract: data as ServiceContract };
  } catch (error) {
    console.error('Error fetching contract:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch contract',
    };
  }
};

/**
 * Get all contracts (with optional filters)
 */
export const getAllContracts = async (
  status?: ServiceContract['status']
): Promise<ServiceContract[]> => {
  try {
    if (!supabase) return [];

    let query = supabase
      .from('service_contracts')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data as ServiceContract[]) || [];
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return [];
  }
};

/**
 * Update contract
 */
export const updateContract = async (
  contractId: string,
  updates: Partial<ServiceContract>
): Promise<{ success: boolean; contract?: ServiceContract; error?: string }> => {
  try {
    if (!supabase) {
      return { success: false, error: 'Database not configured' };
    }

    const { data, error } = await supabase
      .from('service_contracts')
      .update(updates)
      .eq('id', contractId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, contract: data as ServiceContract };
  } catch (error) {
    console.error('Error updating contract:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update contract',
    };
  }
};

/**
 * Sign contract (client signature)
 */
export const signContract = async (
  contractId: string,
  signatureData: string,
  ipAddress?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!supabase) {
      return { success: false, error: 'Database not configured' };
    }

    const updates = {
      client_signature_data: signatureData,
      client_signed_at: new Date().toISOString(),
      client_ip_address: ipAddress,
      status: 'signed' as const,
    };

    const { error } = await supabase
      .from('service_contracts')
      .update(updates)
      .eq('id', contractId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error signing contract:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sign contract',
    };
  }
};

/**
 * Generate PDF for contract
 */
export const generateContractPDF = (contract: ServiceContract): Blob => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(24);
  doc.setTextColor(11, 37, 69); // Brand navy
  doc.text('SERVICE AGREEMENT', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Contract #: ${contract.contract_number}`, 20, 35);
  doc.text(`Date: ${new Date().toLocaleDateString('en-AU')}`, 150, 35);

  // Line break
  doc.setLineWidth(0.5);
  doc.line(20, 40, 190, 40);

  // Parties
  let y = 50;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PARTIES TO THIS AGREEMENT', 20, y);

  y += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Service Provider:', 20, y);
  doc.text('Clean Up Bros', 60, y);
  y += 6;
  doc.text('ABN:', 20, y);
  doc.text('[Your ABN]', 60, y);
  y += 6;
  doc.text('Contact:', 20, y);
  doc.text('cleanupbros.au@gmail.com | +61 406 764 585', 60, y);

  y += 12;
  doc.text('Client:', 20, y);
  doc.text(contract.client_name, 60, y);
  if (contract.client_company) {
    y += 6;
    doc.text('Company:', 20, y);
    doc.text(contract.client_company, 60, y);
  }
  y += 6;
  doc.text('Email:', 20, y);
  doc.text(contract.client_email, 60, y);
  if (contract.client_phone) {
    y += 6;
    doc.text('Phone:', 20, y);
    doc.text(contract.client_phone, 60, y);
  }

  // Service Details
  y += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICE DETAILS', 20, y);

  y += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Property Address:', 20, y);
  const addressLines = doc.splitTextToSize(contract.property_address, 110);
  doc.text(addressLines, 60, y);
  y += addressLines.length * 6;

  y += 6;
  doc.text('Service Description:', 20, y);
  const descLines = doc.splitTextToSize(contract.service_description, 110);
  doc.text(descLines, 60, y);
  y += descLines.length * 6;

  if (contract.service_frequency) {
    y += 6;
    doc.text('Service Frequency:', 20, y);
    doc.text(contract.service_frequency, 60, y);
  }

  if (contract.special_requirements) {
    y += 6;
    doc.text('Special Requirements:', 20, y);
    const reqLines = doc.splitTextToSize(contract.special_requirements, 110);
    doc.text(reqLines, 60, y);
    y += reqLines.length * 6;
  }

  // Financial Terms
  y += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('FINANCIAL TERMS', 20, y);

  y += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Total Contract Value:', 20, y);
  doc.text(`$${contract.total_contract_value.toFixed(2)} ${contract.currency}`, 60, y);

  y += 6;
  doc.text('Payment Frequency:', 20, y);
  doc.text(contract.payment_frequency, 60, y);

  y += 6;
  doc.text('Payment Amount:', 20, y);
  doc.text(`$${contract.payment_amount_per_period.toFixed(2)} per ${contract.payment_frequency.replace('-', ' ')}`, 60, y);

  // Duration
  y += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRACT DURATION', 20, y);

  y += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Start Date:', 20, y);
  doc.text(new Date(contract.start_date).toLocaleDateString('en-AU'), 60, y);

  if (contract.end_date) {
    y += 6;
    doc.text('End Date:', 20, y);
    doc.text(new Date(contract.end_date).toLocaleDateString('en-AU'), 60, y);
  }

  if (contract.duration_months) {
    y += 6;
    doc.text('Duration:', 20, y);
    doc.text(`${contract.duration_months} months`, 60, y);
  }

  y += 6;
  doc.text('Auto-Renewal:', 20, y);
  doc.text(contract.auto_renew ? 'Yes' : 'No', 60, y);

  // New page for terms
  doc.addPage();
  y = 20;

  // Terms and Conditions
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('TERMS AND CONDITIONS', 20, y);

  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const terms = [
    '1. SERVICE PROVISION: Clean Up Bros agrees to provide professional cleaning services as described in this agreement.',
    '2. PAYMENT: Client agrees to pay the specified amount according to the payment frequency outlined above.',
    '3. ACCESS: Client must provide reasonable access to the property for scheduled services.',
    '4. CANCELLATION: Either party may terminate this agreement with 30 days written notice.',
    '5. LIABILITY: Clean Up Bros maintains public liability insurance. Client is responsible for property insurance.',
    '6. STANDARDS: All services will be provided to professional standards in accordance with Australian Consumer Law.',
    '7. CHANGES: Any changes to this agreement must be made in writing and signed by both parties.',
    '8. GOVERNING LAW: This agreement is governed by the laws of New South Wales, Australia.',
  ];

  terms.forEach(term => {
    const termLines = doc.splitTextToSize(term, 170);
    doc.text(termLines, 20, y);
    y += termLines.length * 5 + 3;
  });

  // Signatures
  y += 20;
  if (y > 250) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SIGNATURES', 20, y);

  y += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  // Client Signature
  doc.text('Client:', 20, y);
  if (contract.client_signature_data) {
    doc.addImage(contract.client_signature_data, 'PNG', 20, y + 5, 60, 20);
    y += 30;
    doc.text(`Signed: ${contract.client_signed_at ? new Date(contract.client_signed_at).toLocaleDateString('en-AU') : '_____________'}`, 20, y);
  } else {
    doc.line(20, y + 10, 80, y + 10);
    y += 15;
    doc.text('Signature', 20, y);
    y += 10;
    doc.text('Date: _____________', 20, y);
  }

  y += 20;
  // Business Signature
  doc.text('Clean Up Bros:', 120, y - 35);
  if (contract.business_signature_data) {
    doc.addImage(contract.business_signature_data, 'PNG', 120, y - 30, 60, 20);
    doc.text(`Signed: ${contract.business_signed_at ? new Date(contract.business_signed_at).toLocaleDateString('en-AU') : '_____________'}`, 120, y);
  } else {
    doc.line(120, y - 25, 180, y - 25);
    doc.text('Signature', 120, y - 20);
    doc.text('Date: _____________', 120, y - 5);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('This is a legally binding agreement. Please read carefully before signing.', 105, 285, { align: 'center' });

  return doc.output('blob');
};

/**
 * Download contract as PDF
 */
export const downloadContractPDF = (contract: ServiceContract, filename?: string) => {
  const blob = generateContractPDF(contract);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `Contract-${contract.contract_number}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Get contract stats
 */
export const getContractStats = async () => {
  try {
    if (!supabase) {
      return { total: 0, active: 0, draft: 0, signed: 0, totalValue: 0 };
    }

    const { data: contracts, error } = await supabase
      .from('service_contracts')
      .select('*');

    if (error) throw error;

    const stats = {
      total: contracts?.length || 0,
      active: contracts?.filter(c => c.status === 'active').length || 0,
      draft: contracts?.filter(c => c.status === 'draft').length || 0,
      signed: contracts?.filter(c => c.status === 'signed').length || 0,
      totalValue: contracts?.reduce((sum, c) => sum + (c.total_contract_value || 0), 0) || 0,
    };

    return stats;
  } catch (error) {
    console.error('Error getting contract stats:', error);
    return {
      total: 0,
      active: 0,
      draft: 0,
      signed: 0,
      totalValue: 0,
    };
  }
};
