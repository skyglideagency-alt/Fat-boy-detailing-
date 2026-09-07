import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { CalendarSection } from './components/CalendarSection';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { AboutAndServiceArea } from './components/AboutAndServiceArea';
import { Footer } from './components/Footer';
import { BookingFlowModal } from './components/BookingFlowModal';
import { MyBookingsDrawer } from './components/MyBookingsDrawer';
import { VehicleType, AppointmentBooking } from './types';
import { loadSavedBookings, cancelBookingInStorage } from './utils/calendarUtils';

export default function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('full-detail');
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType>('coupe_sedan');
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [userBookings, setUserBookings] = useState<AppointmentBooking[]>([]);

  // Load bookings from local storage on mount
  useEffect(() => {
    setUserBookings(loadSavedBookings());
  }, []);

  // Open booking flow with preselected service
  const handleOpenBooking = (serviceId?: string, vehicleType: VehicleType = 'coupe_sedan') => {
    if (serviceId) {
      setSelectedServiceId(serviceId);
    }
    setSelectedVehicleType(vehicleType);
    setIsBookingModalOpen(true);
  };

  // Open booking from calendar slot click
  const handleScheduleFromCalendar = (date: string, timeSlot: string) => {
    setIsBookingModalOpen(true);
  };

  // Callback when booking is successfully completed
  const handleBookingComplete = (newBooking: AppointmentBooking) => {
    setUserBookings((prev) => [newBooking, ...prev.filter((b) => b.id !== newBooking.id)]);
  };

  // Cancel booking
  const handleCancelBooking = (id: string) => {
    cancelBookingInStorage(id);
    setUserBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b))
    );
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex flex-col font-sans selection:bg-[#00e676] selection:text-black">
      {/* Sticky Navigation */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        userBookings={userBookings}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          onExploreServices={() => {
            const el = document.getElementById('services');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Services & Live Price Calculator */}
        <ServicesSection
          onSelectService={(serviceId, vehicleType) =>
            handleOpenBooking(serviceId, vehicleType)
          }
        />

        {/* Interactive Calendar Scheduling Integration */}
        <CalendarSection
          onScheduleSlot={handleScheduleFromCalendar}
          existingBookings={userBookings}
        />

        {/* Before & After Interactive Comparison */}
        <BeforeAfterSlider />

        {/* About the Detailer & Wichita Service Area */}
        <AboutAndServiceArea />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
      />

      {/* Interactive Booking Flow Modal */}
      <BookingFlowModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialServiceId={selectedServiceId}
        initialVehicleType={selectedVehicleType}
        existingBookings={userBookings}
        onBookingComplete={handleBookingComplete}
      />

      {/* My Appointments Drawer */}
      <MyBookingsDrawer
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        bookings={userBookings}
        onCancelBooking={handleCancelBooking}
        onNewBookingClick={() => setIsBookingModalOpen(true)}
      />
    </div>
  );
}
