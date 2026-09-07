import { TimeSlot, AppointmentBooking } from '../types';

export const TIME_SLOT_TEMPLATES: { time: string; hour: number; minute: number; period: 'morning' | 'afternoon' | 'evening' }[] = [
  { time: '08:00 AM', hour: 8, minute: 0, period: 'morning' },
  { time: '09:30 AM', hour: 9, minute: 30, period: 'morning' },
  { time: '11:00 AM', hour: 11, minute: 0, period: 'morning' },
  { time: '01:00 PM', hour: 13, minute: 0, period: 'afternoon' },
  { time: '02:30 PM', hour: 14, minute: 30, period: 'afternoon' },
  { time: '04:00 PM', hour: 16, minute: 0, period: 'afternoon' },
  { time: '05:30 PM', hour: 17, minute: 30, period: 'evening' },
];

/**
 * Returns pseudo-deterministic slot availability for a given date string (YYYY-MM-DD)
 * to maintain consistent slot availability across renders while supporting user bookings.
 */
export function getSlotsForDate(dateStr: string, existingBookings: AppointmentBooking[] = []): TimeSlot[] {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay(); // 0 is Sun, 6 is Sat

  // Check which slots are already booked by user in localStorage
  const bookedTimes = new Set(
    existingBookings
      .filter((b) => b.date === dateStr && b.status !== 'cancelled')
      .map((b) => b.timeSlot)
  );

  return TIME_SLOT_TEMPLATES.map((slot, idx) => {
    // If booked by user, it is unavailable
    if (bookedTimes.has(slot.time)) {
      return {
        id: `${dateStr}-${slot.time}`,
        ...slot,
        available: false,
      };
    }

    // Seeded simulated availability:
    // Today has open spots as advertised ("WE HAVE OPEN SPOTS FOR TODAY")
    const hash = (year * 365 + month * 31 + day * 7 + idx * 13 + dayOfWeek * 5) % 10;
    // Slots are available except ~1-2 slots per day that are "booked" by other customers
    const isMockBooked = hash === 1 || hash === 4;

    return {
      id: `${dateStr}-${slot.time}`,
      ...slot,
      available: !isMockBooked,
    };
  });
}

/**
 * Generate Google Calendar URL
 */
export function createGoogleCalendarUrl(booking: AppointmentBooking): string {
  const [year, month, day] = booking.date.split('-').map(Number);
  const timeParts = booking.timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  
  let startHour = 9;
  let startMin = 0;
  if (timeParts) {
    let h = parseInt(timeParts[1], 10);
    const m = parseInt(timeParts[2], 10);
    const period = timeParts[3].toUpperCase();
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    startHour = h;
    startMin = m;
  }

  const startDate = new Date(year, month - 1, day, startHour, startMin);
  const endDate = new Date(startDate.getTime() + (booking.estimatedDurationMinutes || 120) * 60 * 1000);

  const formatIso = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d+/g, '');

  const title = encodeURIComponent(`Fatboy Detailing - ${booking.serviceName}`);
  const details = encodeURIComponent(
    `Auto Detailing Appointment with Fatboy Detailing\n` +
    `Confirmation Ref: ${booking.bookingRef}\n` +
    `Vehicle: ${booking.vehicleYear} ${booking.vehicleMake} ${booking.vehicleModel} (${booking.vehicleColor})\n` +
    `Service: ${booking.serviceName} ($${booking.totalPrice})\n` +
    `Service Mode: ${booking.serviceMode === 'mobile' ? `Mobile Service at: ${booking.address || 'Wichita area'}` : 'Shop Drop-off in Wichita, KS'}\n` +
    `Detailer Phone: (316) 214-3829\n` +
    `"Done with heart, soul, and love"`
  );
  const location = encodeURIComponent(booking.address || 'Wichita, Kansas');
  const dates = `${formatIso(startDate)}/${formatIso(endDate)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

/**
 * Download .ICS file for Apple Calendar, Outlook, Mobile
 */
export function downloadIcsFile(booking: AppointmentBooking): void {
  const [year, month, day] = booking.date.split('-').map(Number);
  const timeParts = booking.timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  
  let startHour = 9;
  let startMin = 0;
  if (timeParts) {
    let h = parseInt(timeParts[1], 10);
    const m = parseInt(timeParts[2], 10);
    const period = timeParts[3].toUpperCase();
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    startHour = h;
    startMin = m;
  }

  const startDate = new Date(year, month - 1, day, startHour, startMin);
  const endDate = new Date(startDate.getTime() + (booking.estimatedDurationMinutes || 120) * 60 * 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatUtc = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fatboy Detailing//Auto Detailing Appointment//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.bookingRef}-${Date.now()}@fatboydetailing.com`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART:${formatUtc(startDate)}`,
    `DTEND:${formatUtc(endDate)}`,
    `SUMMARY:Fatboy Detailing - ${booking.serviceName}`,
    `DESCRIPTION:Auto Detailing appointment for ${booking.vehicleYear} ${booking.vehicleMake} ${booking.vehicleModel}. Ref: ${booking.bookingRef}. Phone: (316) 214-3829.`,
    `LOCATION:${booking.address || 'Wichita, KS'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `fatboy-detailing-${booking.bookingRef}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Local storage manager for user's bookings
 */
const STORAGE_KEY = 'fatboy_detailing_user_bookings_v1';

export function loadSavedBookings(): AppointmentBooking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveBooking(booking: AppointmentBooking): void {
  try {
    const existing = loadSavedBookings();
    const updated = [booking, ...existing.filter((b) => b.id !== booking.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save booking', err);
  }
}

export function cancelBookingInStorage(id: string): void {
  try {
    const existing = loadSavedBookings();
    const updated = existing.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to cancel booking', err);
  }
}
