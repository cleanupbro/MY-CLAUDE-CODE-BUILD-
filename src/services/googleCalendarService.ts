/**
 * Google Calendar Service - Clean Up Bros
 * Handles calendar operations via N8N webhooks or direct Google Calendar API
 *
 * Created: January 22, 2026
 *
 * NOTE: For direct Google Calendar API integration, OAuth credentials are required:
 * - GOOGLE_CLIENT_ID: 413720620340-sjdjintjejfvc3uu6oo3g6usaldntj99.apps.googleusercontent.com
 * - GOOGLE_CLIENT_SECRET: (stored in .env.local)
 */

const N8N_BASE = 'https://nioctibinu.online';

// N8N Webhook endpoints for calendar operations
const CALENDAR_WEBHOOKS = {
  CREATE_EVENT: `${N8N_BASE}/webhook/calendar-create-event`,
  UPDATE_EVENT: `${N8N_BASE}/webhook/calendar-update-event`,
  DELETE_EVENT: `${N8N_BASE}/webhook/calendar-delete-event`,
  GET_AVAILABILITY: `${N8N_BASE}/webhook/calendar-availability`,
  LIST_EVENTS: `${N8N_BASE}/webhook/calendar-list-events`,
};

// Calendar event types
export type CalendarEventType = 'booking' | 'reminder' | 'team_meeting' | 'site_inspection';

export interface CalendarBookingData {
  referenceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address: string;
  suburb?: string;
  serviceType: string;
  bookingDate: string; // ISO date string (YYYY-MM-DD)
  startTime: string;   // 24h format (HH:MM)
  endTime?: string;    // Optional, calculated based on service
  cleanerName?: string;
  cleanerEmail?: string;
  bedrooms?: number;
  bathrooms?: number;
  addOns?: string[];
  specialInstructions?: string;
  price?: number;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description: string;
  location: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: 'needsAction' | 'accepted' | 'declined' | 'tentative';
  }>;
  colorId?: string;
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

export interface TimeSlot {
  start: string;  // ISO datetime
  end: string;    // ISO datetime
  available: boolean;
}

/**
 * Estimate job duration based on service type and property size
 */
function estimateJobDuration(data: CalendarBookingData): number {
  const baseHours: Record<string, number> = {
    'General Clean': 2,
    'Deep Clean': 3.5,
    'End of Lease': 4,
    'Airbnb Turnover': 2,
    'Commercial': 3,
    'Move In/Out': 4,
  };

  let hours = baseHours[data.serviceType] || 3;

  // Add time for larger properties
  const bedrooms = data.bedrooms || 2;
  if (bedrooms > 3) hours += (bedrooms - 3) * 0.5;

  // Add time for add-ons
  const addOnTime: Record<string, number> = {
    'Inside Oven': 0.5,
    'Inside Fridge': 0.25,
    'Carpet Steam': 0.5,
    'Wall Washing': 0.5,
    'Balcony': 0.5,
    'Garage': 0.75,
  };

  if (data.addOns) {
    data.addOns.forEach(addon => {
      hours += addOnTime[addon] || 0.25;
    });
  }

  return hours;
}

/**
 * Create a booking event in Google Calendar
 */
export async function createBookingEvent(
  bookingData: CalendarBookingData
): Promise<{ success: boolean; eventId?: string; eventLink?: string; error?: string }> {
  try {
    // Calculate end time if not provided
    const durationHours = estimateJobDuration(bookingData);
    const startDateTime = `${bookingData.bookingDate}T${bookingData.startTime}:00`;
    const endDateTime = bookingData.endTime
      ? `${bookingData.bookingDate}T${bookingData.endTime}:00`
      : calculateEndTime(startDateTime, durationHours);

    // Build event description
    const description = buildEventDescription(bookingData);

    // Build attendee list
    const attendees = [
      { email: bookingData.customerEmail, displayName: bookingData.customerName },
    ];

    if (bookingData.cleanerEmail) {
      attendees.push({
        email: bookingData.cleanerEmail,
        displayName: bookingData.cleanerName || 'Cleaner',
      });
    }

    const response = await fetch(CALENDAR_WEBHOOKS.CREATE_EVENT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'create',
        event: {
          summary: `🧹 ${bookingData.serviceType} - ${bookingData.customerName}`,
          description,
          location: bookingData.address,
          start: {
            dateTime: startDateTime,
            timeZone: 'Australia/Sydney',
          },
          end: {
            dateTime: endDateTime,
            timeZone: 'Australia/Sydney',
          },
          attendees,
          colorId: getColorIdForService(bookingData.serviceType),
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 1440 }, // 24 hours
              { method: 'popup', minutes: 60 },    // 1 hour
            ],
          },
        },
        metadata: {
          referenceId: bookingData.referenceId,
          serviceType: bookingData.serviceType,
          price: bookingData.price,
        },
        timestamp: new Date().toISOString(),
        source: 'cleanupbros-portal',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Calendar event creation failed:', errorText);
      return { success: false, error: errorText };
    }

    const result = await response.json();
    return {
      success: true,
      eventId: result.eventId,
      eventLink: result.htmlLink,
    };
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Update an existing booking event
 */
export async function updateBookingEvent(
  eventId: string,
  changes: Partial<CalendarBookingData>
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: Record<string, any> = {};

    if (changes.bookingDate || changes.startTime) {
      const date = changes.bookingDate || new Date().toISOString().split('T')[0];
      const time = changes.startTime || '09:00';
      updateData.start = {
        dateTime: `${date}T${time}:00`,
        timeZone: 'Australia/Sydney',
      };

      // Recalculate end time
      const durationHours = estimateJobDuration(changes as CalendarBookingData);
      updateData.end = {
        dateTime: calculateEndTime(`${date}T${time}:00`, durationHours),
        timeZone: 'Australia/Sydney',
      };
    }

    if (changes.address) {
      updateData.location = changes.address;
    }

    if (changes.customerName || changes.serviceType) {
      updateData.summary = `🧹 ${changes.serviceType || 'Cleaning'} - ${changes.customerName || 'Customer'}`;
    }

    if (changes.specialInstructions) {
      updateData.description = buildEventDescription(changes as CalendarBookingData);
    }

    const response = await fetch(CALENDAR_WEBHOOKS.UPDATE_EVENT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'update',
        eventId,
        updates: updateData,
        timestamp: new Date().toISOString(),
        source: 'cleanupbros-portal',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Calendar event update failed:', errorText);
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating calendar event:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Delete/Cancel a booking event
 */
export async function deleteBookingEvent(
  eventId: string,
  sendNotifications: boolean = true
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(CALENDAR_WEBHOOKS.DELETE_EVENT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'delete',
        eventId,
        sendNotifications,
        timestamp: new Date().toISOString(),
        source: 'cleanupbros-portal',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Calendar event deletion failed:', errorText);
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Get available time slots for a specific date
 */
export async function getAvailableSlots(
  date: string, // YYYY-MM-DD format
  durationHours: number = 3
): Promise<{ success: boolean; slots?: TimeSlot[]; error?: string }> {
  try {
    const response = await fetch(CALENDAR_WEBHOOKS.GET_AVAILABILITY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'get_availability',
        date,
        durationMinutes: durationHours * 60,
        businessHours: {
          start: '07:00',
          end: '18:00',
        },
        timestamp: new Date().toISOString(),
        source: 'cleanupbros-portal',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Availability check failed:', errorText);
      return { success: false, error: errorText };
    }

    const result = await response.json();
    return { success: true, slots: result.slots };
  } catch (error) {
    console.error('Error getting available slots:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Get list of bookings for a date range
 */
export async function getBookingsInRange(
  startDate: string,
  endDate: string
): Promise<{ success: boolean; events?: CalendarEvent[]; error?: string }> {
  try {
    const response = await fetch(CALENDAR_WEBHOOKS.LIST_EVENTS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'list',
        timeMin: `${startDate}T00:00:00+11:00`,
        timeMax: `${endDate}T23:59:59+11:00`,
        timestamp: new Date().toISOString(),
        source: 'cleanupbros-portal',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Event listing failed:', errorText);
      return { success: false, error: errorText };
    }

    const result = await response.json();
    return { success: true, events: result.events };
  } catch (error) {
    console.error('Error listing calendar events:', error);
    return { success: false, error: String(error) };
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Calculate end time given start time and duration
 */
function calculateEndTime(startDateTime: string, durationHours: number): string {
  const start = new Date(startDateTime);
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);
  return end.toISOString().replace('Z', '');
}

/**
 * Get Google Calendar color ID based on service type
 * Color IDs: 1=Lavender, 2=Sage, 3=Grape, 4=Flamingo, 5=Banana,
 *            6=Tangerine, 7=Peacock, 8=Graphite, 9=Blueberry, 10=Basil, 11=Tomato
 */
function getColorIdForService(serviceType: string): string {
  const colors: Record<string, string> = {
    'General Clean': '2',     // Sage (green)
    'Deep Clean': '9',        // Blueberry (blue)
    'End of Lease': '11',     // Tomato (red) - urgent
    'Airbnb Turnover': '6',   // Tangerine (orange)
    'Commercial': '7',        // Peacock (teal)
    'Move In/Out': '3',       // Grape (purple)
  };
  return colors[serviceType] || '2';
}

/**
 * Build event description from booking data
 */
function buildEventDescription(data: CalendarBookingData): string {
  const lines: string[] = [
    `📋 BOOKING DETAILS`,
    `────────────────────`,
    `Reference: ${data.referenceId || 'N/A'}`,
    `Service: ${data.serviceType}`,
    ``,
    `👤 CUSTOMER`,
    `Name: ${data.customerName}`,
    `Email: ${data.customerEmail}`,
    data.customerPhone ? `Phone: ${data.customerPhone}` : '',
    ``,
    `📍 LOCATION`,
    `Address: ${data.address}`,
    data.suburb ? `Suburb: ${data.suburb}` : '',
    ``,
    `🏠 PROPERTY`,
    data.bedrooms ? `Bedrooms: ${data.bedrooms}` : '',
    data.bathrooms ? `Bathrooms: ${data.bathrooms}` : '',
    ``,
  ];

  if (data.addOns && data.addOns.length > 0) {
    lines.push(`➕ ADD-ONS`);
    data.addOns.forEach(addon => lines.push(`• ${addon}`));
    lines.push('');
  }

  if (data.specialInstructions) {
    lines.push(`📝 SPECIAL INSTRUCTIONS`);
    lines.push(data.specialInstructions);
    lines.push('');
  }

  if (data.price) {
    lines.push(`💰 PRICE: $${data.price.toFixed(2)}`);
  }

  lines.push(``, `────────────────────`);
  lines.push(`Clean Up Bros | +61 406 764 585`);

  return lines.filter(line => line !== '').join('\n');
}

export default {
  createBookingEvent,
  updateBookingEvent,
  deleteBookingEvent,
  getAvailableSlots,
  getBookingsInRange,
};
