import React from 'react';
import { Phone, MapPin, Clock, Calendar, Sparkles, Heart, Mail } from 'lucide-react';
import logoImg from '../assets/images/logo.jpg';
import { BUSINESS_INFO } from '../data/servicesData';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenMyBookings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenMyBookings }) => {
  return (
    <footer className="bg-[#05060a] border-t border-slate-800 text-slate-400 text-xs">
      {/* Upper CTA Banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-red-950/30 via-emerald-950/20 to-slate-950 py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h3 className="font-racing text-3xl sm:text-4xl font-bold uppercase text-white tracking-wide">
            Ready For That <span className="text-[#00e676]">Showroom Gloss</span>?
          </h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Check our live scheduling calendar for open time slots today or schedule your mobile detail for later this week.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenBooking}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-[#00e676] text-black font-racing font-bold text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Book Appointment Now
            </button>
            <a
              href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
              className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-racing text-sm uppercase tracking-wider hover:border-emerald-500 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              Call / Text {BUSINESS_INFO.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="Fatboy Detailing"
                className="w-12 h-12 rounded-xl object-cover border border-emerald-500/40"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-racing font-bold text-xl text-chrome">FATBOY</span>
                  <span className="font-script font-bold text-xl text-[#00e676]">Detailing</span>
                </div>
                <p className="text-[11px] text-slate-400">Professional Auto Detailing in Wichita, KS</p>
              </div>
            </div>

            <p className="text-slate-400 max-w-md leading-relaxed text-xs">
              "{BUSINESS_INFO.ownerQuote}" Dedicated to deep vehicle transformation, interior steam sanitization, and long-lasting ceramic protection.
            </p>

            <div className="flex items-center gap-2 text-emerald-400 text-xs">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Proudly serving the Wichita, Kansas community</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-racing font-bold text-white uppercase text-sm tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#services" className="hover:text-[#00e676] transition-colors">
                  Services & Pricing
                </a>
              </li>
              <li>
                <a href="#calendar-section" className="hover:text-[#00e676] transition-colors">
                  Live Appointment Calendar
                </a>
              </li>
              <li>
                <a href="#before-after" className="hover:text-[#00e676] transition-colors">
                  Before & After Results
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#00e676] transition-colors">
                  About & Wichita Service Area
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenMyBookings}
                  className="hover:text-[#00e676] transition-colors text-left"
                >
                  Manage My Appointments
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-racing font-bold text-white uppercase text-sm tracking-wider">
              Contact & Hours
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{BUSINESS_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00e676] flex-shrink-0" />
                <a href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`} className="hover:underline">
                  {BUSINESS_INFO.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:underline text-slate-300 hover:text-white">
                  {BUSINESS_INFO.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{BUSINESS_INFO.hours}</span>
              </div>
              <div className="pt-1 text-[11px] text-emerald-400 font-semibold">
                Always Open for Inquiries & Bookings
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Fatboy Detailing. All rights reserved.</p>
          <p>Automotive Detailing & Ceramic Coatings • Wichita, KS</p>
        </div>
      </div>
    </footer>
  );
};
