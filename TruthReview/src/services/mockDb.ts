import { storage } from './storage';

export type PropertyType = 'PG' | 'Hostel' | 'Hotel' | 'Service Apartment' | 'Rental Room' | 'Co-Living Property';
export type GenderType = 'boys' | 'girls' | 'unisex' | 'none';

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  genderType: GenderType;
  price: number;
  location: string;
  address: string;
  area: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  description: string;
  images: string[];
  officialImages: string[];
  facilities: string[];
  contactNumber: string;
  trustScore: number; // calculated dynamically 0-100
  reviewsCount: number;
  complaintsCount: number;
  claimedBy: string | null; // owner user ID or null
  featured?: boolean;
}

export interface ReviewRatings {
  cleanliness: number;
  food: number;
  security: number;
  wifi: number;
  staff: number;
  location: number;
  water: number;
  valueForMoney: number;
  overall: number;
}

export interface Review {
  id: string;
  propertyId: string;
  reviewerId: string;
  reviewerName?: string;
  ratings: ReviewRatings;
  comment: string;
  pros: string[];
  cons: string[];
  recommended: boolean;
  photos: {
    room?: string;
    food?: string;
    washroom?: string;
    building?: string;
  };
  stayDuration: number; // in months
  stayStartDate: string; // e.g. "October 2025"
  date: string; // e.g. "12 May 2026"
  verified: boolean;
  ownerReply: {
    comment: string;
    date: string;
  } | null;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  propertyId: string;
  reviewId: string;
  documentType: 'Rent Receipt' | 'Hostel ID' | 'Utility Bill' | 'Room Photograph' | 'Booking Confirmation';
  documentUri: string;
  stayDuration: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface ClaimRequest {
  id: string;
  userId: string;
  propertyId: string;
  businessProofUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface UserReport {
  id: string;
  userId: string;
  reviewId: string;
  type: 'Fake Review' | 'Abusive Content' | 'Spam' | 'Wrong Property Information';
  comment: string;
  status: 'pending' | 'resolved';
  date: string;
}

export interface ComplaintStats {
  food: number;
  water: number;
  security: number;
  staff: number;
  valueForMoney: number;
}

const STORAGE_DB_KEYS = {
  PROPERTIES: '@db_properties',
  REVIEWS: '@db_reviews',
  VERIFICATIONS: '@db_verifications',
  CLAIMS: '@db_claims',
  REPORTS: '@db_reports',
};

// Initial static seed data
const initialProperties: Property[] = [
  {
    id: 'prop_1',
    name: "Elite Men's Luxury PG",
    type: 'PG',
    genderType: 'boys',
    price: 8500,
    location: 'Adyar, Chennai',
    address: 'No 15, Sardar Patel Road, Adyar',
    area: 'Adyar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 13.0067,
    longitude: 80.2578,
    description: "Elite Men's Luxury PG offers premium shared and single occupancy rooms for students and working professionals. Located in the heart of Adyar with close proximity to IT hubs, top universities, and transport.",
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
    ],
    officialImages: [],
    facilities: ['AC Available', 'WiFi Available', 'Food Included', 'Daily Cleaning', 'CCTV Security', 'Gym Access'],
    contactNumber: '+91 98765 43210',
    trustScore: 88,
    reviewsCount: 2,
    complaintsCount: 0,
    claimedBy: null,
    featured: true,
  },
  {
    id: 'prop_2',
    name: 'Stanza Living Ladies Stay',
    type: 'Hostel',
    genderType: 'girls',
    price: 9500,
    location: 'Velachery, Chennai',
    address: 'Plot 42, 100 Feet Bypass Road, Velachery',
    area: 'Velachery',
    city: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 12.9801,
    longitude: 80.2224,
    description: 'A modern, secure, and fully managed ladies hostel in Velachery. Specifically designed for working women and students who value hygiene, safety, and community living.',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    ],
    officialImages: [],
    facilities: ['WiFi Available', 'Food Included', '24/7 Power Backup', 'Biometric Entry', 'Laundry Service', 'AC Available'],
    contactNumber: '+91 87654 32109',
    trustScore: 92,
    reviewsCount: 2,
    complaintsCount: 1,
    claimedBy: 'owner_123', // pre-claimed by default demo owner
    featured: true,
  },
  {
    id: 'prop_3',
    name: 'Co-Fi Co-Living Hub',
    type: 'Co-Living Property',
    genderType: 'unisex',
    price: 12000,
    location: 'Perungudi, OMR',
    address: 'Block A, Kandanchavadi Industrial Estate, Perungudi',
    area: 'Perungudi',
    city: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 12.9654,
    longitude: 80.2484,
    description: 'A premium unisex co-living space tailored for IT professionals on OMR. Features private studio suites, shared modular kitchens, co-working spaces, gym access, and double-tier biometric security.',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
    ],
    officialImages: [],
    facilities: ['AC Available', 'WiFi Available', 'Modular Kitchen', 'Dedicated Workstations', 'Gym Access', 'Washing Machine'],
    contactNumber: '+91 76543 21098',
    trustScore: 78,
    reviewsCount: 1,
    complaintsCount: 1,
    claimedBy: null,
    featured: true,
  },
  {
    id: 'prop_4',
    name: 'Standard Budget Rental Room',
    type: 'Rental Room',
    genderType: 'none',
    price: 5000,
    location: 'Tambaram, Chennai',
    address: 'No 7, Station Road, Tambaram East',
    area: 'Tambaram',
    city: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 12.9249,
    longitude: 80.1264,
    description: 'Affordable, independent single room for rent in Tambaram. Located within walking distance to public transport, railway station, and local markets.',
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80',
    ],
    officialImages: [],
    facilities: ['WiFi Available', 'Water Supply', 'Attached Bathroom', 'Parking Space'],
    contactNumber: '+91 65432 10987',
    trustScore: 45,
    reviewsCount: 1,
    complaintsCount: 2,
    claimedBy: null,
    featured: false,
  },
  {
    id: 'prop_5',
    name: 'Serene Haven Service Apartments',
    type: 'Service Apartment',
    genderType: 'unisex',
    price: 18000,
    location: 'T. Nagar, Chennai',
    address: 'No 22, GN Chetty Road, T. Nagar',
    area: 'T. Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 13.0418,
    longitude: 80.2341,
    description: 'Fully serviced premium luxury apartments for short and long-term stays in T. Nagar. Includes daily housekeeping, chef-on-demand services, and fully-equipped kitchen.',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    ],
    officialImages: [],
    facilities: ['AC Available', 'WiFi Available', 'Daily Cleaning', 'Modular Kitchen', 'CCTV Security', '24/7 Power Backup'],
    contactNumber: '+91 54321 09876',
    trustScore: 94,
    reviewsCount: 1,
    complaintsCount: 0,
    claimedBy: null,
    featured: false,
  },
];

const initialReviews: Review[] = [
  {
    id: 'rev_1',
    propertyId: 'prop_1',
    reviewerId: 'user_1',
    ratings: {
      cleanliness: 5,
      food: 5,
      security: 5,
      wifi: 4,
      staff: 5,
      location: 5,
      water: 4,
      valueForMoney: 5,
      overall: 5,
    },
    comment: 'Exceptional facilities and very clean rooms. The food is high quality and feels like home-cooked meals. Safe for students and staff are highly professional.',
    pros: ['Clean Rooms', 'Good Food', 'Friendly Staff'],
    cons: ['Slightly Expensive'],
    recommended: true,
    photos: {
      room: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80',
    },
    stayDuration: 8,
    stayStartDate: 'September 2025',
    date: '12 May 2026',
    verified: true,
    ownerReply: null,
  },
  {
    id: 'rev_2',
    propertyId: 'prop_1',
    reviewerId: 'user_2',
    ratings: {
      cleanliness: 4,
      food: 4,
      security: 4,
      wifi: 3,
      staff: 4,
      location: 5,
      water: 4,
      valueForMoney: 4,
      overall: 4,
    },
    comment: 'Nice place near Adyar main road. Power backup works perfectly. Wi-Fi drops speed during peak hours of 8 PM to 10 PM. Clean toilets.',
    pros: ['Good Location', 'Clean Washrooms'],
    cons: ['Slow WiFi at night'],
    recommended: true,
    photos: {},
    stayDuration: 4,
    stayStartDate: 'January 2026',
    date: '28 May 2026',
    verified: false,
    ownerReply: null,
  },
  {
    id: 'rev_3',
    propertyId: 'prop_2',
    reviewerId: 'user_3',
    ratings: {
      cleanliness: 5,
      food: 4,
      security: 5,
      wifi: 4,
      staff: 5,
      location: 5,
      water: 5,
      valueForMoney: 4,
      overall: 5,
    },
    comment: 'Perfect hostel for girls. Extremely secure with biometric lock and 24/7 security. Rooms are tidy and cleaned daily. Fully satisfied.',
    pros: ['Extremely Secure', 'Clean Rooms', 'Helpful Staff'],
    cons: [],
    recommended: true,
    photos: {
      washroom: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=300&q=80',
    },
    stayDuration: 12,
    stayStartDate: 'June 2025',
    date: '05 May 2026',
    verified: true,
    ownerReply: {
      comment: 'Thank you for your review! We prioritize safety and cleanliness above all. We are glad you had a comfortable stay.',
      date: '06 May 2026',
    },
  },
  {
    id: 'rev_4',
    propertyId: 'prop_2',
    reviewerId: 'user_4',
    ratings: {
      cleanliness: 4,
      food: 2,
      security: 5,
      wifi: 4,
      staff: 3,
      location: 4,
      water: 4,
      valueForMoney: 3,
      overall: 3,
    },
    comment: 'Rooms are good and ventilation is fine. However, the food quality has dropped recently. It is often cold and lacks taste. Hopefully, management resolves this soon.',
    pros: ['Good Ventilation', 'Secure'],
    cons: ['Bad Food Quality'],
    recommended: false,
    photos: {},
    stayDuration: 6,
    stayStartDate: 'November 2025',
    date: '20 May 2026',
    verified: false,
    ownerReply: null,
  },
  {
    id: 'rev_5',
    propertyId: 'prop_3',
    reviewerId: 'user_5',
    ratings: {
      cleanliness: 4,
      food: 4,
      security: 4,
      wifi: 5,
      staff: 4,
      location: 4,
      water: 3,
      valueForMoney: 2,
      overall: 4,
    },
    comment: 'Fantastic internet speed and working spaces for developers. Clean environment. The only issue is the deposit refund process which takes more than 45 days.',
    pros: ['Fast WiFi', 'Great Working Space'],
    cons: ['Bad Value for Money', 'Deposit Issues'],
    recommended: true,
    photos: {
      room: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=300&q=80',
    },
    stayDuration: 9,
    stayStartDate: 'August 2025',
    date: '10 June 2026',
    verified: true,
    ownerReply: null,
  },
  {
    id: 'rev_6',
    propertyId: 'prop_4',
    reviewerId: 'user_6',
    ratings: {
      cleanliness: 2,
      food: 3,
      security: 3,
      wifi: 3,
      staff: 2,
      location: 3,
      water: 2,
      valueForMoney: 1,
      overall: 2,
    },
    comment: 'Water availability issues in the morning. Getting the deposit back from the owner is a nightmare. Highly unhygienic washroom facilities.',
    pros: [],
    cons: ['Water Issues', 'Unhygienic', 'Bad Management'],
    recommended: false,
    photos: {},
    stayDuration: 3,
    stayStartDate: 'March 2026',
    date: '01 June 2026',
    verified: false,
    ownerReply: null,
  },
  {
    id: 'rev_7',
    propertyId: 'prop_5',
    reviewerId: 'user_7',
    ratings: {
      cleanliness: 5,
      food: 5,
      security: 5,
      wifi: 5,
      staff: 5,
      location: 5,
      water: 5,
      valueForMoney: 5,
      overall: 5,
    },
    comment: 'Super luxury service apartment. Regular updates, premium clean kitchen, and friendly management. Excellent security system.',
    pros: ['Luxury', 'Clean Kitchen', 'Friendly Staff'],
    cons: [],
    recommended: true,
    photos: {
      building: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=300&q=80',
    },
    stayDuration: 5,
    stayStartDate: 'December 2025',
    date: '04 May 2026',
    verified: true,
    ownerReply: null,
  },
];

// Seed list of verification requests
const initialVerifications: VerificationRequest[] = [
  {
    id: 'veri_1',
    userId: 'user_123',
    propertyId: 'prop_1',
    reviewId: 'rev_2',
    documentType: 'Rent Receipt',
    documentUri: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=200&q=80',
    stayDuration: 4,
    status: 'pending',
    date: '28 May 2026',
  },
];

// Seed list of owner claims
const initialClaims: ClaimRequest[] = [
  {
    id: 'claim_1',
    userId: 'owner_123',
    propertyId: 'prop_3',
    businessProofUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=200&q=80',
    status: 'pending',
    date: '12 June 2026',
  },
];

// Seed list of reports
const initialReports: UserReport[] = [
  {
    id: 'rep_1',
    userId: 'user_123',
    reviewId: 'rev_6',
    type: 'Fake Review',
    comment: 'This review contains inaccurate information about water supply. Water is fine here.',
    status: 'pending',
    date: '02 June 2026',
  },
];

export class MockDb {
  private static isInitialized = false;

  public static async init() {
    if (this.isInitialized) return;

    const props = await storage.getItem(STORAGE_DB_KEYS.PROPERTIES);
    const revs = await storage.getItem(STORAGE_DB_KEYS.REVIEWS);
    const veris = await storage.getItem(STORAGE_DB_KEYS.VERIFICATIONS);
    const clms = await storage.getItem(STORAGE_DB_KEYS.CLAIMS);
    const rpts = await storage.getItem(STORAGE_DB_KEYS.REPORTS);

    if (!props) await storage.setItem(STORAGE_DB_KEYS.PROPERTIES, initialProperties);
    if (!revs) await storage.setItem(STORAGE_DB_KEYS.REVIEWS, initialReviews);
    if (!veris) await storage.setItem(STORAGE_DB_KEYS.VERIFICATIONS, initialVerifications);
    if (!clms) await storage.setItem(STORAGE_DB_KEYS.CLAIMS, initialClaims);
    if (!rpts) await storage.setItem(STORAGE_DB_KEYS.REPORTS, initialReports);

    this.isInitialized = true;
    await this.recalculateAllTrustScores();
  }

  // Get collections
  public static async getProperties(): Promise<Property[]> {
    await this.init();
    return (await storage.getItem<Property[]>(STORAGE_DB_KEYS.PROPERTIES)) || [];
  }

  public static async getReviews(): Promise<Review[]> {
    await this.init();
    return (await storage.getItem<Review[]>(STORAGE_DB_KEYS.REVIEWS)) || [];
  }

  public static async getVerifications(): Promise<VerificationRequest[]> {
    await this.init();
    return (await storage.getItem<VerificationRequest[]>(STORAGE_DB_KEYS.VERIFICATIONS)) || [];
  }

  public static async getClaims(): Promise<ClaimRequest[]> {
    await this.init();
    return (await storage.getItem<ClaimRequest[]>(STORAGE_DB_KEYS.CLAIMS)) || [];
  }

  public static async getReports(): Promise<UserReport[]> {
    await this.init();
    return (await storage.getItem<UserReport[]>(STORAGE_DB_KEYS.REPORTS)) || [];
  }

  // CRUD Properties
  public static async addProperty(property: Omit<Property, 'id' | 'trustScore' | 'reviewsCount' | 'complaintsCount' | 'claimedBy' | 'officialImages'>): Promise<Property> {
    const properties = await this.getProperties();
    
    // Duplicate check using Name + Address or Lat + Lng (closeness threshold: ~50 meters is 0.0005 degrees)
    const duplicate = properties.find(
      (p) =>
        (p.name.toLowerCase().replace(/\s/g, '') === property.name.toLowerCase().replace(/\s/g, '') &&
          p.address.toLowerCase().replace(/\s/g, '') === property.address.toLowerCase().replace(/\s/g, '')) ||
        (Math.abs(p.latitude - property.latitude) < 0.0005 &&
          Math.abs(p.longitude - property.longitude) < 0.0005)
    );

    if (duplicate) {
      throw new Error('Property already listed.');
    }

    const newProp: Property = {
      ...property,
      id: `prop_${Date.now()}`,
      trustScore: 70, // default trust score
      reviewsCount: 0,
      complaintsCount: 0,
      claimedBy: null,
      officialImages: [],
    };

    properties.push(newProp);
    await storage.setItem(STORAGE_DB_KEYS.PROPERTIES, properties);
    return newProp;
  }

  // CRUD Reviews
  public static async addReview(review: Omit<Review, 'id' | 'date' | 'verified' | 'ownerReply'>): Promise<Review> {
    const reviews = await this.getReviews();
    const newReview: Review = {
      ...review,
      id: `rev_${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      verified: false,
      ownerReply: null,
    };

    reviews.unshift(newReview);
    await storage.setItem(STORAGE_DB_KEYS.REVIEWS, reviews);
    await this.recalculatePropertyStats(review.propertyId);
    return newReview;
  }

  public static async addOwnerReply(reviewId: string, replyComment: string): Promise<Review> {
    const reviews = await this.getReviews();
    const reviewIdx = reviews.findIndex((r) => r.id === reviewId);
    if (reviewIdx === -1) {
      throw new Error('Review not found.');
    }

    reviews[reviewIdx].ownerReply = {
      comment: replyComment,
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };

    await storage.setItem(STORAGE_DB_KEYS.REVIEWS, reviews);
    await this.recalculatePropertyStats(reviews[reviewIdx].propertyId);
    return reviews[reviewIdx];
  }

  // Submit verifications, claims, reports
  public static async submitVerification(veri: Omit<VerificationRequest, 'id' | 'status' | 'date'>): Promise<VerificationRequest> {
    const verifications = await this.getVerifications();
    const newVeri: VerificationRequest = {
      ...veri,
      id: `veri_${Date.now()}`,
      status: 'pending',
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };

    verifications.unshift(newVeri);
    await storage.setItem(STORAGE_DB_KEYS.VERIFICATIONS, verifications);
    return newVeri;
  }

  public static async submitClaim(claim: Omit<ClaimRequest, 'id' | 'status' | 'date'>): Promise<ClaimRequest> {
    const claims = await this.getClaims();
    const newClaim: ClaimRequest = {
      ...claim,
      id: `claim_${Date.now()}`,
      status: 'pending',
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };

    claims.unshift(newClaim);
    await storage.setItem(STORAGE_DB_KEYS.CLAIMS, claims);
    return newClaim;
  }

  public static async submitReport(report: Omit<UserReport, 'id' | 'status' | 'date'>): Promise<UserReport> {
    const reports = await this.getReports();
    const newReport: UserReport = {
      ...report,
      id: `rep_${Date.now()}`,
      status: 'pending',
      date: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };

    reports.unshift(newReport);
    await storage.setItem(STORAGE_DB_KEYS.REPORTS, reports);
    return newReport;
  }

  // Admin approvals
  public static async adminApproveVerification(verificationId: string): Promise<void> {
    const verifications = await this.getVerifications();
    const idx = verifications.findIndex((v) => v.id === verificationId);
    if (idx === -1) return;

    verifications[idx].status = 'approved';
    await storage.setItem(STORAGE_DB_KEYS.VERIFICATIONS, verifications);

    // Update the review to verified
    const reviews = await this.getReviews();
    const revIdx = reviews.findIndex((r) => r.id === verifications[idx].reviewId);
    if (revIdx !== -1) {
      reviews[revIdx].verified = true;
      await storage.setItem(STORAGE_DB_KEYS.REVIEWS, reviews);
      // Recalculate trust score
      await this.recalculatePropertyStats(verifications[idx].propertyId);
    }
  }

  public static async adminRejectVerification(verificationId: string): Promise<void> {
    const verifications = await this.getVerifications();
    const idx = verifications.findIndex((v) => v.id === verificationId);
    if (idx === -1) return;

    verifications[idx].status = 'rejected';
    await storage.setItem(STORAGE_DB_KEYS.VERIFICATIONS, verifications);
  }

  public static async adminApproveClaim(claimId: string): Promise<void> {
    const claims = await this.getClaims();
    const idx = claims.findIndex((c) => c.id === claimId);
    if (idx === -1) return;

    claims[idx].status = 'approved';
    await storage.setItem(STORAGE_DB_KEYS.CLAIMS, claims);

    // Set claimedBy on property
    const properties = await this.getProperties();
    const propIdx = properties.findIndex((p) => p.id === claims[idx].propertyId);
    if (propIdx !== -1) {
      properties[propIdx].claimedBy = claims[idx].userId;
      await storage.setItem(STORAGE_DB_KEYS.PROPERTIES, properties);
    }
  }

  public static async adminRejectClaim(claimId: string): Promise<void> {
    const claims = await this.getClaims();
    const idx = claims.findIndex((c) => c.id === claimId);
    if (idx === -1) return;

    claims[idx].status = 'rejected';
    await storage.setItem(STORAGE_DB_KEYS.CLAIMS, claims);
  }

  public static async adminDeleteReview(reviewId: string): Promise<void> {
    const reviews = await this.getReviews();
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return;

    const filteredReviews = reviews.filter((r) => r.id !== reviewId);
    await storage.setItem(STORAGE_DB_KEYS.REVIEWS, filteredReviews);
    await this.recalculatePropertyStats(review.propertyId);

    // Resolve reports relating to this review
    const reports = await this.getReports();
    const updatedReports = reports.map((rep) => 
      rep.reviewId === reviewId ? { ...rep, status: 'resolved' as const } : rep
    );
    await storage.setItem(STORAGE_DB_KEYS.REPORTS, updatedReports);
  }

  public static async adminResolveReport(reportId: string): Promise<void> {
    const reports = await this.getReports();
    const idx = reports.findIndex((r) => r.id === reportId);
    if (idx === -1) return;

    reports[idx].status = 'resolved';
    await storage.setItem(STORAGE_DB_KEYS.REPORTS, reports);
  }

  public static async mergeDuplicateProperties(primaryId: string, duplicateId: string): Promise<void> {
    const properties = await this.getProperties();
    const reviews = await this.getReviews();
    const veris = await this.getVerifications();
    const claims = await this.getClaims();

    const primary = properties.find((p) => p.id === primaryId);
    const duplicate = properties.find((p) => p.id === duplicateId);

    if (!primary || !duplicate) throw new Error('Primary or duplicate property not found.');

    // 1. Point duplicate property reviews to primary property
    const updatedReviews = reviews.map((r) => {
      if (r.propertyId === duplicateId) {
        return { ...r, propertyId: primaryId };
      }
      return r;
    });
    await storage.setItem(STORAGE_DB_KEYS.REVIEWS, updatedReviews);

    // 2. Point verifications to primary property
    const updatedVeris = veris.map((v) => {
      if (v.propertyId === duplicateId) {
        return { ...v, propertyId: primaryId };
      }
      return v;
    });
    await storage.setItem(STORAGE_DB_KEYS.VERIFICATIONS, updatedVeris);

    // 3. Keep primary claimed status if claimed, or transfer if duplicate is claimed
    if (!primary.claimedBy && duplicate.claimedBy) {
      primary.claimedBy = duplicate.claimedBy;
    }

    // 4. Remove duplicate property from list
    const filteredProps = properties.filter((p) => p.id !== duplicateId);
    await storage.setItem(STORAGE_DB_KEYS.PROPERTIES, filteredProps);

    // 5. Recalculate stats for primary
    await this.recalculatePropertyStats(primaryId);
  }

  // Owner specific actions
  public static async updatePropertyInfo(propertyId: string, data: Partial<Property>): Promise<Property> {
    const properties = await this.getProperties();
    const idx = properties.findIndex((p) => p.id === propertyId);
    if (idx === -1) throw new Error('Property not found');

    properties[idx] = { ...properties[idx], ...data };
    await storage.setItem(STORAGE_DB_KEYS.PROPERTIES, properties);
    return properties[idx];
  }

  // Get Complaint counts for property
  public static getComplaintsStats(propertyReviews: Review[]): ComplaintStats {
    const stats: ComplaintStats = {
      food: 0,
      water: 0,
      security: 0,
      staff: 0,
      valueForMoney: 0,
    };

    propertyReviews.forEach((r) => {
      if (r.ratings.food <= 2) stats.food++;
      if (r.ratings.water <= 2) stats.water++;
      if (r.ratings.security <= 2) stats.security++;
      if (r.ratings.staff <= 2) stats.staff++;
      if (r.ratings.valueForMoney <= 2) stats.valueForMoney++;
    });

    return stats;
  }

  // Recalculations
  private static async recalculateAllTrustScores() {
    const properties = await this.getProperties();
    for (const p of properties) {
      await this.recalculatePropertyStats(p.id, false);
    }
  }

  public static async recalculatePropertyStats(propertyId: string, save = true) {
    const properties = await this.getProperties();
    const propIdx = properties.findIndex((p) => p.id === propertyId);
    if (propIdx === -1) return;

    const reviews = await this.getReviews();
    const propReviews = reviews.filter((r) => r.propertyId === propertyId);

    if (propReviews.length === 0) {
      properties[propIdx].trustScore = 70; // default for no reviews
      properties[propIdx].reviewsCount = 0;
      properties[propIdx].complaintsCount = 0;
      if (save) await storage.setItem(STORAGE_DB_KEYS.PROPERTIES, properties);
      return;
    }

    let weightedOverallSum = 0;
    let totalWeight = 0;
    let complaintPenalties = 0;
    let highQualityBonus = 0;
    let ownerReplyBonus = 0;

    // Get current date context for freshness
    const now = new Date();

    const parseReviewDate = (dateStr: string): Date => {
      try {
        const parts = dateStr.split(' ');
        if (parts.length === 3) {
          const day = parseInt(parts[0], 10);
          const monthName = parts[1];
          const year = parseInt(parts[2], 10);
          const monthIndex = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ].indexOf(monthName);
          if (monthIndex !== -1) {
            return new Date(year, monthIndex, day);
          }
        }
        return new Date(dateStr);
      } catch {
        return new Date();
      }
    };

    const ratingValues: number[] = [];

    propReviews.forEach((r) => {
      ratingValues.push(r.ratings.overall);

      // Base weight: 2.5 for verified resident review, 1.0 for unverified
      let rWeight = r.verified ? 2.5 : 1.0;

      // Freshness factor
      const rDate = parseReviewDate(r.date);
      const diffTime = Math.abs(now.getTime() - rDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let freshnessFactor = 1.0;
      if (diffDays > 180) {
        freshnessFactor = 0.4;
      } else if (diffDays > 90) {
        freshnessFactor = 0.7;
      } else if (diffDays > 30) {
        freshnessFactor = 0.9;
      }

      const finalReviewWeight = rWeight * freshnessFactor;
      weightedOverallSum += r.ratings.overall * finalReviewWeight;
      totalWeight += finalReviewWeight;

      // Complaint counts
      let hasSafetyComplaint = r.ratings.security <= 2;
      let hasOtherComplaint = 
        r.ratings.food <= 2 ||
        r.ratings.water <= 2 ||
        r.ratings.valueForMoney <= 2 ||
        r.ratings.wifi <= 2 ||
        r.ratings.cleanliness <= 2 ||
        r.ratings.staff <= 2 ||
        r.ratings.location <= 2;

      if (hasSafetyComplaint) {
        complaintPenalties += 15; // safety complaint is critical
      }
      if (hasOtherComplaint) {
        // count how many other low ratings there are
        const lowRatings = Object.entries(r.ratings).filter(([key, val]) => key !== 'security' && val <= 2).length;
        complaintPenalties += lowRatings * 5;
      }

      // Review Quality Bonus: long comments and photos
      if (r.comment.length > 100) {
        highQualityBonus += 2;
      }
      if (Object.keys(r.photos).length > 0) {
        highQualityBonus += 3;
      }

      // Owner response bonus
      if (r.ownerReply) {
        ownerReplyBonus += 3;
      }
    });

    // 1. Calculate base rating-derived score scaled to 0-100
    const ratingScore = totalWeight > 0 ? (weightedOverallSum / totalWeight) * 20 : 50;

    // 2. Review variance penalty (consistency check)
    let variancePenalty = 0;
    if (ratingValues.length > 1) {
      const avg = ratingValues.reduce((sum, val) => sum + val, 0) / ratingValues.length;
      const squareDiffs = ratingValues.map((value) => Math.pow(value - avg, 2));
      const variance = squareDiffs.reduce((sum, val) => sum + val, 0) / ratingValues.length;
      variancePenalty = Math.min(variance * 8, 12); // max 12 points penalty for highly inconsistent ratings
    }

    // Cap bonuses and penalties
    complaintPenalties = Math.min(complaintPenalties, 40);
    highQualityBonus = Math.min(highQualityBonus, 8);
    ownerReplyBonus = Math.min(ownerReplyBonus, 5);

    // Compute final trust score
    let score = ratingScore - complaintPenalties - variancePenalty + highQualityBonus + ownerReplyBonus;
    score = Math.max(0, Math.min(100, Math.round(score)));

    // Gather complaints total count
    const complaints = this.getComplaintsStats(propReviews);
    const totalComplaints = complaints.food + complaints.water + complaints.security + complaints.staff + complaints.valueForMoney;

    properties[propIdx].trustScore = score;
    properties[propIdx].reviewsCount = propReviews.length;
    properties[propIdx].complaintsCount = totalComplaints;

    if (save) {
      await storage.setItem(STORAGE_DB_KEYS.PROPERTIES, properties);
    }
  }

  // Get trending issues in the city / platform
  public static async getTrendingComplaints(): Promise<{ category: string, count: number, trend: 'up' | 'down' | 'stable' }[]> {
    const reviews = await this.getReviews();
    const stats = this.getComplaintsStats(reviews);

    return [
      { category: 'Food Quality', count: stats.food, trend: 'up' },
      { category: 'Water Supply', count: stats.water, trend: 'stable' },
      { category: 'Safety & Security', count: stats.security, trend: 'down' },
      { category: 'Staff Issues', count: stats.staff, trend: 'up' },
      { category: 'Value For Money', count: stats.valueForMoney, trend: 'stable' },
    ];
  }

  // User Management
  private static readonly USERS_KEY = '@db_users';
  private static readonly initialUsers = [
    { id: 'user_123', name: 'John Doe', email: 'user@truthreview.com', password: 'user123', role: 'user' as const, phoneNumber: '+91 98765 43210', suspended: false },
    { id: 'owner_123', name: 'Property Owner', email: 'owner@truthreview.com', password: 'owner123', role: 'owner' as const, phoneNumber: '+91 87654 32109', suspended: false },
    { id: 'admin_123', name: 'Admin User', email: 'admin@truthreview.com', password: 'admin123', role: 'admin' as const, phoneNumber: '+91 76543 21098', suspended: false }
  ];

  public static async getUsers() {
    await this.init();
    let users = await storage.getItem<any[]>(this.USERS_KEY);
    if (!users) {
      users = this.initialUsers;
      await storage.setItem(this.USERS_KEY, users);
    }
    return users;
  }

  public static async registerUser(name: string, email: string, phoneNumber: string, role: 'user' | 'owner' | 'admin') {
    const users = await this.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('User with this email already exists.');
    }
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      phoneNumber,
      role,
      suspended: false
    };
    users.push(newUser);
    await storage.setItem(this.USERS_KEY, users);
    return newUser;
  }

  public static async toggleUserSuspension(userId: string) {
    const users = await this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].suspended = !users[idx].suspended;
      await storage.setItem(this.USERS_KEY, users);
    }
  }
}

