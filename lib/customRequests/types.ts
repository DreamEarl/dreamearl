export const CUSTOM_REQUEST_STATUSES = [
  "PENDING",
  "IN_DISCUSSION",
  "CONFIRMED",
  "IN_PRODUCTION",
  "COMPLETED",
  "CANCELLED",
  "DECLINED",
] as const;

export type CustomRequestStatus = (typeof CUSTOM_REQUEST_STATUSES)[number];

export const MAX_CUSTOM_REQUEST_IMAGES = 5;

export interface CustomRequest {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  product_type: string;
  message: string;
  image_urls: string[];
  status: CustomRequestStatus;
  decline_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomRequestBody {
  fullName: string;
  email: string;
  phone: string;
  productType: string;
  message: string;
  imageUrls?: string[];
}
