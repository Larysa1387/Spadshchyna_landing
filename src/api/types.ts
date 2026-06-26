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
