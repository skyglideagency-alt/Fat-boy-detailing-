import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Sparkles, Clock, Plus, ArrowRight } from 'lucide-react';
import { SERVICE_PACKAGES, ADD_ON_SERVICES, VEHICLE_CONFIGS } from '../data/servicesData';
import { VehicleType, ServicePackage } from '../types';

interface ServicesSectionProps {
  onSelectService: (serviceId: string, vehicleType: VehicleType) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('coupe_sedan');
  const [showAddOns, setShowAddOns] = useState(false);

  const vehicleExtra = VEHICLE_CONFIGS[selectedVehicle].extraPrice;

  return (
    <section id="services" className="py-20 bg-[#0a0c12] relative border-t border-slate-800/80">
      {/* Background glow accents */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with scroll animation */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto space-y-3 mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[#00e676] text-xs font-bold uppercase tracking-wider font-racing">
            <Sparkles className="w-3.5 h-3.5" />
            Transparent Detailing Packages
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-racing font-bold uppercase tracking-tight text-white">
            Services & <span className="text-chrome">Pricing</span>
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Clear pricing with zero hidden fees. Every exterior package includes complimentary <span className="text-[#00e676] font-semibold">6-month ceramic protection</span>.
          </p>

          {/* Vehicle Type Selector */}
          <div className="pt-3">
            <span className="text-xs font-racing uppercase tracking-wider text-slate-400 block mb-2.5">
              Select Vehicle Size
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
              {(Object.keys(VEHICLE_CONFIGS) as VehicleType[]).map((vType) => {
                const isSelected = selectedVehicle === vType;
                const config = VEHICLE_CONFIGS[vType];

                return (
                  <motion.button
                    key={vType}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedVehicle(vType)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#00e676] bg-emerald-950/30 shadow-lg shadow-emerald-500/10'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-0.5">
                      <span className={`text-xs font-racing font-bold uppercase ${isSelected ? 'text-[#00e676]' : 'text-slate-200'}`}>
                        {config.name.split(' (')[0]}
                      </span>
                      {config.extraPrice > 0 ? (
                        <span className="text-[11px] font-bold text-slate-400">
                          +${config.extraPrice}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-400">Standard</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 truncate">
                      {config.examples}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* 3 Main Packages Grid with staggered scroll animation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {SERVICE_PACKAGES.map((pkg: ServicePackage, index: number) => {
            const calculatedMin = pkg.basePrice + vehicleExtra;
            const calculatedMax = pkg.maxPrice + vehicleExtra;
            const isPopular = pkg.popular;

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ y: -6 }}
                className={`relative rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 ${
                  isPopular
                    ? 'border-2 border-[#00e676] bg-gradient-to-b from-slate-900 via-[#0a0f16] to-[#07090e] shadow-2xl shadow-emerald-500/15 md:-translate-y-2'
                    : 'border border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="bg-gradient-to-r from-emerald-500 to-[#00e676] text-black text-[11px] font-racing font-bold uppercase tracking-widest text-center py-1.5 px-4">
                    ★ Best Value • Inside & Out
                  </div>
                )}

                {/* Package Image Banner */}
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c12] via-black/30 to-transparent" />
                  
                  {/* Category Tag */}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/10 text-[10px] font-racing font-bold text-slate-200 uppercase tracking-wider">
                    {pkg.tag}
                  </span>

                  {/* Duration Badge */}
                  <span className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-white/10 text-[11px] font-semibold text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-[#00e676]" />
                    ~{pkg.durationMinutes}m
                  </span>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Title & Pricing */}
                  <div className="border-b border-slate-800/80 pb-4 mb-4">
                    <h3 className="font-racing text-2xl font-bold uppercase text-white tracking-wide">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {pkg.subtitle}
                    </p>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-racing font-bold text-[#00e676]">
                        ${calculatedMin} - ${calculatedMax}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        / {VEHICLE_CONFIGS[selectedVehicle].name.split(' (')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2.5 flex-1">
                    <ul className="space-y-2 text-xs text-slate-300">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-snug">
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex-shrink-0 flex items-center justify-center mt-0.5 text-[#00e676]">
                            <Check className="w-2 h-2 stroke-[3]" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Booking CTA Button */}
                  <div className="pt-5 mt-5 border-t border-slate-800/80">
                    <motion.button
                      id={`book-pkg-${pkg.id}-btn`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectService(pkg.id, selectedVehicle)}
                      className={`w-full py-3 px-4 rounded-xl font-racing font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        isPopular
                          ? 'bg-gradient-to-r from-emerald-500 via-[#00e676] to-emerald-400 text-black shadow-lg shadow-emerald-500/20 hover:brightness-110'
                          : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                      }`}
                    >
                      <span>Book Appointment</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Add-ons toggle section with smooth accordion animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 max-w-4xl mx-auto"
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-racing text-base font-bold text-white uppercase flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00e676]" />
                  Specialized Add-On Upgrades
                </h4>
                <p className="text-xs text-slate-400">
                  Pet hair extraction, engine steam, headlight restoration & ozone deodorization.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddOns(!showAddOns)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-racing font-bold text-emerald-300 transition-all cursor-pointer w-fit"
              >
                <span>{showAddOns ? 'Hide Add-Ons' : 'View Add-Ons'}</span>
                <Plus className={`w-3.5 h-3.5 transition-transform duration-200 ${showAddOns ? 'rotate-45' : ''}`} />
              </button>
            </div>

            <AnimatePresence>
              {showAddOns && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-800 overflow-hidden"
                >
                  {ADD_ON_SERVICES.map((addon) => (
                    <div
                      key={addon.id}
                      className="p-3 rounded-xl border border-slate-800 bg-black/40 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-racing font-bold text-xs text-white">
                          {addon.name}
                        </span>
                        <span className="font-racing font-bold text-xs text-[#00e676]">
                          +${addon.price}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {addon.description}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
