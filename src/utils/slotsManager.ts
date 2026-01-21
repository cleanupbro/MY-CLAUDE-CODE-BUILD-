/**
 * Shared Slots Manager
 * Provides consistent slot tracking across all components
 * - Resets to 10 every 12 hours
 * - Decreases when bookings happen
 * - Persists in localStorage
 */

const SLOTS_KEY = 'cleanupbros_slots';
const SLOTS_RESET_KEY = 'cleanupbros_slots_reset';
const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

export interface SlotsData {
  slots: number;
  lastReset: number;
}

// Get current slots data from localStorage
export const getSlotsData = (): SlotsData => {
  try {
    const slots = parseInt(localStorage.getItem(SLOTS_KEY) || '10', 10);
    const lastReset = parseInt(localStorage.getItem(SLOTS_RESET_KEY) || '0', 10);
    return { slots, lastReset };
  } catch {
    return { slots: 10, lastReset: 0 };
  }
};

// Save slots data to localStorage
export const setSlotsData = (slots: number, lastReset: number): void => {
  try {
    localStorage.setItem(SLOTS_KEY, String(Math.max(1, Math.min(10, slots))));
    localStorage.setItem(SLOTS_RESET_KEY, String(lastReset));
  } catch {
    // localStorage not available
  }
};

// Get current available slots (with auto-reset after 12 hours)
export const getAvailableSlots = (): number => {
  const { slots, lastReset } = getSlotsData();
  const now = Date.now();

  // Check if 12 hours have passed - reset slots
  if (lastReset === 0 || now - lastReset >= TWELVE_HOURS_MS) {
    setSlotsData(10, now);
    return 10;
  }

  return Math.max(1, slots);
};

// Decrease slots by 1 (called when a booking popup shows)
export const decrementSlots = (): number => {
  const { slots, lastReset } = getSlotsData();
  const now = Date.now();

  // Reset if 12 hours passed
  if (lastReset === 0 || now - lastReset >= TWELVE_HOURS_MS) {
    setSlotsData(10, now);
    return 10;
  }

  const newSlots = Math.max(1, slots - 1);
  setSlotsData(newSlots, lastReset);
  return newSlots;
};

// Get urgency level based on slots
export const getUrgencyLevel = (slots: number): 'high' | 'medium' | 'low' => {
  if (slots <= 3) return 'high';
  if (slots <= 6) return 'medium';
  return 'low';
};

// Subscribe to slot changes (for real-time updates)
let listeners: Array<(slots: number) => void> = [];

export const subscribeToSlots = (callback: (slots: number) => void): (() => void) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
};

export const notifySlotChange = (slots: number): void => {
  listeners.forEach(l => l(slots));
};
