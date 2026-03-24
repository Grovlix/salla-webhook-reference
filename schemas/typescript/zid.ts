// Zid Webhook Types
// Generated from Zid webhook documentation

// ============================================================================
// Base Types
// ============================================================================

export interface ZidWebhook<T = any> {
  event: string;
  data: T;
}

// ============================================================================
// Order Event Types
// ============================================================================

export type ZidOrderStatus = 'new' | 'preparing' | 'ready' | 'inDelivery' | 'delivered' | 'cancelled';

export type ZidPaymentStatus = 'paid' | 'unpaid' | 'pending' | 'refunded' | 'voided';

export type ZidPaymentMethod = 'Cash On Delivery' | 'Credit Card' | 'Bank Transfer';

export interface ZidCustomer {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
}

export interface ZidOrderItem {
  product_id: number;
  name?: string;
  quantity: number;
  price: number;
  total?: number;
}

export interface ZidOrderData {
  id: number;
  reference?: string;
  status: ZidOrderStatus;
  payment_status: ZidPaymentStatus;
  customer?: ZidCustomer;
  items?: ZidOrderItem[];
  total?: number;
  currency?: string;
  payment_method?: ZidPaymentMethod;
  delivery_option_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ZidOrderStatusUpdateData {
  id: number;
  reference?: string;
  status: ZidOrderStatus;
  previous_status?: ZidOrderStatus;
  updated_at?: string;
}

export interface ZidOrderPaymentStatusUpdateData {
  id: number;
  reference?: string;
  payment_status: ZidPaymentStatus;
  previous_payment_status?: ZidPaymentStatus;
  updated_at?: string;
}

export interface ZidOrderCreateWebhook extends ZidWebhook<ZidOrderData> {
  event: 'order.create';
}

export interface ZidOrderStatusUpdateWebhook extends ZidWebhook<ZidOrderStatusUpdateData> {
  event: 'order.status.update';
}

export interface ZidOrderPaymentStatusUpdateWebhook extends ZidWebhook<ZidOrderPaymentStatusUpdateData> {
  event: 'order.payment_status.update';
}

// ============================================================================
// Product Event Types
// ============================================================================

export interface ZidProductData {
  id: number;
  name: string;
  description?: string;
  price?: number;
  quantity?: number;
  sku?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  deleted_at?: string;
}

export interface ZidProductCreateWebhook extends ZidWebhook<ZidProductData> {
  event: 'product.create';
}

export interface ZidProductUpdateWebhook extends ZidWebhook<ZidProductData> {
  event: 'product.update';
}

export interface ZidProductPublishWebhook extends ZidWebhook<ZidProductData> {
  event: 'product.publish';
}

export interface ZidProductDeleteWebhook extends ZidWebhook<ZidProductData> {
  event: 'product.delete';
}

// ============================================================================
// Abandoned Cart Event Types
// ============================================================================

export interface ZidAbandonedCartData {
  id: number;
  customer?: ZidCustomer;
  items?: ZidOrderItem[];
  total?: number;
  currency?: string;
  created_at?: string;
}

export interface ZidAbandonedCartCompletedData {
  cart_id: number;
  order_id: number;
  order_reference?: string;
  completed_at?: string;
}

export interface ZidAbandonedCartCreatedWebhook extends ZidWebhook<ZidAbandonedCartData> {
  event: 'abandoned_cart.created';
}

export interface ZidAbandonedCartCompletedWebhook extends ZidWebhook<ZidAbandonedCartCompletedData> {
  event: 'abandoned_cart.completed';
}

// ============================================================================
// Customer Event Types
// ============================================================================

export interface ZidCustomerData {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
  logged_in_at?: string;
}

export interface ZidCustomerCreateWebhook extends ZidWebhook<ZidCustomerData> {
  event: 'customer.create';
}

export interface ZidCustomerUpdateWebhook extends ZidWebhook<ZidCustomerData> {
  event: 'customer.update';
}

export interface ZidCustomerMerchantUpdateWebhook extends ZidWebhook<ZidCustomerData> {
  event: 'customer.merchant.update';
}

export interface ZidCustomerLoginWebhook extends ZidWebhook<ZidCustomerData> {
  event: 'customer.login';
}

// ============================================================================
// Category Event Types
// ============================================================================

export interface ZidCategoryData {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface ZidCategoryCreateWebhook extends ZidWebhook<ZidCategoryData> {
  event: 'category.create';
}

export interface ZidCategoryUpdateWebhook extends ZidWebhook<ZidCategoryData> {
  event: 'category.update';
}

export interface ZidCategoryDeleteWebhook extends ZidWebhook<ZidCategoryData> {
  event: 'category.delete';
}

// ============================================================================
// Union Types
// ============================================================================

export type ZidWebhookEvent =
  | ZidOrderCreateWebhook
  | ZidOrderStatusUpdateWebhook
  | ZidOrderPaymentStatusUpdateWebhook
  | ZidProductCreateWebhook
  | ZidProductUpdateWebhook
  | ZidProductPublishWebhook
  | ZidProductDeleteWebhook
  | ZidAbandonedCartCreatedWebhook
  | ZidAbandonedCartCompletedWebhook
  | ZidCustomerCreateWebhook
  | ZidCustomerUpdateWebhook
  | ZidCustomerMerchantUpdateWebhook
  | ZidCustomerLoginWebhook
  | ZidCategoryCreateWebhook
  | ZidCategoryUpdateWebhook
  | ZidCategoryDeleteWebhook;

export type ZidEventType = ZidWebhookEvent['event'];

// ============================================================================
// Type Guards
// ============================================================================

export function isZidWebhook(payload: any): payload is ZidWebhookEvent {
  return payload && typeof payload.event === 'string' && payload.data;
}

export function getZidEventType(payload: any): ZidEventType | null {
  if (isZidWebhook(payload)) {
    return payload.event;
  }
  return null;
}

// ============================================================================
// Conditional Webhook Types
// ============================================================================

export interface ZidWebhookCondition {
  delivery_option_id?: string;
  status?: ZidOrderStatus | ZidOrderStatus[];
  payment_method?: ZidPaymentMethod;
}

export interface ZidWebhookSubscription {
  url: string;
  event: ZidEventType;
  conditions?: ZidWebhookCondition;
}

// Events that support conditions
export type ZidConditionalEvent = 'order.create' | 'order.status.update';

export function isConditionalEvent(event: ZidEventType): event is ZidConditionalEvent {
  return event === 'order.create' || event === 'order.status.update';
}
