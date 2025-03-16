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
}

export interface Event {
  id: string;
  name: string;
  date: string;
  venue: string;
  dj: string;
  catering?: string;
  isPublic: boolean;
  attendees: number;
  description: string;
  image: string;
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
    location: 'Downtown',
    distance: 2.5,
    rating: 4.7,
    reviews: 128,
    description: 'A stunning rooftop venue with panoramic city views, perfect for evening events.',
    images: ['/venues/skyline1.jpg', '/venues/skyline2.jpg'],
    availability: ['2023-06-15', '2023-06-16', '2023-06-22']
  },
  {
    id: 'v2',
    name: 'The Grand Hall',
    type: 'indoor',
    size: 'large',
    style: ['elegant', 'classic'],
    price: 2000,
    location: 'Midtown',
    distance: 4.2,
    rating: 4.9,
    reviews: 215,
    description: 'An elegant ballroom with high ceilings and classic architecture.',
    images: ['/venues/grandhall1.jpg', '/venues/grandhall2.jpg'],
    availability: ['2023-06-18', '2023-06-25', '2023-06-30']
  },
  {
    id: 'v3',
    name: 'Beachside Villa',
    type: 'both',
    size: 'medium',
    style: ['beach', 'villa', 'relaxed'],
    price: 1800,
    location: 'Coastal Area',
    distance: 8.7,
    rating: 4.6,
    reviews: 94,
    description: 'A beautiful villa with direct beach access and indoor/outdoor spaces.',
    images: ['/venues/beachvilla1.jpg', '/venues/beachvilla2.jpg'],
    availability: ['2023-06-17', '2023-06-24', '2023-07-01']
  }
];

export const djs: DJ[] = [
  {
    id: 'dj1',
    name: 'DJ Pulse',
    genres: ['House', 'Electronic', 'Pop'],
    experience: 8,
    price: 800,
    rating: 4.8,
    reviews: 156,
    bio: 'Specializing in house and electronic music with 8 years of experience in top clubs.',
    image: '/djs/djpulse.jpg',
    availability: ['2023-06-15', '2023-06-16', '2023-06-22', '2023-06-23']
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
    availability: ['2023-06-17', '2023-06-18', '2023-06-24', '2023-06-25']
  },
  {
    id: 'dj3',
    name: 'DJ Rhythm',
    genres: ['Latin', 'Reggaeton', 'Dance'],
    experience: 10,
    price: 900,
    rating: 4.9,
    reviews: 203,
    bio: 'Bringing the heat with Latin rhythms and international dance music for over a decade.',
    image: '/djs/djrhythm.jpg',
    availability: ['2023-06-16', '2023-06-23', '2023-06-30', '2023-07-01']
  }
];

export const cateringServices: CateringService[] = [
  {
    id: 'c1',
    name: 'Gourmet Delights',
    cuisineType: ['International', 'Fusion', 'Gourmet'],
    price: 75, // per person
    rating: 4.7,
    reviews: 112,
    description: 'Exquisite international cuisine with a modern twist, using locally sourced ingredients.',
    image: '/catering/gourmet.jpg',
    availability: ['2023-06-15', '2023-06-16', '2023-06-22', '2023-06-23']
  },
  {
    id: 'c2',
    name: 'Taste of Italy',
    cuisineType: ['Italian', 'Mediterranean'],
    price: 60, // per person
    rating: 4.5,
    reviews: 87,
    description: 'Authentic Italian dishes prepared by chefs with experience in top restaurants in Italy.',
    image: '/catering/italian.jpg',
    availability: ['2023-06-17', '2023-06-18', '2023-06-24', '2023-06-25']
  },
  {
    id: 'c3',
    name: 'Asian Fusion',
    cuisineType: ['Japanese', 'Chinese', 'Thai', 'Fusion'],
    price: 65, // per person
    rating: 4.6,
    reviews: 94,
    description: 'A blend of Asian flavors creating a unique culinary experience for your guests.',
    image: '/catering/asian.jpg',
    availability: ['2023-06-16', '2023-06-23', '2023-06-30', '2023-07-01']
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