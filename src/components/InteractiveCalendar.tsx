import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import { TimeSlot, AppointmentBooking } from '../types';
import { getSlotsForDate } from '../utils/calendarUtils';

interface InteractiveCalendarProps {
  selectedDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
  selectedTimeSlot: string; // "09:30 AM"
  onSelectTimeSlot: (slot: string) => void;
  existingBookings: AppointmentBooking[];
  durationMinutes: number;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  selectedDate,
  onSelectDate,
  selectedTimeSlot,
  onSelectTimeSlot,
  existingBookings,
  durationMinutes,
}) => {
  // Calendar current browsing view
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  // Format today as YYYY-MM-DD
  const pad = (n: number) => n.toString().padStart(2, '0');
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  // Month labels
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    onSelectDate(todayStr);
  };

  // Build calendar matrix
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Slots for the currently selected date
  const availableSlots: TimeSlot[] = getSlotsForDate(selectedDate, existingBookings);

  // Calculate completion time based on selected slot + duration
  const getCompletionTime = (timeStr: string, minutes: number) => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return '';
    let h = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (period === 'PM' && h < 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;

    const totalMinutes = h * 60 + m + minutes;
    let endHour = Math.floor(totalMinutes / 60) % 24;
    const endMin = totalMinutes % 60;
    const endPeriod = endHour >= 12 ? 'PM' : 'AM';
    const displayHour = endHour % 12 === 0 ? 12 : endHour % 12;
    return `${displayHour}:${pad(endMin)} ${endPeriod}`;
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Month Grid */}
        <div className="lg:col-span-7 bg-[#0c0e15] border border-slate-800/90 rounded-2xl p-3.5 sm:p-5 shadow-xl overflow-hidden">
          
          {/* Header Month / Year & Controls */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#00e676]" />
              <h3 className="font-racing font-bold text-lg text-white uppercase tracking-wide">
                {monthNames[currentMonth]} {currentYear}
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleJumpToToday}
                className="px-2.5 py-1 text-xs font-racing font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer mr-1"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next Month"
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
              <div
                key={day}
                className={`text-[11px] font-racing font-bold uppercase py-1 ${
                  idx === 0 || idx === 6 ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Day Cells Matrix */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Previous month padding cells */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayOfMonth + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="h-12 rounded-xl flex items-center justify-center text-xs text-slate-700 opacity-40 select-none bg-black/20"
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${currentYear}-${pad(currentMonth + 1)}-${pad(dayNum)}`;
              const isSelected = selectedDate === dateStr;
              const isToday = todayStr === dateStr;
              const isPast = dateStr < todayStr;

              // Check slots count for this day
              const slots = isPast ? [] : getSlotsForDate(dateStr, existingBookings);
              const availableCount = slots.filter((s) => s.available).length;

              return (
                <button
                  key={dateStr}
                  type="button"
                  disabled={isPast}
                  onClick={() => {
                    onSelectDate(dateStr);
                    // auto pick first available slot if currently selected is not valid on this date
                    const firstAvail = slots.find((s) => s.available);
                    if (firstAvail) {
                      onSelectTimeSlot(firstAvail.time);
                    }
                  }}
                  className={`relative h-12 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isPast
                      ? 'border-transparent text-slate-700 opacity-30 cursor-not-allowed bg-black/10'
                      : isSelected
                      ? 'border-[#00e676] bg-emerald-950/60 text-white font-bold shadow-lg shadow-emerald-500/20 scale-[1.03] z-10'
                      : isToday
                      ? 'border-red-500/60 bg-red-950/20 text-white hover:border-red-400'
                      : 'border-slate-800/80 bg-slate-900/50 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                >
                  <span className={`text-xs font-racing ${isSelected ? 'text-[#00e676] font-bold' : ''}`}>
                    {dayNum}
                  </span>

                  {!isPast && (
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {isToday && (
                        <span className="text-[8px] font-bold text-red-400 uppercase tracking-tighter">
                          Today
                        </span>
                      )}
                      {!isToday && availableCount > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00e676]" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-4 mt-4 border-t border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00e676]" />
              <span>Available Slots</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Today's Open Spots</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-700" />
              <span>Unavailable</span>
            </div>
          </div>
        </div>

        {/* Right Column: Time Slot Selection */}
        <div className="lg:col-span-5 bg-[#0c0e15] border border-slate-800/90 rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between shadow-xl overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#00e676]" />
                <h4 className="font-racing font-bold text-base text-white uppercase tracking-wide">
                  Available Start Times
                </h4>
              </div>
              <span className="text-xs font-semibold text-emerald-400">
                {selectedDate === todayStr ? 'Open Today' : selectedDate}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Select your preferred appointment start time for{' '}
              <strong className="text-white">
                {new Date(selectedDate.replace(/-/g, '/')).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </strong>:
            </p>

            {/* Time Slot Chips Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {availableSlots.map((slot) => {
                const isSelected = selectedTimeSlot === slot.time;
                const isAvailable = slot.available;

                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => onSelectTimeSlot(slot.time)}
                    className={`py-3 px-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      !isAvailable
                        ? 'border-slate-800/60 bg-black/30 text-slate-600 cursor-not-allowed'
                        : isSelected
                        ? 'border-[#00e676] bg-emerald-950/70 text-white font-bold shadow-lg shadow-emerald-500/20 scale-[1.02]'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                    }`}
                  >
                    <span className={`text-xs font-racing font-bold tracking-wide ${isSelected ? 'text-[#00e676]' : ''}`}>
                      {slot.time}
                    </span>
                    <span className="text-[10px] mt-0.5 text-slate-400 font-medium">
                      {isAvailable ? (
                        isSelected ? 'Selected' : 'Open Slot'
                      ) : (
                        'Booked'
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time & Duration Summary Badge */}
          {selectedTimeSlot && (
            <div className="mt-5 p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-racing uppercase tracking-wider text-slate-400 block">
                  Session Schedule
                </span>
                <span className="text-xs font-bold text-white">
                  {selectedTimeSlot} → ~{getCompletionTime(selectedTimeSlot, durationMinutes)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-racing uppercase tracking-wider text-slate-400 block">
                  Estimated Time
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {Math.floor(durationMinutes / 60)}h {durationMinutes % 60 > 0 ? `${durationMinutes % 60}m` : ''}
                </span>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
