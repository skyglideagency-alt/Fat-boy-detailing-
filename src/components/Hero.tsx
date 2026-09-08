import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Sparkles, ShieldCheck, Clock, MapPin, ChevronRight, PhoneCall, ArrowRight } from 'lucide-react';
import heroImg from '../assets/images/hero.jpg';
import logoImg from '../assets/images/logo.jpg';
import { BUSINESS_INFO } from '../data/servicesData';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onExploreServices }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-20">
      {/* Low-opacity copyright-free car detailing background photography */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <img
          src="https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=2000&q=80"
          alt="Car detailing background"
          className="w-full h-full object-cover object-center opacity-20 filter contrast-125 brightness-90"
        />
        {/* Soft dark vignettes & gradient blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07080c]/50 via-[#07080c]/80 to-[#07080c]" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#07080c]/60 to-[#07080c]" />
      </div>

      {/* Dynamic ambient color glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[320px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[280px] bg-red-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Streamlined, punchy copy with intro animation */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left space-y-6"
          >
            {/* Clean Status Pill */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/30 text-emerald-300 text-xs font-racing font-bold tracking-wide uppercase shadow-lg shadow-black/40 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#00e676] animate-ping inline-block" />
              <span>Wichita, KS • Mobile & Drop-Off</span>
            </motion.div>

            {/* Bold, Minimal Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="font-racing text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-white uppercase leading-[1.05]"
            >
              Showroom Shine.{' '}
              <span className="text-[#00e676] drop-shadow-[0_0_25px_rgba(0,230,118,0.4)]">
                Heart & Soul.
              </span>
            </motion.h1>

            {/* Concise, Clean Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed"
            >
              Interior steam sanitization and exterior ceramic foam wash. Every exterior includes a complimentary 6-month protective sealant.
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-1"
            >
              <motion.button
                id="hero-book-calendar-cta"
                onClick={onOpenBooking}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-[#00e676] to-emerald-400 text-black font-racing font-bold text-base uppercase tracking-wider shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-black stroke-[2.5]" />
                <span>Book Detailing</span>
              </motion.button>

              <motion.button
                id="hero-view-services-cta"
                onClick={onExploreServices}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-200 font-racing text-base uppercase tracking-wide hover:border-emerald-500/50 hover:bg-slate-800 transition-all cursor-pointer backdrop-blur-md"
              >
                <span>View Packages</span>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </motion.button>
            </motion.div>

            {/* Sleek Minimalist Feature Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="flex flex-wrap gap-2.5 pt-3"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00e676]" />
                <span>6-Mo Ceramic Included</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <Clock className="w-3.5 h-3.5 text-[#00e676]" />
                <span>Same-Day Open Spots</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                <span>Self-Contained Mobile Unit</span>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column: Hero Visual Card with subtle float animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/80 group">
              
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6 }}
                  src={heroImg}
                  alt="Fatboy Detailing Wichita"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-transparent to-black/20" />
              </div>

              {/* Sparkle effects */}
              <div className="absolute top-1/4 left-1/3 text-emerald-300 animate-sparkle pointer-events-none">
                <Sparkles className="w-7 h-7 drop-shadow-[0_0_10px_rgba(0,230,118,0.9)]" />
              </div>

              {/* Floating Minimal Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-emerald-500/40 shadow-xl">
                <img
                  src={logoImg}
                  alt="Fatboy Logo"
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="leading-tight">
                  <span className="text-xs font-racing font-bold text-white uppercase block">
                    Fatboy Detailing
                  </span>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    Live Booking Active
                  </span>
                </div>
              </div>

              {/* Clean Bottom Bar */}
              <div className="p-4 border-t border-slate-800 bg-[#0c0e16]/95 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-racing tracking-wider text-slate-400 block">
                    Starting Package
                  </span>
                  <span className="text-xl font-racing font-bold text-[#00e676]">
                    $55 <span className="text-xs font-normal text-slate-400">/ Exterior Foam</span>
                  </span>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-[#00e676] font-racing font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Select Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
