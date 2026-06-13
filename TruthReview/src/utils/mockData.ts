export interface PGItem {
  id: string;
  name: string;
  type: 'boys' | 'girls' | 'unisex';
  rating: number;
  reviewsCount: number;
  location: string;
  price: number;
  images: string[];
  facilities: string[];
  contactNumber: string;
  description: string;
  featured?: boolean;
}

export const mockPGs: PGItem[] = [
  {
    id: 'pg_1',
    name: "Elite Men's Luxury PG",
    type: 'boys',
    rating: 4.8,
    reviewsCount: 124,
    location: 'Adyar, Chennai',
    price: 8500,
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
    ],
    facilities: ['AC', 'High-Speed Wi-Fi', 'Daily Cleaning', '3 Meals Veg/Non-Veg', 'CCTV Security', 'Gym Access'],
    contactNumber: '+91 98765 43210',
    description: 'Elite Men\'s Luxury PG offers premium shared and single occupancy rooms for students and working professionals. Located in the heart of Adyar with close proximity to public transport, IT hubs, and top universities.',
    featured: true,
  },
  {
    id: 'pg_2',
    name: 'Stanza Living Ladies Stay',
    type: 'girls',
    rating: 4.7,
    reviewsCount: 89,
    location: 'Velachery, Chennai',
    price: 9500,
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    ],
    facilities: ['High-Speed Wi-Fi', '24/7 Power Backup', 'Biometric Entry', 'Laundry Service', 'AC', 'Veg Meals Included'],
    contactNumber: '+91 87654 32109',
    description: 'A modern, secure, and fully managed ladies PG in Velachery. Specifically designed for working women and students who value hygiene, safety, and community living.',
    featured: true,
  },
  {
    id: 'pg_3',
    name: 'Co-Fi Co-Living Hub',
    type: 'unisex',
    rating: 4.9,
    reviewsCount: 202,
    location: 'Oaks Road, OMR',
    price: 12000,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    ],
    facilities: ['AC', 'Modular Kitchen', 'Dedicated Workstations', 'Superfast Wi-Fi', 'Gaming Zone', 'Washing Machine', 'Cafeteria'],
    contactNumber: '+91 76543 21098',
    description: 'An premium unisex co-living space tailored for IT professionals on OMR. Features private studio rooms, shared spaces, dynamic community events, and double-tier biometric security.',
    featured: true,
  },
  {
    id: 'pg_4',
    name: 'Student Stay Residency',
    type: 'boys',
    rating: 4.2,
    reviewsCount: 45,
    location: 'Tambaram, Chennai',
    price: 5500,
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80',
    ],
    facilities: ['Wi-Fi', 'Purified Water', 'Attach Bathroom', 'CCTV Security', 'Parking Space'],
    contactNumber: '+91 65432 10987',
    description: 'Affordable, neat and clean accommodation for college students in Tambaram. Located within walking distance to train and bus station.',
    featured: false,
  },
  {
    id: 'pg_5',
    name: 'Serene Haven PG for Women',
    type: 'girls',
    rating: 4.5,
    reviewsCount: 37,
    location: 'T. Nagar, Chennai',
    price: 7500,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    ],
    facilities: ['Daily Housekeeping', '24/7 Security Wardens', 'Wi-Fi', 'Self-cooking Kitchen', 'Washing Area'],
    contactNumber: '+91 54321 09876',
    description: 'Quiet, clean, and highly secure PG accommodation for girls in T. Nagar. Home-like food options and friendly housekeepers to make your stay pleasant.',
    featured: false,
  },
];
