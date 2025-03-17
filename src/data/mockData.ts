// Types
export interface Venue {
  id: string;
  name: string;
  type: 'indoor' | 'outdoor' | 'both';
  size: 'small' | 'medium' | 'large';
  style: string[];
  price: number;
  location: string;
  distance: number;
  rating: number;
  reviews: number;
  description: string;
  images: string[];
  availability: string[];
  ownerId?: string;
  coordinates?: { lat: number; lng: number };
}

export interface DJ {
  id: string;
  name: string;
  genres: string[];
  experience: number;
  price: number;
  rating: number;
  reviews: number;
  bio: string;
  image: string;
  availability: string[];
  maxTravelDistance?: number; // Maximum distance in km the DJ is willing to travel
  ownerId?: string;
  coordinates?: { lat: number; lng: number };
}

export interface CateringService {
  id: string;
  name: string;
  cuisineType: string[];
  price: number;
  rating: number;
  reviews: number;
  description: string;
  image: string;
  availability: string[];
  maxTravelDistance?: number; // Maximum distance in km the caterer is willing to travel
  ownerId?: string;
  coordinates?: { lat: number; lng: number };
}

// New service category interfaces
export interface Entertainment {
  id: string;
  name: string;
  type: string[]; // e.g., 'band', 'dancer', 'comedian', 'magician', 'speaker'
  genre?: string[]; // For bands, performers, etc.
  duration: number; // Performance duration in hours
  price: number; // Price per hour or per performance
  priceType: 'hourly' | 'flat'; // Whether price is per hour or flat rate
  rating: number;
  reviews: number;
  description: string;
  image: string;
  availability: string[];
  maxTravelDistance?: number;
  ownerId?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Photography {
  id: string;
  name: string;
  type: string[]; // e.g., 'photographer', 'videographer', 'drone', 'photo booth'
  style: string[]; // e.g., 'traditional', 'photojournalistic', 'artistic'
  services: string[]; // e.g., 'engagement', 'wedding', 'event', 'portrait'
  price: number; // Base price
  priceType: 'hourly' | 'package'; // Whether price is per hour or package
  packageHours?: number; // If package, how many hours included
  rating: number;
  reviews: number;
  description: string;
  image: string;
  availability: string[];
  maxTravelDistance?: number;
  ownerId?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Decoration {
  id: string;
  name: string;
  type: string[]; // e.g., 'floral', 'lighting', 'stage', 'themed'
  style: string[]; // e.g., 'modern', 'rustic', 'elegant', 'bohemian'
  price: number; // Base price
  priceType: 'package' | 'custom'; // Whether price is package or custom quote
  rating: number;
  reviews: number;
  description: string;
  image: string;
  availability: string[];
  maxTravelDistance?: number;
  ownerId?: string;
  coordinates?: { lat: number; lng: number };
}

export interface AudioVisual {
  id: string;
  name: string;
  equipmentTypes: string[]; // e.g., 'sound system', 'lighting', 'projector', 'microphones'
  eventTypes: string[]; // e.g., 'concert', 'conference', 'wedding', 'corporate'
  price: number; // Base price
  priceType: 'package' | 'itemized'; // Whether price is package or itemized
  includesTechnician: boolean; // Whether a technician is included
  rating: number;
  reviews: number;
  description: string;
  image: string;
  availability: string[];
  maxTravelDistance?: number;
  ownerId?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Furniture {
  id: string;
  name: string;
  itemTypes: string[]; // e.g., 'tables', 'chairs', 'lounge', 'tents'
  style: string[]; // e.g., 'modern', 'rustic', 'elegant', 'industrial'
  price: number; // Base price
  priceType: 'per_item' | 'package'; // Whether price is per item or package
  includesSetup: boolean; // Whether setup/teardown is included
  rating: number;
  reviews: number;
  description: string;
  image: string;
  availability: string[];
  maxTravelDistance?: number;
  ownerId?: string;
  coordinates?: { lat: number; lng: number };
}

export interface BarService {
  id: string;
  name: string;
  serviceTypes: string[]; // e.g., 'full bar', 'beer and wine', 'specialty cocktails'
  packageOptions: string[]; // e.g., 'open bar', 'cash bar', 'limited bar'
  price: number; // Base price
  priceType: 'per_person' | 'per_hour' | 'package'; // Pricing model
  includesBartenders: boolean; // Whether bartenders are included
  rating: number;
  reviews: number;
  description: string;
  image: string;
  availability: string[];
  maxTravelDistance?: number;
  ownerId?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Security {
  id: string;
  name: string;
  serviceTypes: string[]; // e.g., 'event security', 'crowd control', 'VIP protection'
  staffTypes: string[]; // e.g., 'guards', 'bouncers', 'off-duty police'
  price: number; // Base price
  priceType: 'per_guard' | 'per_hour' | 'package'; // Pricing model
  uniformed: boolean; // Whether staff is uniformed
  rating: number;
  reviews: number;
  description: string;
  image: string;
  availability: string[];
  maxTravelDistance?: number;
  ownerId?: string;
  coordinates?: { lat: number; lng: number };
}

export interface Event {
  id: string;
  name: string;
  date: string;
  dateRange?: { start: string; end: string };
  venue: string;
  dj: string;
  catering?: string;
  entertainment?: string;
  photography?: string;
  decoration?: string;
  audioVisual?: string;
  furniture?: string;
  barService?: string;
  security?: string;
  isPublic: boolean;
  attendees: number;
  description: string;
  image: string;
}

// New interfaces for authentication
export type UserRole = 'client' | 'venue' | 'dj' | 'caterer' | 'planner' | 'entertainment' | 'photography' | 'decoration' | 'audioVisual' | 'furniture' | 'barService' | 'security' | 'multiple';

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  phone?: string;
  avatar?: string;
  eventsCreated?: number;
  eventsAttended?: number;
  rating?: number;
  reviews?: number;
  badges?: string[];
  calendarConnected?: boolean;
  calendarType?: 'google' | 'ical';
  calendarUrl?: string;
  maxTravelDistance?: number; // Maximum distance in km the service provider is willing to travel
  location?: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  // Verification related fields
  isVerified?: boolean;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  verificationDate?: string;
  verificationDocuments?: {
    businessLicense?: string;
    identityProof?: string;
    insuranceCertificate?: string;
    otherDocuments?: string[];
  };
}

// Mock Data
export const venues: Venue[] = [
  {
    id: 'v1',
    name: 'Skyline Rooftop',
    type: 'outdoor',
    size: 'medium',
    style: ['rooftop', 'modern'],
    price: 1200,
    location: 'Downtown Tampa',
    distance: 2.5,
    rating: 4.7,
    reviews: 128,
    description: 'A stunning rooftop venue with panoramic city views, perfect for evening events.',
    images: ['/venues/skyline1.jpg', '/venues/skyline2.jpg'],
    availability: [
      '2023-06-15', '2023-06-16', '2023-06-17', '2023-06-18', '2023-06-19', '2023-06-20', '2023-06-21', '2023-06-22', 
      '2023-06-23', '2023-06-24', '2023-06-25', '2023-06-26', '2023-06-27', '2023-06-28', '2023-06-29', '2023-06-30',
      '2023-07-01', '2023-07-02', '2023-07-03', '2023-07-04', '2023-07-05', '2023-07-06', '2023-07-07', '2023-07-08',
      '2023-07-09', '2023-07-10', '2023-07-11', '2023-07-12', '2023-07-13', '2023-07-14', '2023-07-15'
    ],
    ownerId: 'u2',
    coordinates: { lat: 27.9506, lng: -82.4572 }
  },
  {
    id: 'v2',
    name: 'The Grand Hall',
    type: 'indoor',
    size: 'large',
    style: ['elegant', 'classic'],
    price: 2000,
    location: 'South Tampa',
    distance: 4.2,
    rating: 4.9,
    reviews: 215,
    description: 'An elegant ballroom with high ceilings and classic architecture.',
    images: ['/venues/grandhall1.jpg', '/venues/grandhall2.jpg'],
    availability: [
      '2023-06-15', '2023-06-16', '2023-06-17', '2023-06-18', '2023-06-19', '2023-06-20', '2023-06-21', '2023-06-22', 
      '2023-06-23', '2023-06-24', '2023-06-25', '2023-06-26', '2023-06-27', '2023-06-28', '2023-06-29', '2023-06-30',
      '2023-07-01', '2023-07-02', '2023-07-03', '2023-07-04', '2023-07-05', '2023-07-06', '2023-07-07', '2023-07-08',
      '2023-07-09', '2023-07-10', '2023-07-11', '2023-07-12', '2023-07-13', '2023-07-14', '2023-07-15'
    ],
    coordinates: { lat: 27.9238, lng: -82.4681 }
  },
  {
    id: 'v3',
    name: 'Beachside Villa',
    type: 'both',
    size: 'medium',
    style: ['beach', 'villa', 'relaxed'],
    price: 1800,
    location: 'Clearwater Beach',
    distance: 8.7,
    rating: 4.6,
    reviews: 94,
    description: 'A beautiful villa with direct beach access and indoor/outdoor spaces.',
    images: ['/venues/beachvilla1.jpg', '/venues/beachvilla2.jpg'],
    availability: [
      '2023-06-15', '2023-06-16', '2023-06-17', '2023-06-18', '2023-06-19', '2023-06-20', '2023-06-21', '2023-06-22', 
      '2023-06-23', '2023-06-24', '2023-06-25', '2023-06-26', '2023-06-27', '2023-06-28', '2023-06-29', '2023-06-30',
      '2023-07-01', '2023-07-02', '2023-07-03', '2023-07-04', '2023-07-05', '2023-07-06', '2023-07-07', '2023-07-08',
      '2023-07-09', '2023-07-10', '2023-07-11', '2023-07-12', '2023-07-13', '2023-07-14', '2023-07-15'
    ],
    coordinates: { lat: 27.9659, lng: -82.8001 }
  },
  {
    id: 'v4',
    name: 'Tampa Bay Convention Center',
    type: 'indoor',
    size: 'large',
    style: ['modern', 'corporate', 'elegant'],
    price: 2500,
    location: 'Downtown Tampa',
    distance: 1.8,
    rating: 4.8,
    reviews: 178,
    description: 'A spacious convention center with state-of-the-art facilities, perfect for large corporate events and conferences.',
    images: ['/venues/convention1.jpg', '/venues/convention2.jpg'],
    availability: [
      '2025-03-21', '2025-03-28', '2025-04-04', '2025-04-11', '2025-04-18', '2025-04-25',
      '2025-05-02', '2025-05-09', '2025-05-16', '2025-05-23', '2025-05-30',
      '2025-06-06', '2025-06-13', '2025-06-20', '2025-06-27'
    ],
    coordinates: { lat: 27.9427, lng: -82.4573 }
  },
  {
    id: 'v5',
    name: 'Bayshore Gardens',
    type: 'outdoor',
    size: 'medium',
    style: ['garden', 'romantic', 'natural'],
    price: 1600,
    location: 'South Tampa',
    distance: 3.5,
    rating: 4.7,
    reviews: 132,
    description: 'A beautiful garden venue with lush landscaping and waterfront views of Tampa Bay.',
    images: ['/venues/garden1.jpg', '/venues/garden2.jpg'],
    availability: [
      '2025-03-22', '2025-03-29', '2025-04-05', '2025-04-12', '2025-04-19', '2025-04-26',
      '2025-05-03', '2025-05-10', '2025-05-17', '2025-05-24', '2025-05-31',
      '2025-06-07', '2025-06-14', '2025-06-21', '2025-06-28'
    ],
    coordinates: { lat: 27.8918, lng: -82.4808 }
  },
  {
    id: 'v6',
    name: 'Historic Ybor Cigar Factory',
    type: 'both',
    size: 'medium',
    style: ['industrial', 'historic', 'rustic'],
    price: 1900,
    location: 'Ybor City, Tampa',
    distance: 2.7,
    rating: 4.6,
    reviews: 98,
    description: 'A renovated historic cigar factory with exposed brick, high ceilings, and a blend of industrial and rustic charm.',
    images: ['/venues/cigar1.jpg', '/venues/cigar2.jpg'],
    availability: [
      '2025-03-23', '2025-03-30', '2025-04-06', '2025-04-13', '2025-04-20', '2025-04-27',
      '2025-05-04', '2025-05-11', '2025-05-18', '2025-05-25',
      '2025-06-01', '2025-06-08', '2025-06-15', '2025-06-22', '2025-06-29'
    ],
    coordinates: { lat: 27.9601, lng: -82.4339 }
  },
  {
    id: 'v7',
    name: 'Waterside Yacht Club',
    type: 'both',
    size: 'large',
    style: ['luxury', 'waterfront', 'elegant'],
    price: 2800,
    location: 'Harbor Island, Tampa',
    distance: 2.1,
    rating: 4.9,
    reviews: 156,
    description: 'An exclusive yacht club with indoor and outdoor spaces, offering stunning views of the water and Tampa skyline.',
    images: ['/venues/yacht1.jpg', '/venues/yacht2.jpg'],
    availability: [
      '2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20', '2025-03-24', '2025-03-25',
      '2025-03-26', '2025-03-27', '2025-03-31', '2025-04-01', '2025-04-02', '2025-04-03',
      '2025-04-07', '2025-04-08', '2025-04-09', '2025-04-10', '2025-04-14', '2025-04-15'
    ],
    coordinates: { lat: 27.9419, lng: -82.4518 }
  },
  {
    id: 'v8',
    name: 'Tampa Arts Center',
    type: 'indoor',
    size: 'medium',
    style: ['artistic', 'contemporary', 'cultural'],
    price: 1700,
    location: 'Tampa Heights',
    distance: 2.9,
    rating: 4.5,
    reviews: 87,
    description: 'A contemporary arts center with gallery spaces and a modern event hall, perfect for creative and cultural events.',
    images: ['/venues/arts1.jpg', '/venues/arts2.jpg'],
    availability: [
      '2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20', '2025-03-24', '2025-03-25',
      '2025-03-26', '2025-03-27', '2025-03-31', '2025-04-01', '2025-04-02', '2025-04-03',
      '2025-04-07', '2025-04-08', '2025-04-09', '2025-04-10', '2025-04-14', '2025-04-15'
    ],
    coordinates: { lat: 27.9622, lng: -82.4614 }
  }
];

export const djs: DJ[] = [
  {
    id: 'dj1',
    name: 'DJ Pulse',
    genres: ['House', 'Electronic', 'Pop', 'Techno'],
    experience: 8,
    price: 800,
    rating: 4.8,
    reviews: 156,
    bio: 'Specializing in house and electronic music with 8 years of experience in top clubs.',
    image: '/djs/djpulse.jpg',
    availability: [
      '2023-06-15', '2023-06-16', '2023-06-17', '2023-06-18', '2023-06-19', '2023-06-20', '2023-06-21', '2023-06-22', 
      '2023-06-23', '2023-06-24', '2023-06-25', '2023-06-26', '2023-06-27', '2023-06-28', '2023-06-29', '2023-06-30',
      '2023-07-01', '2023-07-02', '2023-07-03', '2023-07-04', '2023-07-05', '2023-07-06', '2023-07-07', '2023-07-08',
      '2023-07-09', '2023-07-10', '2023-07-11', '2023-07-12', '2023-07-13', '2023-07-14', '2023-07-15'
    ],
    maxTravelDistance: 30, // Willing to travel up to 30 km
    ownerId: 'u3',
    coordinates: { lat: 27.9477, lng: -82.4584 }
  },
  {
    id: 'dj2',
    name: 'DJ Harmony',
    genres: ['Hip Hop', 'R&B', 'Top 40'],
    experience: 5,
    price: 650,
    rating: 4.6,
    reviews: 89,
    bio: 'Creating the perfect vibe with a mix of hip hop, R&B, and current hits.',
    image: '/djs/djharmony.jpg',
    availability: [
      '2023-06-15', '2023-06-16', '2023-06-17', '2023-06-18', '2023-06-19', '2023-06-20', '2023-06-21', '2023-06-22', 
      '2023-06-23', '2023-06-24', '2023-06-25', '2023-06-26', '2023-06-27', '2023-06-28', '2023-06-29', '2023-06-30',
      '2023-07-01', '2023-07-02', '2023-07-03', '2023-07-04', '2023-07-05', '2023-07-06', '2023-07-07', '2023-07-08',
      '2023-07-09', '2023-07-10', '2023-07-11', '2023-07-12', '2023-07-13', '2023-07-14', '2023-07-15'
    ],
    maxTravelDistance: 20, // Willing to travel up to 20 km
    coordinates: { lat: 27.9654, lng: -82.4301 }
  },
  {
    id: 'dj3',
    name: 'DJ Rhythm',
    genres: ['Latin', 'Reggaeton', 'Dance', 'Techno'],
    experience: 10,
    price: 900,
    rating: 4.9,
    reviews: 203,
    bio: 'Bringing the heat with Latin rhythms and international dance music for over a decade.',
    image: '/djs/djrhythm.jpg',
    availability: [
      '2023-06-15', '2023-06-16', '2023-06-17', '2023-06-18', '2023-06-19', '2023-06-20', '2023-06-21', '2023-06-22', 
      '2023-06-23', '2023-06-24', '2023-06-25', '2023-06-26', '2023-06-27', '2023-06-28', '2023-06-29', '2023-06-30',
      '2023-07-01', '2023-07-02', '2023-07-03', '2023-07-04', '2023-07-05', '2023-07-06', '2023-07-07', '2023-07-08',
      '2023-07-09', '2023-07-10', '2023-07-11', '2023-07-12', '2023-07-13', '2023-07-14', '2023-07-15'
    ],
    maxTravelDistance: 40, // Willing to travel up to 40 km
    coordinates: { lat: 27.9420, lng: -82.4664 }
  },
  {
    id: 'dj4',
    name: 'DJ Fusion',
    genres: ['Electronic', 'Dance', 'House', 'Pop'],
    experience: 7,
    price: 750,
    rating: 4.7,
    reviews: 124,
    bio: 'Creating unforgettable dance experiences with a fusion of electronic and pop music.',
    image: '/djs/djfusion.jpg',
    availability: [
      '2025-03-21', '2025-03-28', '2025-04-04', '2025-04-11', '2025-04-18', '2025-04-25',
      '2025-05-02', '2025-05-09', '2025-05-16', '2025-05-23', '2025-05-30',
      '2025-06-06', '2025-06-13', '2025-06-20', '2025-06-27'
    ],
    maxTravelDistance: 25, // Willing to travel up to 25 km
    coordinates: { lat: 27.9506, lng: -82.4572 }
  },
  {
    id: 'dj5',
    name: 'DJ Vibe',
    genres: ['Hip Hop', 'R&B', 'Soul', 'Funk'],
    experience: 9,
    price: 850,
    rating: 4.8,
    reviews: 167,
    bio: 'Specializing in soulful vibes and hip hop classics that keep the dance floor packed all night.',
    image: '/djs/djvibe.jpg',
    availability: [
      '2025-03-22', '2025-03-29', '2025-04-05', '2025-04-12', '2025-04-19', '2025-04-26',
      '2025-05-03', '2025-05-10', '2025-05-17', '2025-05-24', '2025-05-31',
      '2025-06-07', '2025-06-14', '2025-06-21', '2025-06-28'
    ],
    maxTravelDistance: 15, // Willing to travel up to 15 km
    coordinates: { lat: 27.9654, lng: -82.4301 }
  },
  {
    id: 'dj6',
    name: 'DJ Fiesta',
    genres: ['Latin', 'Reggaeton', 'Salsa', 'Bachata'],
    experience: 12,
    price: 950,
    rating: 4.9,
    reviews: 213,
    bio: 'Tampa\'s premier Latin DJ bringing the heat with authentic Latin rhythms and dance music.',
    image: '/djs/djfiesta.jpg',
    availability: [
      '2025-03-23', '2025-03-30', '2025-04-06', '2025-04-13', '2025-04-20', '2025-04-27',
      '2025-05-04', '2025-05-11', '2025-05-18', '2025-05-25',
      '2025-06-01', '2025-06-08', '2025-06-15', '2025-06-22', '2025-06-29'
    ],
    maxTravelDistance: 50, // Willing to travel up to 50 km
    coordinates: { lat: 27.9601, lng: -82.4339 }
  },
  {
    id: 'dj7',
    name: 'DJ Retro',
    genres: ['80s', '90s', 'Rock', 'Pop Classics'],
    experience: 15,
    price: 800,
    rating: 4.6,
    reviews: 142,
    bio: 'Taking you back in time with the best hits from the 80s, 90s, and classic rock anthems.',
    image: '/djs/djretro.jpg',
    availability: [
      '2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20', '2025-03-24', '2025-03-25',
      '2025-03-26', '2025-03-27', '2025-03-31', '2025-04-01', '2025-04-02', '2025-04-03',
      '2025-04-07', '2025-04-08', '2025-04-09', '2025-04-10', '2025-04-14', '2025-04-15'
    ],
    maxTravelDistance: 35, // Willing to travel up to 35 km
    coordinates: { lat: 27.9419, lng: -82.4518 }
  },
  {
    id: 'dj8',
    name: 'DJ Chill',
    genres: ['Lounge', 'Ambient', 'Chill', 'Downtempo'],
    experience: 6,
    price: 700,
    rating: 4.5,
    reviews: 98,
    bio: 'Creating relaxed, sophisticated atmospheres with ambient and lounge music for upscale events.',
    image: '/djs/djchill.jpg',
    availability: [
      '2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20', '2025-03-24', '2025-03-25',
      '2025-03-26', '2025-03-27', '2025-03-31', '2025-04-01', '2025-04-02', '2025-04-03',
      '2025-04-07', '2025-04-08', '2025-04-09', '2025-04-10', '2025-04-14', '2025-04-15'
    ],
    maxTravelDistance: 20, // Willing to travel up to 20 km
    coordinates: { lat: 27.9622, lng: -82.4614 }
  }
];

export const cateringServices: CateringService[] = [
  {
    id: 'c1',
    name: 'Gourmet Delights',
    cuisineType: ['International', 'Fusion', 'Gourmet'],
    price: 75,
    rating: 4.7,
    reviews: 112,
    description: 'Exquisite international cuisine with a modern twist, using locally sourced ingredients.',
    image: '/catering/gourmet.jpg',
    availability: [
      '2023-06-15', '2023-06-16', '2023-06-17', '2023-06-18', '2023-06-19', '2023-06-20', '2023-06-21', '2023-06-22', 
      '2023-06-23', '2023-06-24', '2023-06-25', '2023-06-26', '2023-06-27', '2023-06-28', '2023-06-29', '2023-06-30',
      '2023-07-01', '2023-07-02', '2023-07-03', '2023-07-04', '2023-07-05', '2023-07-06', '2023-07-07', '2023-07-08',
      '2023-07-09', '2023-07-10', '2023-07-11', '2023-07-12', '2023-07-13', '2023-07-14', '2023-07-15'
    ],
    maxTravelDistance: 25, // Willing to travel up to 25 km
    ownerId: 'u4',
    coordinates: { lat: 27.9506, lng: -82.4572 }
  },
  {
    id: 'c2',
    name: 'Taste of Italy',
    cuisineType: ['Italian', 'Mediterranean'],
    price: 60,
    rating: 4.5,
    reviews: 87,
    description: 'Authentic Italian dishes prepared by chefs with experience in top restaurants in Italy.',
    image: '/catering/italian.jpg',
    availability: [
      '2023-06-15', '2023-06-16', '2023-06-17', '2023-06-18', '2023-06-19', '2023-06-20', '2023-06-21', '2023-06-22', 
      '2023-06-23', '2023-06-24', '2023-06-25', '2023-06-26', '2023-06-27', '2023-06-28', '2023-06-29', '2023-06-30',
      '2023-07-01', '2023-07-02', '2023-07-03', '2023-07-04', '2023-07-05', '2023-07-06', '2023-07-07', '2023-07-08',
      '2023-07-09', '2023-07-10', '2023-07-11', '2023-07-12', '2023-07-13', '2023-07-14', '2023-07-15'
    ],
    maxTravelDistance: 30, // Willing to travel up to 30 km
    coordinates: { lat: 27.9654, lng: -82.4301 }
  },
  {
    id: 'c3',
    name: 'Asian Fusion',
    cuisineType: ['Japanese', 'Chinese', 'Thai', 'Fusion'],
    price: 65,
    rating: 4.6,
    reviews: 94,
    description: 'A blend of Asian flavors creating a unique culinary experience for your guests.',
    image: '/catering/asian.jpg',
    availability: [
      '2023-06-15', '2023-06-16', '2023-06-17', '2023-06-18', '2023-06-19', '2023-06-20', '2023-06-21', '2023-06-22', 
      '2023-06-23', '2023-06-24', '2023-06-25', '2023-06-26', '2023-06-27', '2023-06-28', '2023-06-29', '2023-06-30',
      '2023-07-01', '2023-07-02', '2023-07-03', '2023-07-04', '2023-07-05', '2023-07-06', '2023-07-07', '2023-07-08',
      '2023-07-09', '2023-07-10', '2023-07-11', '2023-07-12', '2023-07-13', '2023-07-14', '2023-07-15'
    ],
    maxTravelDistance: 20, // Willing to travel up to 20 km
    coordinates: { lat: 27.9420, lng: -82.4664 }
  },
  {
    id: 'c4',
    name: 'Tampa Bay Seafood',
    cuisineType: ['Seafood', 'American', 'Grill'],
    price: 85,
    rating: 4.8,
    reviews: 145,
    description: 'Fresh local seafood prepared with a Tampa flair, featuring Gulf shrimp, stone crab, and fresh catch of the day.',
    image: '/catering/seafood.jpg',
    availability: [
      '2025-03-21', '2025-03-28', '2025-04-04', '2025-04-11', '2025-04-18', '2025-04-25',
      '2025-05-02', '2025-05-09', '2025-05-16', '2025-05-23', '2025-05-30',
      '2025-06-06', '2025-06-13', '2025-06-20', '2025-06-27'
    ],
    maxTravelDistance: 15, // Willing to travel up to 15 km
    coordinates: { lat: 27.9506, lng: -82.4572 }
  },
  {
    id: 'c5',
    name: 'Latin Flavors',
    cuisineType: ['Cuban', 'Spanish', 'Latin American'],
    price: 65,
    rating: 4.7,
    reviews: 132,
    description: 'Authentic Latin cuisine with a focus on Cuban and Spanish dishes, celebrating Tampa\'s rich cultural heritage.',
    image: '/catering/latin.jpg',
    availability: [
      '2025-03-22', '2025-03-29', '2025-04-05', '2025-04-12', '2025-04-19', '2025-04-26',
      '2025-05-03', '2025-05-10', '2025-05-17', '2025-05-24', '2025-05-31',
      '2025-06-07', '2025-06-14', '2025-06-21', '2025-06-28'
    ],
    maxTravelDistance: 40, // Willing to travel up to 40 km
    coordinates: { lat: 27.9654, lng: -82.4301 }
  },
  {
    id: 'c6',
    name: 'Southern Comfort',
    cuisineType: ['Southern', 'BBQ', 'Comfort Food'],
    price: 70,
    rating: 4.6,
    reviews: 118,
    description: 'Hearty Southern comfort food and BBQ, featuring slow-smoked meats and classic Southern sides.',
    image: '/catering/southern.jpg',
    availability: [
      '2025-03-23', '2025-03-30', '2025-04-06', '2025-04-13', '2025-04-20', '2025-04-27',
      '2025-05-04', '2025-05-11', '2025-05-18', '2025-05-25',
      '2025-06-01', '2025-06-08', '2025-06-15', '2025-06-22', '2025-06-29'
    ],
    maxTravelDistance: 35, // Willing to travel up to 35 km
    coordinates: { lat: 27.9601, lng: -82.4339 }
  },
  {
    id: 'c7',
    name: 'Green Cuisine',
    cuisineType: ['Vegan', 'Vegetarian', 'Organic', 'Gluten-Free'],
    price: 75,
    rating: 4.5,
    reviews: 92,
    description: 'Plant-based and health-conscious catering with organic ingredients and options for various dietary needs.',
    image: '/catering/vegan.jpg',
    availability: [
      '2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20', '2025-03-24', '2025-03-25',
      '2025-03-26', '2025-03-27', '2025-03-31', '2025-04-01', '2025-04-02', '2025-04-03',
      '2025-04-07', '2025-04-08', '2025-04-09', '2025-04-10', '2025-04-14', '2025-04-15'
    ],
    maxTravelDistance: 25, // Willing to travel up to 25 km
    coordinates: { lat: 27.9419, lng: -82.4518 }
  },
  {
    id: 'c8',
    name: 'Sweet Celebrations',
    cuisineType: ['Desserts', 'Pastries', 'Cakes', 'Sweets'],
    price: 55,
    rating: 4.9,
    reviews: 156,
    description: 'Specializing in gourmet desserts, custom cakes, and sweet treats for special occasions and events.',
    image: '/catering/desserts.jpg',
    availability: [
      '2025-03-17', '2025-03-18', '2025-03-19', '2025-03-20', '2025-03-24', '2025-03-25',
      '2025-03-26', '2025-03-27', '2025-03-31', '2025-04-01', '2025-04-02', '2025-04-03',
      '2025-04-07', '2025-04-08', '2025-04-09', '2025-04-10', '2025-04-14', '2025-04-15'
    ],
    maxTravelDistance: 20, // Willing to travel up to 20 km
    coordinates: { lat: 27.9622, lng: -82.4614 }
  }
];

export const events: Event[] = [
  {
    id: 'e1',
    name: 'Summer Solstice Party',
    date: '2023-06-21',
    venue: 'v1',
    dj: 'dj1',
    catering: 'c1',
    isPublic: true,
    attendees: 120,
    description: 'Celebrate the longest day of the year with music, food, and amazing views!',
    image: '/events/summersolstice.jpg'
  },
  {
    id: 'e2',
    name: 'Beachside Fiesta',
    date: '2023-06-24',
    venue: 'v3',
    dj: 'dj3',
    catering: 'c2',
    isPublic: true,
    attendees: 85,
    description: 'Latin rhythms and Italian cuisine by the beach - the perfect summer combination!',
    image: '/events/beachfiesta.jpg'
  },
  {
    id: 'e3',
    name: 'Elegant Gala Night',
    date: '2023-06-30',
    venue: 'v2',
    dj: 'dj2',
    catering: 'c3',
    isPublic: false,
    attendees: 200,
    description: 'A sophisticated evening of fine dining and dancing in our grand ballroom.',
    image: '/events/gala.jpg'
  }
];

// Mock Users
export const users: User[] = [
  {
    id: 'u1',
    username: 'alexjohnson',
    email: 'alex.johnson@example.com',
    password: 'password123',
    role: 'client',
    name: 'Alex Johnson',
    phone: '+1 (555) 123-4567',
    avatar: '/avatars/alex.jpg',
    eventsCreated: 12,
    eventsAttended: 28,
    rating: 4.8,
    reviews: 15,
    badges: ['Top Organizer', 'Party Pro', 'Verified User'],
    location: {
      address: 'Tampa, FL',
      coordinates: {
        lat: 27.9506,
        lng: -82.4572
      }
    }
  },
  {
    id: 'u2',
    username: 'skylinerooftop',
    email: 'info@skylinerooftop.com',
    password: 'venue123',
    role: 'venue',
    name: 'Skyline Rooftop',
    phone: '+1 (555) 234-5678',
    rating: 4.7,
    reviews: 128,
    calendarConnected: false,
    location: {
      address: 'Downtown Tampa, FL',
      coordinates: {
        lat: 27.9506,
        lng: -82.4572
      }
    }
  },
  {
    id: 'u3',
    username: 'djpulse',
    email: 'djpulse@example.com',
    password: 'dj123',
    role: 'dj',
    name: 'DJ Pulse',
    phone: '+1 (555) 345-6789',
    avatar: '/djs/djpulse.jpg',
    rating: 4.8,
    reviews: 156,
    calendarConnected: true,
    calendarType: 'google',
    maxTravelDistance: 30, // Willing to travel up to 30 km
    location: {
      address: 'Ybor City, Tampa, FL',
      coordinates: {
        lat: 27.9477,
        lng: -82.4584
      }
    }
  },
  {
    id: 'u4',
    username: 'gourmetdelights',
    email: 'contact@gourmetdelights.com',
    password: 'catering123',
    role: 'caterer',
    name: 'Gourmet Delights',
    phone: '+1 (555) 456-7890',
    rating: 4.7,
    reviews: 112,
    calendarConnected: false,
    maxTravelDistance: 25, // Willing to travel up to 25 km
    location: {
      address: 'Tampa, FL',
      coordinates: {
        lat: 27.9506,
        lng: -82.4572
      }
    }
  }
];

// Empty arrays for new service categories
export const entertainment: Entertainment[] = [];
export const photography: Photography[] = [];
export const decoration: Decoration[] = [];
export const audioVisual: AudioVisual[] = [];
export const furniture: Furniture[] = [];
export const barServices: BarService[] = [];
export const security: Security[] = [];

// Helper function to calculate distance between two coordinates (in km)
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
};

// Function to filter DJs based on their maximum travel distance from a venue
export const filterDJsByTravelDistance = (venueId: string): DJ[] => {
  const selectedVenue = venues.find(venue => venue.id === venueId);
  
  if (!selectedVenue || !selectedVenue.coordinates) {
    return djs; // Return all DJs if venue not found or has no coordinates
  }
  
  return djs.filter(dj => {
    if (!dj.coordinates || dj.maxTravelDistance === undefined) {
      return false; // Skip DJs without coordinates or maxTravelDistance
    }
    
    const distance = calculateDistance(
      selectedVenue.coordinates!.lat,
      selectedVenue.coordinates!.lng,
      dj.coordinates.lat,
      dj.coordinates.lng
    );
    
    // DJ is available if the venue is within their maximum travel distance
    return distance <= dj.maxTravelDistance;
  });
};

// Function to filter caterers based on their maximum travel distance from a venue
export const filterCaterersByTravelDistance = (venueId: string): CateringService[] => {
  const selectedVenue = venues.find(venue => venue.id === venueId);
  
  if (!selectedVenue || !selectedVenue.coordinates) {
    return cateringServices; // Return all caterers if venue not found or has no coordinates
  }
  
  return cateringServices.filter(caterer => {
    if (!caterer.coordinates || caterer.maxTravelDistance === undefined) {
      return false; // Skip caterers without coordinates or maxTravelDistance
    }
    
    const distance = calculateDistance(
      selectedVenue.coordinates!.lat,
      selectedVenue.coordinates!.lng,
      caterer.coordinates.lat,
      caterer.coordinates.lng
    );
    
    // Caterer is available if the venue is within their maximum travel distance
    return distance <= caterer.maxTravelDistance;
  });
}; 