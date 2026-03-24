// Salla Webhook Types
// Generated from Salla webhook documentation

// ============================================================================
// Base Types
// ============================================================================

export interface SallaWebhook<T = any> {
  event: string;
  store_id: string;
  data: T;
  created_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone: string;
  city?: string;
  country?: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'in_delivery' | 'delivered' | 'cancelled' | 'returned' | 'failed';

export type ProductStatus = 'active' | 'hidden' | 'out_of_stock';

export type ShipmentStatus = 'created' | 'in_delivery' | 'delivered' | 'failed' | 'cancelled' | 'returned';

export type PaymentMethod = 'cod' | 'visa' | 'mada' | 'applepay' | 'stc_pay' | 'tabby' | 'tamara' | 'checkout';

export type InvoiceStatus = 'pending' | 'paid' | 'cancelled';

export type PaymentStatus = 'paid' | 'failed' | 'refunded' | 'partially_refunded';

export type DiscountType = 'fixed' | 'percentage';

export type OfferStatus = 'active' | 'inactive' | 'scheduled';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'closed';

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

// ============================================================================
// Order Event Types
// ============================================================================

export interface OrderData {
  id: number;
  reference: string;
  status: OrderStatus;
  payment_status: string;
  customer: Customer;
  items: OrderItem[];
  total: number;
  currency: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderStatusUpdatedData {
  id: number;
  reference: string;
  status: OrderStatus;
  previous_status: OrderStatus;
}

export interface OrderCancelledData {
  id: number;
  reference: string;
  status: 'cancelled';
  cancelled_at: string;
  reason?: string;
  cancelled_by?: 'merchant' | 'customer' | 'system';
}

export interface OrderReturnedData {
  id: number;
  reference: string;
  status: 'returned';
  returned_at: string;
  reason?: string;
}

export interface OrderCreatedWebhook extends SallaWebhook<OrderData> {
  event: 'order.created';
}

export interface OrderUpdatedWebhook extends SallaWebhook<OrderData> {
  event: 'order.updated';
}

export interface OrderStatusUpdatedWebhook extends SallaWebhook<OrderStatusUpdatedData> {
  event: 'order.status.updated';
}

export interface OrderCancelledWebhook extends SallaWebhook<OrderCancelledData> {
  event: 'order.cancelled';
}

export interface OrderReturnedWebhook extends SallaWebhook<OrderReturnedData> {
  event: 'order.returned';
}

// ============================================================================
// Product Event Types
// ============================================================================

export interface ProductData {
  id: number;
  name: string;
  description?: string;
  price: number;
  sale_price?: number;
  quantity: number;
  sku?: string;
  status: ProductStatus;
  categories?: number[];
  images?: Array<{ id: number; url: string }>;
  created_at?: string;
  updated_at?: string;
}

export interface ProductPriceUpdatedData {
  id: number;
  name: string;
  old_price?: number;
  price: number;
  old_sale_price?: number;
  sale_price?: number;
  updated_at: string;
}

export interface ProductQuantityUpdatedData {
  id: number;
  name: string;
  old_quantity?: number;
  quantity: number;
  updated_at: string;
}

export interface ProductStatusChangedData {
  id: number;
  name: string;
  status: ProductStatus;
  updated_at: string;
}

export interface ProductDeletedData {
  id: number;
  name?: string;
  deleted_at: string;
}

export interface ProductCreatedWebhook extends SallaWebhook<ProductData> {
  event: 'product.created';
}

export interface ProductUpdatedWebhook extends SallaWebhook<ProductData> {
  event: 'product.updated';
}

export interface ProductDeletedWebhook extends SallaWebhook<ProductDeletedData> {
  event: 'product.deleted';
}

export interface ProductPriceUpdatedWebhook extends SallaWebhook<ProductPriceUpdatedData> {
  event: 'product.price.updated';
}

export interface ProductQuantityUpdatedWebhook extends SallaWebhook<ProductQuantityUpdatedData> {
  event: 'product.quantity.updated';
}

export interface ProductHiddenWebhook extends SallaWebhook<ProductStatusChangedData> {
  event: 'product.hidden';
}

export interface ProductVisibleWebhook extends SallaWebhook<ProductStatusChangedData> {
  event: 'product.visible';
}

// ============================================================================
// Category Event Types
// ============================================================================

export interface CategoryData {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  slug?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryDeletedData {
  id: number;
  name?: string;
  deleted_at: string;
}

export interface CategoryCreatedWebhook extends SallaWebhook<CategoryData> {
  event: 'category.created';
}

export interface CategoryUpdatedWebhook extends SallaWebhook<CategoryData> {
  event: 'category.updated';
}

export interface CategoryDeletedWebhook extends SallaWebhook<CategoryDeletedData> {
  event: 'category.deleted';
}

// ============================================================================
// Customer Event Types
// ============================================================================

export interface CustomerData {
  id: number;
  name: string;
  email?: string;
  phone: string;
  city?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerDeletedData {
  id: number;
  name?: string;
  deleted_at: string;
}

export interface CustomerLoginData {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  logged_in_at: string;
}

export interface CustomerCreatedWebhook extends SallaWebhook<CustomerData> {
  event: 'customer.created';
}

export interface CustomerUpdatedWebhook extends SallaWebhook<CustomerData> {
  event: 'customer.updated';
}

export interface CustomerDeletedWebhook extends SallaWebhook<CustomerDeletedData> {
  event: 'customer.deleted';
}

export interface CustomerLoginWebhook extends SallaWebhook<CustomerLoginData> {
  event: 'customer.login';
}

// ============================================================================
// Cart Event Types
// ============================================================================

export interface CartData {
  id: number;
  customer_id?: number;
  customer?: Customer;
  items: Array<{
    product_id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  currency: string;
  created_at?: string;
  updated_at?: string;
  abandoned_at?: string;
}

export interface CartCompletedData {
  cart_id: number;
  order_id: number;
  order_reference?: string;
  completed_at: string;
}

export interface CartAbandonedWebhook extends SallaWebhook<CartData> {
  event: 'cart.abandoned';
}

export interface CartUpdatedWebhook extends SallaWebhook<CartData> {
  event: 'cart.updated';
}

export interface CartCompletedWebhook extends SallaWebhook<CartCompletedData> {
  event: 'cart.completed';
}

// ============================================================================
// Shipment Event Types
// ============================================================================

export interface ShipmentData {
  id: number;
  order_id: number;
  order_reference?: string;
  shipping_company: string;
  tracking_number?: string;
  status: ShipmentStatus;
  address?: {
    city?: string;
    district?: string;
    street?: string;
    building?: string;
    phone?: string;
  };
  created_at?: string;
  updated_at?: string;
  in_delivery_at?: string;
  delivered_at?: string;
  failed_at?: string;
  cancelled_at?: string;
  returned_at?: string;
  reason?: string;
  delivered_to?: string;
}

export interface ShipmentCreatedWebhook extends SallaWebhook<ShipmentData> {
  event: 'shipment.created';
}

export interface ShipmentUpdatedWebhook extends SallaWebhook<ShipmentData> {
  event: 'shipment.updated';
}

export interface ShipmentInDeliveryWebhook extends SallaWebhook<ShipmentData> {
  event: 'shipment.in_delivery';
}

export interface ShipmentDeliveredWebhook extends SallaWebhook<ShipmentData> {
  event: 'shipment.delivered';
}

export interface ShipmentFailedWebhook extends SallaWebhook<ShipmentData> {
  event: 'shipment.failed';
}

export interface ShipmentCancelledWebhook extends SallaWebhook<ShipmentData> {
  event: 'shipment.cancelled';
}

export interface ShipmentReturnedWebhook extends SallaWebhook<ShipmentData> {
  event: 'shipment.returned';
}

// ============================================================================
// Invoice Event Types
// ============================================================================

export interface InvoiceData {
  id: number;
  order_id: number;
  order_reference?: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  due_date?: string;
  recipient_email?: string;
  payment_method?: string;
  transaction_id?: string;
  created_at?: string;
  updated_at?: string;
  sent_at?: string;
  paid_at?: string;
  cancelled_at?: string;
  reason?: string;
}

export interface InvoiceCreatedWebhook extends SallaWebhook<InvoiceData> {
  event: 'invoice.created';
}

export interface InvoiceUpdatedWebhook extends SallaWebhook<InvoiceData> {
  event: 'invoice.updated';
}

export interface InvoiceSentWebhook extends SallaWebhook<InvoiceData> {
  event: 'invoice.sent';
}

export interface InvoicePaidWebhook extends SallaWebhook<InvoiceData> {
  event: 'invoice.paid';
}

export interface InvoiceCancelledWebhook extends SallaWebhook<InvoiceData> {
  event: 'invoice.cancelled';
}

// ============================================================================
// Payment Event Types
// ============================================================================

export interface PaymentData {
  id: number;
  order_id: number;
  order_reference?: string;
  amount: number;
  original_amount?: number;
  currency: string;
  payment_method?: PaymentMethod;
  gateway?: string;
  status: PaymentStatus;
  transaction_id?: string;
  refund_id?: string;
  error_code?: string;
  error_message?: string;
  reason?: string;
  paid_at?: string;
  failed_at?: string;
  refunded_at?: string;
}

export interface PaymentPaidWebhook extends SallaWebhook<PaymentData> {
  event: 'payment.paid';
}

export interface PaymentFailedWebhook extends SallaWebhook<PaymentData> {
  event: 'payment.failed';
}

export interface PaymentRefundedWebhook extends SallaWebhook<PaymentData> {
  event: 'payment.refunded';
}

export interface PaymentPartiallyRefundedWebhook extends SallaWebhook<PaymentData> {
  event: 'payment.partially_refunded';
}

// ============================================================================
// Coupon Event Types
// ============================================================================

export interface CouponData {
  id: number;
  code: string;
  description?: string;
  discount: number;
  discount_type: DiscountType;
  max_uses?: number;
  used_count?: number;
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface CouponAppliedData {
  code: string;
  coupon_id?: number;
  order_id: number;
  discount: number;
  discount_type: DiscountType;
  customer_id?: number;
  applied_at: string;
}

export interface CouponAppliedWebhook extends SallaWebhook<CouponAppliedData> {
  event: 'coupon.applied';
}

export interface CouponCreatedWebhook extends SallaWebhook<CouponData> {
  event: 'coupon.created';
}

export interface CouponUpdatedWebhook extends SallaWebhook<CouponData> {
  event: 'coupon.updated';
}

export interface CouponDeletedWebhook extends SallaWebhook<CouponData> {
  event: 'coupon.deleted';
}

// ============================================================================
// Special Offer Event Types
// ============================================================================

export interface SpecialOfferData {
  id: number;
  name: string;
  description?: string;
  type?: string;
  status: OfferStatus;
  starts_at?: string;
  ends_at?: string;
  created_at?: string;
  updated_at?: string;
  activated_at?: string;
  deactivated_at?: string;
  deleted_at?: string;
}

export interface SpecialOfferCreatedWebhook extends SallaWebhook<SpecialOfferData> {
  event: 'special_offer.created';
}

export interface SpecialOfferUpdatedWebhook extends SallaWebhook<SpecialOfferData> {
  event: 'special_offer.updated';
}

export interface SpecialOfferActivatedWebhook extends SallaWebhook<SpecialOfferData> {
  event: 'special_offer.activated';
}

export interface SpecialOfferDeactivatedWebhook extends SallaWebhook<SpecialOfferData> {
  event: 'special_offer.deactivated';
}

export interface SpecialOfferDeletedWebhook extends SallaWebhook<SpecialOfferData> {
  event: 'special_offer.deleted';
}

// ============================================================================
// Store Event Types
// ============================================================================

export interface StoreData {
  id: string;
  name: string;
  description?: string;
  domain?: string;
  logo?: string;
  currency?: string;
  updated_at: string;
}

export interface StoreAppData {
  app_id: string;
  app_name: string;
  store_id: string;
  merchant_id?: string;
  installed_at?: string;
  uninstalled_at?: string;
}

export interface StoreSettingsData {
  updated_fields?: string[];
  updated_at: string;
}

export interface StoreUpdatedWebhook extends SallaWebhook<StoreData> {
  event: 'store.updated';
}

export interface StoreAppInstalledWebhook extends SallaWebhook<StoreAppData> {
  event: 'store.app.installed';
}

export interface StoreAppUninstalledWebhook extends SallaWebhook<StoreAppData> {
  event: 'store.app.uninstalled';
}

export interface StoreSettingsUpdatedWebhook extends SallaWebhook<StoreSettingsData> {
  event: 'store.settings.updated';
}

// ============================================================================
// Branch Event Types
// ============================================================================

export interface BranchData {
  id: number;
  name: string;
  phone?: string;
  city?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface BranchCreatedWebhook extends SallaWebhook<BranchData> {
  event: 'branch.created';
}

export interface BranchUpdatedWebhook extends SallaWebhook<BranchData> {
  event: 'branch.updated';
}

export interface BranchDeletedWebhook extends SallaWebhook<BranchData> {
  event: 'branch.deleted';
}

// ============================================================================
// Review Event Types
// ============================================================================

export interface ReviewData {
  id: number;
  product_id: number;
  product_name?: string;
  customer_id: number;
  customer_name?: string;
  rating: number;
  comment?: string;
  status: ReviewStatus;
  created_at?: string;
  updated_at?: string;
}

export interface ReviewCreatedWebhook extends SallaWebhook<ReviewData> {
  event: 'review.created';
}

export interface ReviewUpdatedWebhook extends SallaWebhook<ReviewData> {
  event: 'review.updated';
}

// ============================================================================
// Communication Event Types
// ============================================================================

export interface MessageData {
  id: number;
  customer_id: number;
  customer_name?: string;
  message: string;
  conversation_id?: number;
  attachments?: Array<{ url: string; type: string }>;
  received_at?: string;
  replied_at?: string;
}

export interface MessageReceivedWebhook extends SallaWebhook<MessageData> {
  event: 'message.received';
}

export interface MessageRepliedWebhook extends SallaWebhook<MessageData> {
  event: 'message.replied';
}

export interface CartReminderSentData {
  cart_id: number;
  customer_id: number;
  customer_email?: string;
  sent_at: string;
}

export interface CartReminderSentWebhook extends SallaWebhook<CartReminderSentData> {
  event: 'cart.reminder.sent';
}

// ============================================================================
// Ticket Event Types
// ============================================================================

export interface TicketData {
  id: number;
  customer_id: number;
  customer_name?: string;
  subject: string;
  description?: string;
  priority: TicketPriority;
  status: TicketStatus;
  resolution?: string;
  created_at?: string;
  updated_at?: string;
  closed_at?: string;
}

export interface TicketCreatedWebhook extends SallaWebhook<TicketData> {
  event: 'ticket.created';
}

export interface TicketUpdatedWebhook extends SallaWebhook<TicketData> {
  event: 'ticket.updated';
}

export interface TicketClosedWebhook extends SallaWebhook<TicketData> {
  event: 'ticket.closed';
}

// ============================================================================
// Brand Event Types
// ============================================================================

export interface BrandData {
  id: number;
  name: string;
  description?: string;
  slug?: string;
  logo?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface BrandCreatedWebhook extends SallaWebhook<BrandData> {
  event: 'brand.created';
}

export interface BrandUpdatedWebhook extends SallaWebhook<BrandData> {
  event: 'brand.updated';
}

export interface BrandDeletedWebhook extends SallaWebhook<BrandData> {
  event: 'brand.deleted';
}

// ============================================================================
// Union Types
// ============================================================================

export type SallaWebhookEvent =
  | OrderCreatedWebhook
  | OrderUpdatedWebhook
  | OrderStatusUpdatedWebhook
  | OrderCancelledWebhook
  | OrderReturnedWebhook
  | ProductCreatedWebhook
  | ProductUpdatedWebhook
  | ProductDeletedWebhook
  | ProductPriceUpdatedWebhook
  | ProductQuantityUpdatedWebhook
  | ProductHiddenWebhook
  | ProductVisibleWebhook
  | CategoryCreatedWebhook
  | CategoryUpdatedWebhook
  | CategoryDeletedWebhook
  | CustomerCreatedWebhook
  | CustomerUpdatedWebhook
  | CustomerDeletedWebhook
  | CustomerLoginWebhook
  | CartAbandonedWebhook
  | CartUpdatedWebhook
  | CartCompletedWebhook
  | ShipmentCreatedWebhook
  | ShipmentUpdatedWebhook
  | ShipmentInDeliveryWebhook
  | ShipmentDeliveredWebhook
  | ShipmentFailedWebhook
  | ShipmentCancelledWebhook
  | ShipmentReturnedWebhook
  | InvoiceCreatedWebhook
  | InvoiceUpdatedWebhook
  | InvoiceSentWebhook
  | InvoicePaidWebhook
  | InvoiceCancelledWebhook
  | PaymentPaidWebhook
  | PaymentFailedWebhook
  | PaymentRefundedWebhook
  | PaymentPartiallyRefundedWebhook
  | CouponAppliedWebhook
  | CouponCreatedWebhook
  | CouponUpdatedWebhook
  | CouponDeletedWebhook
  | SpecialOfferCreatedWebhook
  | SpecialOfferUpdatedWebhook
  | SpecialOfferActivatedWebhook
  | SpecialOfferDeactivatedWebhook
  | SpecialOfferDeletedWebhook
  | StoreUpdatedWebhook
  | StoreAppInstalledWebhook
  | StoreAppUninstalledWebhook
  | StoreSettingsUpdatedWebhook
  | BranchCreatedWebhook
  | BranchUpdatedWebhook
  | BranchDeletedWebhook
  | ReviewCreatedWebhook
  | ReviewUpdatedWebhook
  | MessageReceivedWebhook
  | MessageRepliedWebhook
  | CartReminderSentWebhook
  | TicketCreatedWebhook
  | TicketUpdatedWebhook
  | TicketClosedWebhook
  | BrandCreatedWebhook
  | BrandUpdatedWebhook
  | BrandDeletedWebhook;

export type SallaEventType = SallaWebhookEvent['event'];

// ============================================================================
// Type Guards
// ============================================================================

export function isSallaWebhook(payload: any): payload is SallaWebhookEvent {
  return payload && typeof payload.event === 'string' && typeof payload.store_id === 'string' && payload.data;
}

export function getSallaEventType(payload: any): SallaEventType | null {
  if (isSallaWebhook(payload)) {
    return payload.event;
  }
  return null;
}
