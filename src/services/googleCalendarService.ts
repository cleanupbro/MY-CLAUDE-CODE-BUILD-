/**
 * Google Calendar Service - Clean Up Bros
 * Handles calendar event management via direct API (no N8N required)
 *
 * Updated: February 2, 2026
 * Now uses /api/calendar/create-event endpoint
 */

// API endpoint for calendar operations
const CALENDAR_API = '/api/calendar/create-event';

export interface BookingEventData {
  referenceId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  address: string;
  serviceType: string;
  bookingDate: string;
  startTime: string;
  cleanerName?: string;
  specialInstructions?: string;
  price?: number;
  bedrooms?: number;
}

export interface CalendarResult {
  success: boolean;
  eventId?: string;
  htmlLink?: string;
  skipped?: boolean;
  error?: string;
}

/**
 * Create a calendar event for a booking
 */
export async function createBookingEvent(
  data: BookingEventData
): Promise<CalendarResult> {
  try {
    const response = await fetch(CALENDAR_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Calendar API error:', result);
      return { success: false, error: result.error || 'Calendar event creation failed' };
    }

    return {
      success: true,
      eventId: result.eventId,
      htmlLink: result.htmlLink,
      skipped: result.skipped,
    };
  } catch (error) {
    console.error('Calendar event error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Update an existing calendar event
 * Note: Requires eventId from initial creation
 */
export async function updateBookingEvent(
  eventId: string,
  data: Partial<BookingEventData>
): Promise<CalendarResult> {
  try {
    const response = await fetch(CALENDAR_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update',
        eventId,
        ...data,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Calendar update error:', result);
      return { success: false, error: result.error || 'Calendar event update failed' };
    }

    return {
      success: true,
      eventId: result.eventId,
      htmlLink: result.htmlLink,
    };
  } catch (error) {
    console.error('Calendar update error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Delete a calendar event
 * Note: Requires eventId from initial creation
 */
export async function deleteBookingEvent(
  eventId: string
): Promise<CalendarResult> {
  try {
    const response = await fetch(CALENDAR_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete',
        eventId,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Calendar delete error:', result);
      return { success: false, error: result.error || 'Calendar event deletion failed' };
    }

    return { success: true, eventId };
  } catch (error) {
    console.error('Calendar delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Get available time slots for a given date
 * Note: This is a placeholder - implement based on your availability rules
 */
export async function getAvailableSlots(
  date: string,
  serviceType?: string
): Promise<{ slots: string[]; error?: string }> {
  // Default slots - customize based on business hours
  const defaultSlots = [
    '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00'
  ];

  // In a full implementation, this would check the calendar for conflicts
  // For now, return all slots
  return { slots: defaultSlots };
}

/**
 * Get bookings for a date range
 * Note: Placeholder for admin dashboard view
 */
export async function getBookingsInRange(
  startDate: string,
  endDate: string
): Promise<{ events: any[]; error?: string }> {
  // This would query the calendar API for events
  // For now, return empty array - bookings are stored in Supabase
  return { events: [] };
}

export default {
  createBookingEvent,
  updateBookingEvent,
  deleteBookingEvent,
  getAvailableSlots,
  getBookingsInRange,
};
