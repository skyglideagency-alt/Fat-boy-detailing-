import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PhoneCall, ArrowRight } from 'lucide-react';
import { InteractiveCalendar } from './InteractiveCalendar';
import { AppointmentBooking } from '../types';
import { BUSINESS_INFO } from '../data/servicesData';

interface CalendarSectionProps {
  onScheduleSlot: (date: string, timeSlot: string) => void;
  existingBookings: AppointmentBooking[];
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  onScheduleSlot,
  existingBookings,
}) => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:30 AM');

  return (
    <section id="calendar-section" className="py-20 bg-[#07090e] relative border-t border-slate-800">
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with scroll animation */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider font-racing">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            Live Scheduling
          </div>

          <h2 className="text-3xl sm:text-5xl font-racing font-bold uppercase tracking-tight text-white">
            Schedule An <span className="text-[#00e676]">Appointment</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base">
            Select an open slot. Instant confirmation with 1-tap Google & Apple Calendar sync.
          </p>
        </motion.div>

        {/* Embedded Interactive Calendar with smooth fade-in */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-5xl mx-auto"
        >
          <InteractiveCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedTimeSlot={selectedTimeSlot}
            onSelectTimeSlot={setSelectedTimeSlot}
            existingBookings={existingBookings}
            durationMinutes={150}
          />

          {/* Quick Schedule Confirmation Action Bar */}
          <div className="mt-6 p-5 rounded-2xl bg-[#0b0e17] border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-racing uppercase tracking-wider text-slate-400 block">
                Selected Time Slot
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-racing font-bold text-white">
                  {new Date(selectedDate.replace(/-/g, '/')).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-lg font-racing font-bold text-[#00e676]">
                  {selectedTimeSlot}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
                className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-red-500/50 text-slate-300 font-racing text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                <span>Call Us</span>
              </a>

              <motion.button
                id="book-selected-slot-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onScheduleSlot(selectedDate, selectedTimeSlot)}
                className="flex-1 sm:flex-none py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-[#00e676] to-emerald-400 text-black font-racing font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book This Slot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
