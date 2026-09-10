import { ServicePackage, AddOnService, VehicleType } from '../types';
import heroImg from '../assets/images/hero.jpg';
import interiorImg from '../assets/images/interior.jpg';
import wheelsImg from '../assets/images/wheels.jpg';

export const VEHICLE_CONFIGS: Record<VehicleType, { name: string; extraPrice: number; icon: string; examples: string }> = {
  coupe_sedan: {
    name: 'Sedan / Coupe / Hatchback',
    extraPrice: 0,
    icon: 'Car',
    examples: 'Civic, Mustang, Camry, Model 3',
  },
  suv_crossover: {
    name: 'SUV / Crossover (2-Row)',
    extraPrice: 15,
    icon: 'CarFront',
    examples: 'RAV4, CR-V, Cherokee, Model Y',
  },
  truck_van: {
    name: 'Truck / Large SUV / Van (3-Row)',
    extraPrice: 25,
    icon: 'Truck',
    examples: 'F-150, Tahoe, Suburban, Odyssey',
  },
};

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    id: 'exterior-detail',
    name: 'Exterior Detail',
    subtitle: 'Foam Bath & 6-Month Ceramic Paint Protection',
    category: 'exterior',
    basePrice: 55,
    maxPrice: 75,
    durationMinutes: 75,
    image: wheelsImg,
    tag: 'Paint & Wheels',
    features: [
      'Full Exterior Multi-Stage Foam Bath',
      'Ceramic Sealant Applied to Paint (6mo protection)',
      'Wheels, Barrels & Wheel Wells Deep Cleaned',
      'Tires Decontaminated & Wet-Gloss Tire Shine Applied',
      'Exterior Streak-Free Glass & Mirror Polish',
      'Microfiber Scratch-Free Hand Dry & Door Jambs Wipe',
    ],
  },
  {
    id: 'interior-detail',
    name: 'Interior Detail',
    subtitle: 'Deep Vacuum, Leather Cleaning & UV Armor',
    category: 'interior',
    basePrice: 65,
    maxPrice: 90,
    durationMinutes: 90,
    image: interiorImg,
    tag: 'Cabin Restoration',
    features: [
      'Complete Vacuum & Wipe Down of All Cracks & Crevices',
      'UV Protection Applied to All Interior Surfaces & Dash',
      'Premium Leather Cleaned & Conditioned',
      'Crystal Streak-Free Glass & Sunroof Clean',
      'Floor Mats & Carpet Deep Cleaned & Restored',
      'Air Vents & Console Detail with High-Gloss Refresh',
    ],
  },
  {
    id: 'full-detail',
    name: 'Full Detail Package',
    subtitle: 'The Complete Inside & Out Transformation',
    category: 'full',
    basePrice: 150,
    maxPrice: 225,
    durationMinutes: 180,
    popular: true,
    tag: 'Most Popular',
    image: heroImg,
    features: [
      'Full Exterior Foam Bath & Hand Decontamination',
      'Ceramic Sealant Applied to Paint (6-Month Hydrophobic Shield)',
      'Wheels & Tires Deep Cleaned with Wet-Gloss Shine',
      'Complete Vacuum & Wipe Down of All Cracks & Crevices',
      'UV Protection Applied to All Interior Surfaces',
      'Leather Cleaned, Sanitized & Conditioned',
      'Streak-Free Glass Inside & Out',
      'Floor Mats Cleaned & Door Jambs Detailed',
    ],
  },
];

export const ADD_ON_SERVICES: AddOnService[] = [
  {
    id: 'pet-hair-extraction',
    name: 'Pet Hair Deep Extraction',
    price: 25,
    durationMinutes: 30,
    description: 'Specialized rubber squeegee and deep mechanical brushing to lift trapped pet fur from fabric seats and carpets.',
    iconName: 'Sparkles',
  },
  {
    id: 'engine-bay-steam',
    name: 'Engine Bay Steam Clean & Dress',
    price: 35,
    durationMinutes: 30,
    description: 'De-greasing, controlled steam wash, and satin silicone-free protective dressing on plastics and rubber hoses.',
    iconName: 'Flame',
  },
  {
    id: 'headlight-restoration',
    name: 'Headlight Oxidation Restoration',
    price: 45,
    durationMinutes: 45,
    description: 'Wet-sanding hazy, yellowed lenses back to crystal optical clarity with ceramic UV clear-coat shield.',
    iconName: 'SunMedium',
  },
  {
    id: 'ozone-odor-elimination',
    name: 'Ozone Odor Treatment & Sanitization',
    price: 30,
    durationMinutes: 30,
    description: 'Hospital-grade ozone machine eradicates smoke, mold, food odors, and airborne bacteria at the molecular level.',
    iconName: 'Wind',
  },
  {
    id: 'shampoo-extraction',
    name: 'Heavy Stain Seat & Carpet Shampoo',
    price: 35,
    durationMinutes: 40,
    description: 'Hot water commercial extraction for deep beverage spills, coffee stains, and embedded ground-in soil.',
    iconName: 'Droplets',
  },
];

export const WICHITA_SERVICE_AREAS = [
  'East Wichita',
  'West Wichita',
  'Downtown / Old Town',
  'College Hill / Riverside',
  'Andover',
  'Derby',
  'Maize',
  'Goddard',
  'Bel Aire',
  'Valley Center',
];

export const BUSINESS_INFO = {
  name: 'Fatboy Detailing',
  ownerQuote: 'My page is bout my heart and soul for detailing an the amazing job I can do an I do it with love.',
  phone: '+1 316-284-7112',
  phoneDisplay: '(316) 284-7112',
  email: 'vivianna2335@yahoo.com',
  address: 'Nevada, Wichita, KS, 67212',
  locationCity: 'Wichita, Kansas',
  hours: 'Always Open (7 Days)',
  urgencyBanner: 'WE HAVE OPEN SPOTS FOR TODAY — CALL OR TEXT TO BOOK YOUR APPOINTMENT',
};
