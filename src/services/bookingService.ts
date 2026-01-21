/**
 * Booking Service
 * Handles CRUD operations for scheduled cleaning jobs
 */

import { supabase, isSupabaseConfigured, Booking, Database } from '../lib/supabaseClient';

type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

const BOOKINGS_STORAGE_KEY = 'cleanUpBrosBookings';

// ==================== MAIN FUNCTIONS ====================

export const getBookings = async (): Promise<Booking[]> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: true });

      if (error) {
        console.error('Supabase fetch error:', error);
        return getFromLocalStorage();
      }

      return data as Booking[];
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      return getFromLocalStorage();
    }
  }
  return getFromLocalStorage();
};

export const getBookingById = async (id: string): Promise<Booking | null> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) return null;
      return data as Booking;
    } catch {
      return null;
    }
  }

  const bookings = getFromLocalStorage();
  return bookings.find(b => b.id === id) || null;
};

export const createBooking = async (booking: BookingInsert): Promise<Booking | null> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert(booking)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        return null;
      }

      return data as Booking;
    } catch (error) {
      console.error('Failed to create booking:', error);
      return null;
    }
  }

  // localStorage fallback
  const newBooking: Booking = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    submission_id: booking.submission_id || null,
    customer_id: booking.customer_id || null,
    booking_date: booking.booking_date,
    start_time: booking.start_time || null,
    end_time: booking.end_time || null,
    service_type: booking.service_type,
    address: booking.address,
    suburb: booking.suburb || null,
    bedrooms: booking.bedrooms || null,
    bathrooms: booking.bathrooms || null,
    add_ons: booking.add_ons || [],
    special_instructions: booking.special_instructions || null,
    assigned_to: booking.assigned_to || null,
    assigned_team: booking.assigned_team || [],
    status: booking.status || 'scheduled',
    quoted_price: booking.quoted_price || null,
    final_price: booking.final_price || null,
    deposit_amount: booking.deposit_amount || null,
    deposit_paid: booking.deposit_paid || false,
    completed_at: booking.completed_at || null,
    completion_notes: booking.completion_notes || null,
    photos_before: booking.photos_before || [],
    photos_after: booking.photos_after || [],
    customer_signature: booking.customer_signature || null,
    payment_status: booking.payment_status || 'pending',
    payment_method: booking.payment_method || null,
    invoice_id: booking.invoice_id || null,
  };

  const bookings = getFromLocalStorage();
  bookings.push(newBooking);
  saveToLocalStorage(bookings);
  return newBooking;
};

export const updateBooking = async (id: string, updates: BookingUpdate): Promise<Booking | null> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        return null;
      }

      return data as Booking;
    } catch (error) {
      console.error('Failed to update booking:', error);
      return null;
    }
  }

  // localStorage fallback
  const bookings = getFromLocalStorage();
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) return null;

  bookings[index] = { ...bookings[index], ...updates };
  saveToLocalStorage(bookings);
  return bookings[index];
};

export const deleteBooking = async (id: string): Promise<boolean> => {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete booking:', error);
      return false;
    }
  }

  const bookings = getFromLocalStorage();
  const filtered = bookings.filter(b => b.id !== id);
  saveToLocalStorage(filtered);
  return true;
};

// ==================== QUERY HELPERS ====================

export const getBookingsByDate = async (date: string): Promise<Booking[]> => {
  const bookings = await getBookings();
  return bookings.filter(b => b.booking_date === date);
};

export const getBookingsByDateRange = async (startDate: string, endDate: string): Promise<Booking[]> => {
  const bookings = await getBookings();
  return bookings.filter(b => b.booking_date >= startDate && b.booking_date <= endDate);
};

export const getBookingsByStatus = async (status: Booking['status']): Promise<Booking[]> => {
  const bookings = await getBookings();
  return bookings.filter(b => b.status === status);
};

export const getBookingsByTeamMember = async (teamMemberId: string): Promise<Booking[]> => {
  const bookings = await getBookings();
  return bookings.filter(b =>
    b.assigned_to === teamMemberId || b.assigned_team.includes(teamMemberId)
  );
};

export const getUpcomingBookings = async (limit = 10): Promise<Booking[]> => {
  const today = new Date().toISOString().split('T')[0];
  const bookings = await getBookings();
  return bookings
    .filter(b => b.booking_date >= today && b.status === 'scheduled')
    .slice(0, limit);
};

export const getTodaysBookings = async (): Promise<Booking[]> => {
  const today = new Date().toISOString().split('T')[0];
  return getBookingsByDate(today);
};

// ==================== STATUS UPDATES ====================

export const assignCleaner = async (bookingId: string, cleanerId: string): Promise<Booking | null> => {
  return updateBooking(bookingId, { assigned_to: cleanerId });
};

export const assignTeam = async (bookingId: string, teamIds: string[]): Promise<Booking | null> => {
  return updateBooking(bookingId, { assigned_team: teamIds });
};

export const startJob = async (bookingId: string): Promise<Booking | null> => {
  return updateBooking(bookingId, { status: 'in_progress' });
};

export const completeJob = async (
  bookingId: string,
  notes?: string,
  photosAfter?: string[]
): Promise<Booking | null> => {
  return updateBooking(bookingId, {
    status: 'completed',
    completed_at: new Date().toISOString(),
    completion_notes: notes || null,
    photos_after: photosAfter || [],
  });
};

export const cancelBooking = async (bookingId: string, reason?: string): Promise<Booking | null> => {
  return updateBooking(bookingId, {
    status: 'cancelled',
    completion_notes: reason || null,
  });
};

export const rescheduleBooking = async (
  bookingId: string,
  newDate: string,
  newTime?: string
): Promise<Booking | null> => {
  return updateBooking(bookingId, {
    status: 'rescheduled',
    booking_date: newDate,
    start_time: newTime || null,
  });
};

// ==================== LOCAL STORAGE FALLBACK ====================

const getFromLocalStorage = (): Booking[] => {
  try {
    const data = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToLocalStorage = (bookings: Booking[]): void => {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
};
