export interface ReviewItem {
  id: string;
  pgId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export const mockReviews: ReviewItem[] = [
  {
    id: 'rev_1',
    pgId: 'pg_1',
    userName: 'Rahul Sharma',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: 'Exceptional facilities and very clean rooms. The food is high quality and feels like home-cooked meals. Totally worth the rent!',
    date: 'June 01, 2026',
  },
  {
    id: 'rev_2',
    pgId: 'pg_1',
    userName: 'Karthik Raja',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
    rating: 4,
    comment: 'The location is excellent, right near the main road. Power backup works perfectly. The only issue is the Wi-Fi speed drops during peak hours.',
    date: 'May 28, 2026',
  },
  {
    id: 'rev_3',
    pgId: 'pg_2',
    userName: 'Sneha Patel',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: 'Perfect place for girls. Highly secure with biometric entry and CCTV. The housekeeper is extremely friendly and helpful.',
    date: 'June 05, 2026',
  },
  {
    id: 'rev_4',
    pgId: 'pg_2',
    userName: 'Priya Mani',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    rating: 4,
    comment: 'Rooms are tidy and ventilated. Rent includes laundry which is a huge plus! Food is decent, mostly South Indian.',
    date: 'May 20, 2026',
  },
  {
    id: 'rev_5',
    pgId: 'pg_3',
    userName: 'Aditya Sen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
    rating: 5,
    comment: 'Best co-living PG in OMR. The workspace area is so silent and perfect for working from home. Coffee machine and lounge are fantastic!',
    date: 'June 10, 2026',
  },
];
