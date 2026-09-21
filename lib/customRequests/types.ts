export type CustomRequestStatus =
  | "PENDING"
  | "IN_DISCUSSION"
  | "CONFIRMED"
  | "IN_PRODUCTION"
  | "COMPLETED"
  | "CANCELLED";

export interface CustomRequest {
  id: string;
  user_id: string;
  product_type: string;
  message: string;
  image_url: string | null;
  status: CustomRequestStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomRequestBody {
  productType: string;
  message: string;
  imageUrl?: string | null;
}
