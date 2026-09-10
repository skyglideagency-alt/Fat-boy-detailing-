import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Car,
  MapPin,
  Sparkles,
  Phone,
  Mail,
  User,
  Download,
  Share2,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { SERVICE_PACKAGES, ADD_ON_SERVICES, VEHICLE_CONFIGS, BUSINESS_INFO } from '../data/servicesData';
import { VehicleType, AppointmentBooking } from '../types';
import { InteractiveCalendar } from './InteractiveCalendar';
import {
  createGoogleCalendarUrl,
  downloadIcsFile,
  saveBooking,
} from '../utils/calendarUtils';

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
  initialVehicleType?: VehicleType;
  existingBookings: AppointmentBooking[];
  onBookingComplete: (newBooking: AppointmentBooking) => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  isOpen,
  onClose,
  initialServiceId = 'full-detail',
  initialVehicleType = 'coupe_sedan',
  existingBookings,
  onBookingComplete,
}) => {
  // Step state: 1 = Service/Vehicle, 2 = Calendar Date & Time, 3 = Vehicle & Location, 4 = Contact Info, 5 = Confirmed
  const [step, setStep] = useState<number>(1);

  // Form states
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>(initialVehicleType);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);

  // Date and Time slot
  const pad = (n: number) => n.toString().padStart(2, '0');
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('09:30 AM');

  // Vehicle Details
  const [vehicleYear, setVehicleYear] = useState<string>('2022');
  const [vehicleMake, setVehicleMake] = useState<string>('');
  const [vehicleModel, setVehicleModel] = useState<string>('');
  const [vehicleColor, setVehicleColor] = useState<string>('');

  // Location & Service Mode
  const [serviceMode, setServiceMode] = useState<'mobile' | 'shop'>('mobile');
  const [address, setAddress] = useState<string>('');

  // Customer Contact
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Resulting confirmed booking object
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBooking | null>(null);

  // Sync initial props
  useEffect(() => {
    if (initialServiceId) setSelectedServiceId(initialServiceId);
    if (initialVehicleType) setSelectedVehicleType(initialVehicleType);
  }, [initialServiceId, initialVehicleType, isOpen]);

  if (!isOpen) return null;

  // Selected package details
  const currentPackage =
    SERVICE_PACKAGES.find((p) => p.id === selectedServiceId) || SERVICE_PACKAGES[2];

  // Pricing calculations
  const vehicleExtra = VEHICLE_CONFIGS[selectedVehicleType].extraPrice;
  const baseServicePrice = currentPackage.basePrice + vehicleExtra;

  const addOnsTotal = selectedAddOnIds.reduce((sum, id) => {
    const addon = ADD_ON_SERVICES.find((a) => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);

  const totalPrice = baseServicePrice + addOnsTotal;

  // Duration calculations
  const addOnsDuration = selectedAddOnIds.reduce((sum, id) => {
    const addon = ADD_ON_SERVICES.find((a) => a.id === id);
    return sum + (addon ? addon.durationMinutes : 0);
  }, 0);
  const totalDurationMinutes = currentPackage.durationMinutes + addOnsDuration;

  // Toggle Add-on
  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle final submission
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please provide your name and phone number for the booking confirmation.');
      return;
    }

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `FBD-${randomDigits}`;

    const newBooking: AppointmentBooking = {
      id: `booking-${Date.now()}`,
      bookingRef,
      serviceId: currentPackage.id,
      serviceName: currentPackage.name,
      vehicleType: selectedVehicleType,
      vehicleYear: vehicleYear || 'Vehicle',
      vehicleMake: vehicleMake || 'Make',
      vehicleModel: vehicleModel || 'Model',
      vehicleColor: vehicleColor || 'Standard',
      selectedAddOns: selectedAddOnIds,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      customerName,
      customerPhone,
      customerEmail,
      serviceMode,
      address: serviceMode === 'mobile' ? address || 'Wichita area mobile service' : 'Wichita Shop Drop-off',
      notes,
      totalPrice,
      estimatedDurationMinutes: totalDurationMinutes,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    saveBooking(newBooking);
    setConfirmedBooking(newBooking);
    onBookingComplete(newBooking);
    setStep(5); // Jump to Confirmation & Calendar Sync
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#090b10] border border-slate-700/80 rounded-2xl shadow-2xl shadow-emerald-500/10 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0c0e16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[#00e676]">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-racing font-bold text-lg text-white uppercase tracking-wider flex items-center gap-2">
                <span>Book Detailing Appointment</span>
                <span className="text-[10px] bg-red-950 text-red-400 border border-red-500/40 px-2 py-0.5 rounded uppercase font-bold tracking-tight">
                  Wichita, KS
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Step {step} of 5: {step === 1 && 'Select Package & Vehicle'}
                {step === 2 && 'Choose Date & Start Time'}
                {step === 3 && 'Vehicle & Service Location'}
                {step === 4 && 'Customer Contact Info'}
                {step === 5 && 'Appointment Confirmed!'}
              </p>
            </div>
          </div>

          <button
            id="close-booking-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        {step < 5 && (
          <div className="grid grid-cols-4 border-b border-slate-800/80 bg-black/40 text-[11px] font-racing uppercase tracking-wider">
            {[
              { num: 1, label: '1. Package' },
              { num: 2, label: '2. Calendar' },
              { num: 3, label: '3. Vehicle' },
              { num: 4, label: '4. Contact' },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                disabled={step < s.num}
                onClick={() => setStep(s.num)}
                className={`py-2 text-center border-b-2 transition-all ${
                  step === s.num
                    ? 'border-[#00e676] text-[#00e676] bg-emerald-950/30 font-bold'
                    : step > s.num
                    ? 'border-emerald-700/50 text-slate-300 hover:text-white cursor-pointer'
                    : 'border-transparent text-slate-600 cursor-not-allowed'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* STEP 1: Select Service, Vehicle & Add-ons */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Vehicle Type Choice */}
              <div>
                <label className="block text-xs font-racing uppercase tracking-wider text-slate-300 mb-2 font-bold">
                  Vehicle Sizing
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(Object.keys(VEHICLE_CONFIGS) as VehicleType[]).map((vType) => {
                    const isSelected = selectedVehicleType === vType;
                    const config = VEHICLE_CONFIGS[vType];
                    return (
                      <button
                        key={vType}
                        type="button"
                        onClick={() => setSelectedVehicleType(vType)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#00e676] bg-emerald-950/40 text-white shadow-md'
                            : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-racing font-bold uppercase ${isSelected ? 'text-[#00e676]' : 'text-slate-200'}`}>
                            {config.name.split(' (')[0]}
                          </span>
                          {config.extraPrice > 0 ? (
                            <span className="text-[11px] font-bold text-slate-400">+${config.extraPrice}</span>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-400">Base</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-1">e.g. {config.examples}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-xs font-racing uppercase tracking-wider text-slate-300 mb-2 font-bold">
                  Choose Detailing Service
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SERVICE_PACKAGES.map((pkg) => {
                    const isSelected = selectedServiceId === pkg.id;
                    const price = pkg.basePrice + vehicleExtra;

                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setSelectedServiceId(pkg.id)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#00e676] bg-emerald-950/50 shadow-lg shadow-emerald-500/10'
                            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded bg-[#00e676] text-black text-[9px] font-racing font-bold uppercase">
                            Most Popular
                          </span>
                        )}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-racing font-bold text-sm uppercase ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                              {pkg.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                            {pkg.subtitle}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-baseline justify-between">
                          <span className="font-racing font-bold text-xl text-[#00e676]">
                            ${price}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#00e676]" />
                            ~{pkg.durationMinutes}m
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Upgrades / Add-ons */}
              <div>
                <label className="block text-xs font-racing uppercase tracking-wider text-slate-300 mb-2 font-bold">
                  Optional Add-Ons & Upgrades
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ADD_ON_SERVICES.map((addon) => {
                    const isChecked = selectedAddOnIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddOn(addon.id)}
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                          isChecked
                            ? 'border-[#00e676] bg-emerald-950/30'
                            : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 accent-[#00e676] w-4 h-4 rounded cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-racing font-bold ${isChecked ? 'text-white' : 'text-slate-200'}`}>
                              {addon.name}
                            </span>
                            <span className="text-xs font-racing font-bold text-[#00e676]">
                              +${addon.price}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                            {addon.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation Ribbon */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-racing block">Estimated Total</span>
                  <span className="text-2xl font-racing font-bold text-[#00e676]">
                    ${totalPrice}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-2">
                    (Approx. {Math.floor(totalDurationMinutes / 60)}h {totalDurationMinutes % 60 > 0 ? `${totalDurationMinutes % 60}m` : ''})
                  </span>
                </div>

                <button
                  type="button"
                  id="step1-continue-btn"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-[#00e676] text-black font-racing font-bold text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <span>Select Date & Time</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Interactive Calendar & Time Slot Picker */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-racing text-lg font-bold uppercase text-white mb-1">
                  Choose Appointment Date & Slot
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Fatboy Detailing operates 7 days a week. We keep dedicated slots open for same-day cleaning.
                </p>

                {/* Calendar Component */}
                <InteractiveCalendar
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                  onSelectTimeSlot={setSelectedTimeSlot}
                  existingBookings={existingBookings}
                  durationMinutes={totalDurationMinutes}
                />
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-racing uppercase tracking-wider hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <button
                  type="button"
                  id="step2-continue-btn"
                  onClick={() => setStep(3)}
                  disabled={!selectedTimeSlot}
                  className="px-6 py-3 rounded-xl bg-[#00e676] text-black font-racing font-bold text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <span>Vehicle & Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Vehicle & Service Location */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-racing text-lg font-bold uppercase text-white mb-1">
                  Vehicle Information & Location
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Tell us what vehicle we are detailing and whether you'd prefer mobile on-site service or shop drop-off.
                </p>

                {/* Service Mode Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setServiceMode('mobile')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      serviceMode === 'mobile'
                        ? 'border-[#00e676] bg-emerald-950/40 text-white'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-[#00e676]" />
                      <span className="font-racing font-bold text-sm uppercase text-white">
                        Mobile Service (We Come To You)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      We travel to your home or office in Wichita & surrounding communities. We bring our own water and power!
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceMode('shop')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      serviceMode === 'shop'
                        ? 'border-[#00e676] bg-emerald-950/40 text-white'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Car className="w-4 h-4 text-[#00e676]" />
                      <span className="font-racing font-bold text-sm uppercase text-white">
                        Shop Drop-Off
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Drop off your vehicle at our detailing facility in Wichita, KS for dedicated studio lighting care.
                    </p>
                  </button>
                </div>

                {/* Address field for mobile service */}
                {serviceMode === 'mobile' && (
                  <div className="mb-6 space-y-1.5">
                    <label className="block text-xs font-racing uppercase tracking-wider text-slate-300 font-bold">
                      Your Street Address / Zip Code in Wichita, KS *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1420 N Rock Rd, Wichita, KS 67206"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#00e676]"
                    />
                    <span className="text-[11px] text-slate-400">
                      Serving East & West Wichita, Andover, Derby, Maize, Goddard & Bel Aire.
                    </span>
                  </div>
                )}

                {/* Vehicle Year / Make / Model / Color */}
                <div className="space-y-3">
                  <label className="block text-xs font-racing uppercase tracking-wider text-slate-300 font-bold">
                    Vehicle Particulars
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Year</span>
                      <input
                        type="text"
                        placeholder="2022"
                        value={vehicleYear}
                        onChange={(e) => setVehicleYear(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00e676]"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Make</span>
                      <input
                        type="text"
                        placeholder="e.g. Ford / Toyota"
                        value={vehicleMake}
                        onChange={(e) => setVehicleMake(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00e676]"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Model</span>
                      <input
                        type="text"
                        placeholder="e.g. Mustang / RAV4"
                        value={vehicleModel}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00e676]"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block mb-1">Color</span>
                      <input
                        type="text"
                        placeholder="e.g. Black / Silver"
                        value={vehicleColor}
                        onChange={(e) => setVehicleColor(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00e676]"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-racing uppercase tracking-wider hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <button
                  type="button"
                  id="step3-continue-btn"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-xl bg-[#00e676] text-black font-racing font-bold text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <span>Customer Contact</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Customer Details & Confirmation */}
          {step === 4 && (
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div>
                <h4 className="font-racing text-lg font-bold uppercase text-white mb-1">
                  Customer Contact & Booking Review
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  We will send your calendar invite and text confirmation for the appointment.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-racing uppercase tracking-wider text-slate-300 font-bold mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#00e676]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-racing uppercase tracking-wider text-slate-300 font-bold mb-1">
                      Phone Number (For Text Confirmations) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="(316) 555-0199"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#00e676]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-racing uppercase tracking-wider text-slate-300 font-bold mb-1">
                      Email Address (Optional for Calendar Invites)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-[#00e676]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-racing uppercase tracking-wider text-slate-300 font-bold mb-1">
                      Special Notes or Areas of Concern
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Dog hair in rear seats, stains on front floor mats, or gated driveway code."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00e676]"
                    />
                  </div>
                </div>

                {/* Final Order Summary Card */}
                <div className="mt-6 p-4 rounded-xl border border-slate-800 bg-[#0c0f18] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Package:</span>
                    <span className="font-bold text-white uppercase font-racing">{currentPackage.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Date & Slot:</span>
                    <span className="font-bold text-[#00e676]">{selectedDate} at {selectedTimeSlot}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Vehicle:</span>
                    <span className="text-slate-300">
                      {vehicleYear} {vehicleMake || 'Vehicle'} {vehicleModel} ({VEHICLE_CONFIGS[selectedVehicleType].name.split(' (')[0]})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Service Location:</span>
                    <span className="text-slate-300">
                      {serviceMode === 'mobile' ? `Mobile (${address || 'Wichita, KS area'})` : 'Shop Drop-off'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-slate-800">
                    <span className="text-white font-racing uppercase">Total Estimated Due:</span>
                    <span className="text-xl text-[#00e676] font-racing">${totalPrice}</span>
                  </div>
                </div>

              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 text-xs font-racing uppercase tracking-wider hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <button
                  type="submit"
                  id="confirm-booking-btn"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-[#00e676] to-emerald-400 text-black font-racing font-bold text-sm uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/30"
                >
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>Confirm Appointment</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 5: Booking Confirmed & Calendar Integration */}
          {step === 5 && confirmedBooking && (
            <div className="space-y-6 text-center py-4">
              
              {/* Success Badge */}
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-[#00e676] text-[#00e676] flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-racing uppercase tracking-wider text-slate-400">
                  Appointment Scheduled Successfully
                </span>
                <h3 className="font-racing text-3xl font-bold uppercase text-white mt-1">
                  You're On The Calendar!
                </h3>
                <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto">
                  Thank you, <strong className="text-white">{confirmedBooking.customerName}</strong>! Your car cleaning session has been locked in with Fatboy Detailing.
                </p>
              </div>

              {/* Reference Card */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#0c0f18] border border-emerald-500/40 text-left space-y-3 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-racing uppercase text-slate-400">Confirmation Ref:</span>
                  <span className="font-racing font-bold text-base text-[#00e676] bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-500/40">
                    {confirmedBooking.bookingRef}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Date:</span>
                    <span className="font-bold text-white">
                      {new Date(confirmedBooking.date.replace(/-/g, '/')).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Start Time:</span>
                    <span className="font-bold text-[#00e676]">{confirmedBooking.timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service:</span>
                    <span className="font-semibold text-white">{confirmedBooking.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Vehicle:</span>
                    <span className="text-slate-300">
                      {confirmedBooking.vehicleYear} {confirmedBooking.vehicleMake} {confirmedBooking.vehicleModel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service Mode:</span>
                    <span className="text-slate-300">
                      {confirmedBooking.serviceMode === 'mobile' ? 'Mobile Detailing' : 'Shop Drop-off'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                    <span className="text-white font-racing">Total Estimated:</span>
                    <span className="text-[#00e676] font-racing">${confirmedBooking.totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* SEAMLESS CALENDAR INTEGRATION BUTTONS */}
              <div className="max-w-md mx-auto space-y-3 pt-2">
                <p className="text-xs font-racing uppercase tracking-wider text-[#00e676] font-bold">
                  Add To Your Calendar With 1-Click
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Google Calendar Link */}
                  <a
                    id="add-to-google-cal-btn"
                    href={createGoogleCalendarUrl(confirmedBooking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 hover:bg-slate-800 text-white font-racing text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer group"
                  >
                    <CalendarIcon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Google Calendar</span>
                  </a>

                  {/* Download .ICS File for Apple / Outlook / Phone */}
                  <button
                    id="download-ics-cal-btn"
                    type="button"
                    onClick={() => downloadIcsFile(confirmedBooking)}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 hover:bg-slate-800 text-white font-racing text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer group"
                  >
                    <Download className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Apple / Outlook (.ics)</span>
                  </button>
                </div>
              </div>

              {/* Direct Detailer Call / Text / Email */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5">
                <a
                  href={`tel:${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`}
                  className="px-4 py-2.5 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 font-racing text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-red-900/60"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call/Text: {BUSINESS_INFO.phoneDisplay}</span>
                </a>

                <a
                  href={`mailto:${BUSINESS_INFO.email}`}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-racing text-xs uppercase tracking-wider flex items-center gap-2 hover:text-white"
                >
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>{BUSINESS_INFO.email}</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#00e676] text-black font-racing font-bold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer"
                >
                  Done & Close
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
