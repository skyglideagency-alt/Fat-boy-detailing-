import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Heart, Check, Phone, Mail } from 'lucide-react';
import { BUSINESS_INFO, WICHITA_SERVICE_AREAS } from '../data/servicesData';
import logoImg from '../assets/images/logo.jpg';

export const AboutAndServiceArea: React.FC = () => {
  const [zipInput, setZipInput] = useState('');
  const [checkResult, setCheckResult] = useState<string | null>(null);

  const handleCheckArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipInput.trim()) return;
    const cleanZip = zipInput.trim().toLowerCase();
    
    // Check if zip starts with 67 (Wichita metro) or matches neighborhood
    const isWichitaZip = /^(670|671|672)/.test(cleanZip);
    const matchesNeighborhood = WICHITA_SERVICE_AREAS.some((area) =>
      area.toLowerCase().includes(cleanZip)
    );

    if (isWichitaZip || matchesNeighborhood) {
      setCheckResult('yes');
    } else {
      setCheckResult('ask');
    }
  };

  return (
    <section id="about" className="py-20 bg-[#07080d] relative border-t border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: About Story & Mission with scroll animation */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider font-racing">
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              Crafted With Passion
            </div>

            <h2 className="text-3xl sm:text-5xl font-racing font-bold uppercase tracking-tight text-white leading-tight">
              Heart & Soul in <br />
              <span className="text-[#00e676]">Every Detail</span>
            </h2>

            {/* Heartfelt Quote Card */}
            <div className="p-5 rounded-2xl bg-[#0c0f18] border-l-4 border-[#00e676] shadow-xl space-y-3">
              <p className="font-script text-xl sm:text-2xl text-emerald-300 leading-snug">
                "{BUSINESS_INFO.ownerQuote}"
              </p>
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={logoImg}
                  alt="Fatboy Detailing"
                  className="w-9 h-9 rounded-lg object-cover border border-emerald-500/40"
                />
                <div>
                  <h4 className="font-racing font-bold text-xs text-white uppercase">
                    Fatboy Detailing
                  </h4>
                  <p className="text-[10px] text-slate-400">Owner & Detailer • Wichita, KS</p>
                </div>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              We treat your vehicle like our own. From stubborn dog hair removal to 6-month ceramic sealants, no crack or crevice is overlooked.
            </p>

            {/* Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {[
                'Self-Contained Mobile (Water & Power included)',
                'Complimentary 6-Mo Ceramic Sealant',
                'Scratch-Free Dual-Action Foam Wash',
                'Same-Day Open Spots Available',
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex-shrink-0 flex items-center justify-center text-[#00e676]">
                    <Check className="w-2 h-2 stroke-[3]" />
                  </div>
                  <span>{point}</span>
                </div>
              ))}
            </div>

          </motion.div>

          {/* Right Column: Wichita Service Area & Checker with scroll animation */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6"
          >
            <div className="p-6 sm:p-7 rounded-2xl bg-[#0c0e17] border border-slate-800 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-racing font-bold text-base text-white uppercase">
                      Service Coverage
                    </h3>
                    <p className="text-[11px] text-slate-400">Mobile On-Site & Drop-Off</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-[#00e676] bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded uppercase">
                  Wichita & Metro
                </span>
              </div>

              {/* Service Areas Tag Cloud */}
              <div>
                <span className="text-[11px] font-racing uppercase tracking-wider text-slate-400 block mb-2">
                  Areas We Serve:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {WICHITA_SERVICE_AREAS.map((area) => (
                    <span
                      key={area}
                      className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00e676]" />
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instant Service Area Checker */}
              <form onSubmit={handleCheckArea} className="space-y-2.5 pt-1">
                <label className="block text-xs font-racing uppercase tracking-wider text-slate-300 font-bold">
                  Check Your Zip Code / City
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter zip code (e.g. 67206)..."
                    value={zipInput}
                    onChange={(e) => {
                      setZipInput(e.target.value);
                      setCheckResult(null);
                    }}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00e676]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-racing text-xs uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Check
                  </button>
                </div>

                {checkResult === 'yes' && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-[#00e676]/60 text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#00e676]" />
                    <span>We serve your area! Select an appointment slot above.</span>
                  </div>
                )}

                {checkResult === 'ask' && (
                  <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
                    <span>Just outside our zone? We travel with a small distance fee.</span>
                    <a href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`} className="font-bold underline text-amber-400">
                      Call Us
                    </a>
                  </div>
                )}
              </form>

              {/* Fast Call & Email Action */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/30 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-racing uppercase tracking-wider text-red-400 block">
                      Questions or Inquiries?
                    </span>
                    <span className="text-xs font-bold text-white">
                      Direct: {BUSINESS_INFO.phoneDisplay}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-racing font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <Phone className="w-3 h-3" /> Call / Text
                    </a>
                    <a
                      href={`mailto:${BUSINESS_INFO.email}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-racing font-bold text-xs uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <Mail className="w-3 h-3 text-emerald-400" /> Email
                    </a>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-800/80">
                  <MapPin className="w-3 h-3 text-[#00e676]" />
                  <span>{BUSINESS_INFO.address}</span>
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
