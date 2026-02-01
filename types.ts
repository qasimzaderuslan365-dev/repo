
export type UserRole = 'CUSTOMER' | 'PROFESSIONAL';

export interface Profile {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  profession?: string; // Specific field for professionals
  skills: string[];
  bio: string;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  avatar: string;
  location: string;
  availability: string[]; // e.g., ["Monday", "Tuesday"]
  joinedDate: string;
  isAvailable?: boolean; // For professionals
}

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED';

export interface Offer {
  id: string;
  customerId: string;
  professionalId: string;
  professionalName: string;
  serviceType: string;
  description: string;
  price: number;
  date: string;
  time: string;
  status: OfferStatus;
  location: string;
}

export interface Review {
  id: string;
  offerId: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export type Language = 'az' | 'en' | 'ru';

export interface AppState {
  currentUser: Profile | null;
  offers: Offer[];
  reviews: Review[];
  language: Language;
}
