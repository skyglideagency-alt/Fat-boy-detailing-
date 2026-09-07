import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Phone, Sparkles, Clock, BookmarkCheck, Menu, X } from 'lucide-react';
import logoImg from '../assets/images/logo.jpg';
import { BUSINESS_INFO } from '../data/servicesData';
import { AppointmentBooking } from '../types';

interface NavbarProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenMyBookings: () => void;
  userBookings: AppointmentBooking[];
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBooking,
  onOpenMyBookings,
  userBookings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const activeBookingsCount = userBookings.filter((b) => b.status !== 'cancelled').length;

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08090d]/90 backdrop-blur-md"
    >
      {/* Clean Top Bar */}
      <div className="bg-gradient-to-r from-red-950/80 via-black to-emerald-950/80 border-b border-white/10 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-slate-200">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e676] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00e676]"></span>
            </span>
            <span className="text-white tracking-wide uppercase font-bold text-[11px]">
              Same-Day Detailing Slots Available in Wichita
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Clock className="w-3.5 h-3.5" /> 7 Days: 7:30 AM - 7:00 PM
            </span>
            <span>•</span>
            <a href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`} className="hover:text-white font-medium">
              Call/Text: {BUSINESS_INFO.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-xl overflow-hidden border border-emerald-500/40 bg-black shadow-lg shadow-emerald-500/10 transition-transform duration-300 group-hover:scale-105">
            <img
              src={logoImg}
              alt="Fatboy Detailing Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-racing text-2xl sm:text-3xl font-bold tracking-wider text-chrome uppercase">
                FATBOY
              </span>
              <span className="font-script text-2xl sm:text-3xl font-bold text-[#00e676] -rotate-6 transform drop-shadow-[0_2px_8px_rgba(0,230,118,0.7)]">
                Detailing
              </span>
            </div>
            <span className="text-[10px] tracking-widest text-slate-400 font-medium uppercase -mt-1">
              Wichita, KS • Precision Auto Care
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a
            href="#services"
            className="hover:text-[#00e676] transition-colors py-2"
          >
            Services & Pricing
          </a>
          <a
            href="#calendar-section"
            className="hover:text-[#00e676] transition-colors py-2 flex items-center gap-1.5 text-slate-200"
          >
            <Calendar className="w-4 h-4 text-[#00e676]" />
            Live Calendar
          </a>
          <a
            href="#before-after"
            className="hover:text-[#00e676] transition-colors py-2"
          >
            Before & After
          </a>
          <a
            href="#about"
            className="hover:text-[#00e676] transition-colors py-2"
          >
            About & Service Area
          </a>
        </nav>

        {/* Right CTA Group */}
        <div className="hidden sm:flex items-center gap-3">
          {/* My Bookings Pill */}
          <motion.button
            id="nav-my-bookings-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenMyBookings}
            className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:border-emerald-500/50 hover:bg-slate-800 transition-all cursor-pointer"
            title="View saved appointments"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>My Bookings</span>
            {activeBookingsCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold bg-[#00e676] text-black rounded-full">
                {activeBookingsCount}
              </span>
            )}
          </motion.button>

          {/* Call / Text Button */}
          <motion.a
            id="nav-call-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/60 border border-red-500/50 text-xs font-bold text-red-300 hover:bg-red-900/60 hover:text-white transition-all cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-red-400" />
            <span>Call/Text</span>
          </motion.a>

          {/* Primary Book Now Button */}
          <motion.button
            id="nav-book-now-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenBooking()}
            className="inline-flex items-center gap-2 px-4.5 py-2.2 rounded-lg bg-gradient-to-r from-emerald-500 to-[#00e676] text-black font-racing font-bold text-xs tracking-wide uppercase shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-black fill-black" />
            <span>Book Appointment</span>
          </motion.button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            id="nav-mobile-book-btn"
            onClick={() => onOpenBooking()}
            className="px-3 py-1.5 rounded-lg bg-[#00e676] text-black font-racing font-bold text-xs uppercase tracking-wide cursor-pointer"
          >
            Book
          </button>

          <button
            id="nav-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-b border-slate-800 bg-[#090b11] px-4 pt-3 pb-5 space-y-3"
        >
          <nav className="flex flex-col space-y-1 text-sm font-medium">
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200"
            >
              Services & Pricing
            </a>
            <a
              href="#calendar-section"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Live Calendar
              </span>
              <span className="text-[10px] uppercase font-bold bg-[#00e676] text-black px-1.5 py-0.5 rounded">
                Open Slots
              </span>
            </a>
            <a
              href="#before-after"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200"
            >
              Before & After Results
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200"
            >
              About & Service Area
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenMyBookings();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200"
            >
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              <span>My Scheduled Appointments ({activeBookingsCount})</span>
            </button>

            <a
              href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-900/60 border border-red-500/50 text-xs font-bold text-white"
            >
              <Phone className="w-4 h-4" />
              <span>Call / Text: {BUSINESS_INFO.phoneDisplay}</span>
            </a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};
