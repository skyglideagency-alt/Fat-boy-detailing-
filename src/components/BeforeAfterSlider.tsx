import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import heroImg from '../assets/images/hero.jpg';
import wheelsImg from '../assets/images/wheels.jpg';
import interiorImg from '../assets/images/interior.jpg';

export const BeforeAfterSlider: React.FC = () => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section id="before-after" className="py-20 bg-[#090b10] relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with scroll animation */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[#00e676] text-xs font-bold uppercase tracking-wider font-racing">
            <Sparkles className="w-3.5 h-3.5" />
            Showroom Transformation
          </div>

          <h2 className="text-3xl sm:text-5xl font-racing font-bold uppercase tracking-tight text-white">
            Before & <span className="text-chrome">After</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base">
            Drag the slider to see how paint decontamination, ceramic sealant, and interior steam extraction transform your ride.
          </p>
        </motion.div>

        {/* Interactive Comparison Slider */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-700/80 select-none cursor-ew-resize shadow-2xl shadow-black/80"
          >
            {/* "After" Image (Full background) */}
            <img
              src={heroImg}
              alt="After Detailing - Gloss Finish"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* "Before" Image (Clipped layer) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={heroImg}
                alt="Before Detailing"
                className="absolute inset-0 w-full h-full object-cover max-w-none filter contrast-90 brightness-75 sepia-[0.35] blur-[0.6px]"
                style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
              />
              <div className="absolute inset-0 bg-amber-950/20 backdrop-grayscale-[0.3] pointer-events-none" />
              
              {/* "Before" Badge */}
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-black/80 border border-white/20 text-xs font-racing font-bold text-slate-300 uppercase tracking-wider">
                Before
              </span>
            </div>

            {/* "After" Badge */}
            <span className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/50 text-xs font-racing font-bold text-[#00e676] uppercase tracking-wider">
              After: Fatboy Glow ★
            </span>

            {/* Drag Handle Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#00e676] shadow-[0_0_15px_rgba(0,230,118,0.8)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black border-2 border-[#00e676] flex items-center justify-center text-[#00e676] shadow-xl">
                <span className="text-[10px] font-bold">◀ ▶</span>
              </div>
            </div>

            {/* Slider Hint */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-medium text-slate-300 pointer-events-none">
              Drag left or right
            </div>
          </div>

          {/* Quick Gallery Grid with subtle hover lift */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group aspect-[16/9]"
            >
              <img
                src={interiorImg}
                alt="Interior detailing clean"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <div>
                  <h4 className="font-racing font-bold text-sm text-white uppercase">
                    Interior Steam Sanitization
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Crevices, leather conditioning, and extraction.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group aspect-[16/9]"
            >
              <img
                src={wheelsImg}
                alt="Wheels & Ceramic Sealant"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                <div>
                  <h4 className="font-racing font-bold text-sm text-white uppercase">
                    Ceramic Paint & Rim Detailing
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Brake dust removal, tire shine, hydrophobic gloss.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

        </motion.div>

      </div>
    </section>
  );
};
