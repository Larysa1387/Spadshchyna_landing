export type ApiHomesteadCard = {
  id: number;
  name: string;
  description: string;
  location: string;
  region: string;
  price_per_night: number;
  rating: number;
  review_count: number;
  main_photo: string | null;
  amenities?: string[];
  is_favourited?: boolean | null;
};

export type PaginatedHomesteadsResponse = {
  items: ApiHomesteadCard[];
  total: number;
  limit: number;
  offset: number;
};

export type ListHomesteadsParams = {
  region_id?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  rating_min?: number | null;
  guests?: number | null;
  limit?: number;
  offset?: number;
};

/** API params plus optional client-side rating upper bound (API has no rating_max). */
export type ArchiveHomesteadsQuery = ListHomesteadsParams & {
  rating_max?: number | null;
};

export type MessageResponse = {
  detail: string;
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

export type UserResponse = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_admin: boolean;
};

export type ApiErrorDetail = {
  detail?: string | { msg: string }[];
};

export type RegionResponse = {
  id: number;
  name: string;
  slug: string;
};

export type HostResponse = {
  id: number;
  name: string;
  photo_url: string | null;
  languages: string[];
};

export type PhotoResponse = {
  id: number;
  url: string;
  is_main: boolean;
  sort_order: number;
};

export type AmenityResponse = {
  id: number;
  name: string;
};

export type ReviewResponse = {
  id: number;
  category: string;
  text: string;
  author_name: string;
  country: string;
  rating: number;
  created_at: string;
};

export type PricingResponse = {
  price_per_night: number;
  base_guests: number;
  extra_guest_fee: number;
  max_guests: number;
  cleaning_fee: number;
  service_fee_pct: number;
};

export type HomesteadDetail = {
  id: number;
  name: string;
  location: string;
  description: string;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  review_count: number;
  region: string;
  host: HostResponse;
  photos: PhotoResponse[];
  amenities: AmenityResponse[];
  featured_amenities: AmenityResponse[];
  reviews: ReviewResponse[];
  pricing: PricingResponse;
  is_favourited: boolean | null;
};

export type CheckAvailabilityRequest = {
  check_in: string;
  check_out: string;
  guests: number;
};

export type CheckAvailabilityResponse = {
  available: boolean;
  nights: number;
  accommodation_total: number;
  cleaning_fee: number;
  service_fee: number;
  total: number;
};

export type CreateBookingRequest = {
  homestead_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  donation_pct?: number;
};

export type CreateBookingResponse = {
  id: number;
  homestead_id: number;
  status: string;
  checkout_url: string;
  nights: number;
  accommodation_total: number;
  cleaning_fee: number;
  service_fee: number;
  donation_amount: number;
  total: number;
};

export type BookingListItem = {
  id: number;
  homestead_id: number;
  homestead_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: string;
  total: number;
  created_at: string;
};
