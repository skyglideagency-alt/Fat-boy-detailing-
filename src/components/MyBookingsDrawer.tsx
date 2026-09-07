import React from 'react';
import { X, Calendar as CalendarIcon, Clock, MapPin, Download, Trash2, Phone, AlertCircle, BookmarkCheck } from 'lucide-react';
import { AppointmentBooking } from '../types';
import { createGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';
import { BUSINESS_INFO } from '../data/servicesData';

interface MyBookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: AppointmentBooking[];
  onCancelBooking: (id: string) => void;
  onNewBookingClick: () => void;
}

export const MyBookingsDrawer: React.FC<MyBookingsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onNewBookingClick,
}) => {
  if (!isOpen) return null;

  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const pastOrCancelledBookings = bookings.filter((b) => b.status === 'cancelled');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0a0c12] border-l border-slate-800 h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 bg-[#0d1017] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookmarkCheck className="w-5 h-5 text-[#00e676]" />
            <div>
              <h3 className="font-racing font-bold text-base text-white uppercase tracking-wide">
                My Scheduled Sessions
              </h3>
              <p className="text-[11px] text-slate-400">
                {activeBookings.length} Active {activeBookings.length === 1 ? 'Appointment' : 'Appointments'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeBookings.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <CalendarIcon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-racing font-bold text-base text-white uppercase">
                  No Appointments Scheduled
                </h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  You haven't scheduled an auto detailing session yet. Choose a service and pick an open slot on our calendar!
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onNewBookingClick();
                }}
                className="px-5 py-2.5 rounded-xl bg-[#00e676] text-black font-racing font-bold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer"
              >
                Schedule An Appointment
              </button>
            </div>
          ) : (
            activeBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-slate-800 bg-[#0c0f18] space-y-3 relative group"
              >
                {/* Header with Reference & Status */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-racing font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded">
                      {b.bookingRef}
                    </span>
                    <span className="text-xs font-racing font-bold text-white uppercase">
                      {b.serviceName}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#00e676] uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e676] animate-pulse" />
                    Confirmed
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#00e676]" />
                    <span>
                      {new Date(b.date.replace(/-/g, '/')).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="font-bold text-white">{b.timeSlot}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Est. {Math.floor(b.estimatedDurationMinutes / 60)}h {b.estimatedDurationMinutes % 60 > 0 ? `${b.estimatedDurationMinutes % 60}m` : ''}</span>
                    <span className="text-slate-600">•</span>
                    <span className="font-bold text-[#00e676]">${b.totalPrice}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{b.address || 'Wichita, KS'}</span>
                  </div>
                </div>

                {/* Calendar Sync Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <a
                    href={createGoogleCalendarUrl(b)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-700 text-center text-[10px] font-racing uppercase font-bold text-slate-300 hover:text-white hover:border-emerald-500"
                  >
                    Google Cal
                  </a>

                  <button
                    onClick={() => downloadIcsFile(b)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-700 text-center text-[10px] font-racing uppercase font-bold text-slate-300 hover:text-white hover:border-emerald-500"
                  >
                    Apple / .ICS
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Cancel appointment ${b.bookingRef}?`)) {
                        onCancelBooking(b.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-950/40"
                    title="Cancel Appointment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Past / Cancelled section if any */}
          {pastOrCancelledBookings.length > 0 && (
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] font-racing uppercase tracking-wider text-slate-500">
                Cancelled / Inactive
              </span>
              {pastOrCancelledBookings.map((b) => (
                <div key={b.id} className="p-3 rounded-lg bg-black/40 border border-slate-900 text-xs text-slate-500 flex justify-between">
                  <span>{b.bookingRef} - {b.serviceName}</span>
                  <span className="text-red-500 text-[10px] uppercase font-bold">Cancelled</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0d1017] space-y-2">
          <a
            href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
            className="w-full py-2.5 px-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 font-racing text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-red-900/60"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Need Help? Call (316) 214-3829</span>
          </a>
        </div>

      </div>
    </div>
  );
};
