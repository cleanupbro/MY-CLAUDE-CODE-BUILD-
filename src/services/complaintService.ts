/**
 * Complaint Service
 * Handles CRUD operations for customer complaints and issues
 */

import { supabase, isSupabaseConfigured, Complaint, Database } from '../lib/supabaseClient';

type ComplaintInsert = Database['public']['Tables']['complaints']['Insert'];
type ComplaintUpdate = Database['public']['Tables']['complaints']['Update'];

const COMPLAINTS_STORAGE_KEY = 'cleanUpBrosComplaints';

// ==================== MAIN FUNCTIONS ====================

export const getComplaints = async (): Promise<Complaint[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch error:', error);
        return getFromLocalStorage();
      }

      return data as Complaint[];
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      return getFromLocalStorage();
    }
  }
  return getFromLocalStorage();
};

export const getComplaintById = async (id: string): Promise<Complaint | null> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return null;
      return data as Complaint;
    } catch {
      return null;
    }
  }

  const complaints = getFromLocalStorage();
  return complaints.find(c => c.id === id) || null;
};

export const createComplaint = async (complaint: ComplaintInsert): Promise<Complaint | null> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .insert(complaint)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        return null;
      }

      return data as Complaint;
    } catch (error) {
      console.error('Failed to create complaint:', error);
      return null;
    }
  }

  // localStorage fallback
  const newComplaint: Complaint = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    customer_id: complaint.customer_id || null,
    booking_id: complaint.booking_id || null,
    type: complaint.type,
    description: complaint.description,
    photos: complaint.photos || [],
    status: complaint.status || 'open',
    priority: complaint.priority || 'medium',
    assigned_to: complaint.assigned_to || null,
    resolution: complaint.resolution || null,
    resolved_at: complaint.resolved_at || null,
    refund_amount: complaint.refund_amount || null,
    reclean_offered: complaint.reclean_offered || false,
    reclean_completed: complaint.reclean_completed || false,
  };

  const complaints = getFromLocalStorage();
  complaints.push(newComplaint);
  saveToLocalStorage(complaints);
  return newComplaint;
};

export const updateComplaint = async (id: string, updates: ComplaintUpdate): Promise<Complaint | null> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        return null;
      }

      return data as Complaint;
    } catch (error) {
      console.error('Failed to update complaint:', error);
      return null;
    }
  }

  // localStorage fallback
  const complaints = getFromLocalStorage();
  const index = complaints.findIndex(c => c.id === id);
  if (index === -1) return null;

  complaints[index] = { ...complaints[index], ...updates };
  saveToLocalStorage(complaints);
  return complaints[index];
};

export const deleteComplaint = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete complaint:', error);
      return false;
    }
  }

  const complaints = getFromLocalStorage();
  const filtered = complaints.filter(c => c.id !== id);
  saveToLocalStorage(filtered);
  return true;
};

// ==================== QUERY HELPERS ====================

export const getOpenComplaints = async (): Promise<Complaint[]> => {
  const complaints = await getComplaints();
  return complaints.filter(c => c.status === 'open' || c.status === 'investigating');
};

export const getComplaintsByStatus = async (status: Complaint['status']): Promise<Complaint[]> => {
  const complaints = await getComplaints();
  return complaints.filter(c => c.status === status);
};

export const getComplaintsByPriority = async (priority: Complaint['priority']): Promise<Complaint[]> => {
  const complaints = await getComplaints();
  return complaints.filter(c => c.priority === priority);
};

export const getComplaintsByType = async (type: Complaint['type']): Promise<Complaint[]> => {
  const complaints = await getComplaints();
  return complaints.filter(c => c.type === type);
};

export const getComplaintsByBooking = async (bookingId: string): Promise<Complaint[]> => {
  const complaints = await getComplaints();
  return complaints.filter(c => c.booking_id === bookingId);
};

export const getComplaintsByCustomer = async (customerId: string): Promise<Complaint[]> => {
  const complaints = await getComplaints();
  return complaints.filter(c => c.customer_id === customerId);
};

export const getUrgentComplaints = async (): Promise<Complaint[]> => {
  const complaints = await getOpenComplaints();
  return complaints.filter(c => c.priority === 'urgent' || c.priority === 'high');
};

// ==================== STATUS WORKFLOW ====================

export const assignComplaint = async (complaintId: string, staffId: string): Promise<Complaint | null> => {
  return updateComplaint(complaintId, {
    assigned_to: staffId,
    status: 'investigating',
  });
};

export const startInvestigation = async (complaintId: string): Promise<Complaint | null> => {
  return updateComplaint(complaintId, { status: 'investigating' });
};

export const resolveComplaint = async (
  complaintId: string,
  resolution: string,
  refundAmount?: number,
  recleanOffered?: boolean
): Promise<Complaint | null> => {
  return updateComplaint(complaintId, {
    status: 'resolved',
    resolution,
    resolved_at: new Date().toISOString(),
    refund_amount: refundAmount || null,
    reclean_offered: recleanOffered || false,
  });
};

export const closeComplaint = async (complaintId: string): Promise<Complaint | null> => {
  return updateComplaint(complaintId, { status: 'closed' });
};

export const markRecleanCompleted = async (complaintId: string): Promise<Complaint | null> => {
  return updateComplaint(complaintId, { reclean_completed: true });
};

export const escalateComplaint = async (complaintId: string): Promise<Complaint | null> => {
  return updateComplaint(complaintId, { priority: 'urgent' });
};

// ==================== ANALYTICS HELPERS ====================

export const getComplaintStats = async (): Promise<{
  total: number;
  open: number;
  resolved: number;
  avgResolutionDays: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}> => {
  const complaints = await getComplaints();

  const open = complaints.filter(c => c.status === 'open' || c.status === 'investigating').length;
  const resolved = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;

  // Calculate average resolution time
  const resolvedWithDates = complaints.filter(c => c.resolved_at && c.created_at);
  const totalDays = resolvedWithDates.reduce((acc, c) => {
    const created = new Date(c.created_at);
    const resolvedDate = new Date(c.resolved_at!);
    return acc + Math.ceil((resolvedDate.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }, 0);
  const avgResolutionDays = resolvedWithDates.length > 0 ? totalDays / resolvedWithDates.length : 0;

  // Count by type
  const byType: Record<string, number> = {};
  complaints.forEach(c => {
    byType[c.type] = (byType[c.type] || 0) + 1;
  });

  // Count by priority
  const byPriority: Record<string, number> = {};
  complaints.forEach(c => {
    byPriority[c.priority] = (byPriority[c.priority] || 0) + 1;
  });

  return {
    total: complaints.length,
    open,
    resolved,
    avgResolutionDays: Math.round(avgResolutionDays * 10) / 10,
    byType,
    byPriority,
  };
};

// ==================== LOCAL STORAGE FALLBACK ====================

const getFromLocalStorage = (): Complaint[] => {
  try {
    const data = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (complaints: Complaint[]): void => {
  localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(complaints));
};
