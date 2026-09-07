export type VehicleType = 'coupe_sedan' | 'suv_crossover' | 'truck_van';

export interface ServicePackage {
  id: string;
  name: string;
  subtitle: string;
  category: 'interior' | 'exterior' | 'full';
  basePrice: number;
  maxPrice: number;
  durationMinutes: number;
  popular?: boolean;
  tag?: string;
  features: string[];
  image: string;
}

export interface AddOnService {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  description: string;
  iconName: string;
}

export interface TimeSlot {
  id: string;
  time: string; // e.g. "09:00 AM"
  hour: number;
  minute: number;
  period: 'morning' | 'afternoon' | 'evening';
  available: boolean;
}

export interface AppointmentBooking {
  id: string;
  bookingRef: string;
  serviceId: string;
  serviceName: string;
  vehicleType: VehicleType;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleColor: string;
  licensePlate?: string;
  selectedAddOns: string[];
  date: string; // YYYY-MM-DD
  timeSlot: string; // "09:00 AM"
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceMode: 'mobile' | 'shop';
  address?: string;
  notes?: string;
  totalPrice: number;
  estimatedDurationMinutes: number;
  status: 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}
