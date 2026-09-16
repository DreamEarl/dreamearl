export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface ShippingAddress {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  currency: string;
  subtitle?: string;
  color?: string;
}

export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  items: OrderItemSnapshot[];
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CheckoutRequestItem {
  id: string;
  quantity: number;
}

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface CreateOrderRequestBody {
  items: CheckoutRequestItem[];
  customer: CheckoutCustomer;
  shippingAddress: ShippingAddress;
}

export interface CreateOrderResponseBody {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}
