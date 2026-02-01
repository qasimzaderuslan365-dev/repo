
export type UserRole = 'CUSTOMER' | 'PROFESSIONAL';

export interface Profile {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  profession?: string;
  skills: string[];
  bio: string;
  hourlyRate: number;
  rating: number;
  reviewsCount: number;
  avatar: string;
  location: string;
  availability: string[];
  joinedDate: string;
  isAvailable?: boolean;
  onboarding_completed?: boolean;
}

export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';

export interface Offer {
  id: string;
  customer_id: string;
  professional_id: string;
  professional_name?: string;
  customer_name?: string;
  service_type: string;
  description: string;
  price: number;
  date: string;
  time: string;
  status: OfferStatus;
  location: string;
  created_at?: string;
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
