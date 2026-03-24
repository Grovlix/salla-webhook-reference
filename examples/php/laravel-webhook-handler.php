<?php
/**
 * Salla/Zid Webhook Handler for Laravel
 * معالج أحداث Webhook لـ Salla و Zid باستخدام Laravel
 *
 * This controller handles incoming webhooks from both Salla and Zid platforms
 * يتعامل هذا المتحكم مع الويب هوك القادمة من كل من Salla و Zid
 */

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Utils\WebhookSignature;
use Exception;

class WebhookController extends Controller
{
    /**
     * Handle incoming webhook requests
     * معالجة طلبات الويب هوك القادمة
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function handle(Request $request): JsonResponse
    {
        try {
            // Get raw payload content
            // الحصول على محتوى الطلب الخام
            $payload = $request->getContent();

            // Log incoming webhook
            // تسجيل الويب هوك القادم
            Log::info('Webhook received', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'headers' => $request->headers->all()
            ]);

            // Verify signature based on platform
            // التحقق من التوقيع حسب المنصة
            $verification = $this->verifySignature($request, $payload);

            if (!$verification['valid']) {
                Log::warning('Invalid webhook signature', [
                    'platform' => $verification['platform'] ?? 'unknown'
                ]);

                return response()->json([
                    'error' => 'Invalid signature',
                    'message' => 'التوقيع غير صالح'
                ], 401);
            }

            // Parse webhook data
            // تحليل بيانات الويب هوك
            $data = json_decode($payload, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Invalid JSON payload', [
                    'error' => json_last_error_msg()
                ]);

                return response()->json([
                    'error' => 'Invalid JSON',
                    'message' => 'تنسيق JSON غير صالح'
                ], 400);
            }

            // Get event type
            // الحصول على نوع الحدث
            $event = $data['event'] ?? $data['event_name'] ?? 'unknown';

            // Process the webhook based on platform and event type
            // معالجة الويب هوك بناءً على المنصة ونوع الحدث
            $this->processWebhook($verification['platform'], $event, $data);

            // Return success response
            // إرجاع استجابة النجاح
            return response()->json([
                'success' => true,
                'message' => 'Webhook received successfully',
                'message_ar' => 'تم استلام الويب هوك بنجاح'
            ]);

        } catch (Exception $e) {
            // Log error
            // تسجيل الخطأ
            Log::error('Webhook processing error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Return error response
            // إرجاع استجابة الخطأ
            return response()->json([
                'error' => 'Internal server error',
                'message' => 'خطأ في الخادم الداخلي'
            ], 500);
        }
    }

    /**
     * Verify webhook signature
     * التحقق من توقيع الويب هوك
     *
     * @param Request $request
     * @param string $payload
     * @return array{valid: bool, platform: string}
     */
    protected function verifySignature(Request $request, string $payload): array
    {
        $sallaSecret = config('webhooks.salla_secret');
        $zidSecret = config('webhooks.zid_secret');

        // Auto-detect platform and verify
        // الكشف التلقائي عن المنصة والتحقق
        $result = WebhookSignature::verifyAutoDetect(
            $payload,
            $request->headers->all(),
            $sallaSecret,
            $zidSecret
        );

        return $result;
    }

    /**
     * Process webhook based on platform and event type
     * معالجة الويب هوك بناءً على المنصة ونوع الحدث
     *
     * @param string $platform 'salla' or 'zid'
     * @param string $event Event name/type
     * @param array $data Webhook payload data
     * @return void
     */
    protected function processWebhook(string $platform, string $event, array $data): void
    {
        Log::info('Processing webhook', [
            'platform' => $platform,
            'event' => $event
        ]);

        // Route to appropriate handler based on event
        // التوجيه إلى المعالج المناسب بناءً على الحدث
        switch ($event) {
            // Order events / أحداث الطلبات
            case 'order.created':
            case 'order.created':
            case 'order.updated':
            case 'order.status.changed':
            case 'order.cancelled':
                $this->handleOrderEvent($platform, $event, $data);
                break;

            // Product events / أحداث المنتجات
            case 'product.created':
            case 'product.updated':
            case 'product.deleted':
                $this->handleProductEvent($platform, $event, $data);
                break;

            // Customer events / أحداث العملاء
            case 'customer.created':
            case 'customer.updated':
            case 'customer.deleted':
                $this->handleCustomerEvent($platform, $event, $data);
                break;

            // Payment events / أحداث الدفع
            case 'payment.captured':
            case 'payment.failed':
            case 'payment.refunded':
                $this->handlePaymentEvent($platform, $event, $data);
                break;

            // Subscription events / أحداث الاشتراكات
            case 'subscription.created':
            case 'subscription.renewed':
            case 'subscription.cancelled':
                $this->handleSubscriptionEvent($platform, $event, $data);
                break;

            default:
                Log::info('Unhandled webhook event', [
                    'platform' => $platform,
                    'event' => $event
                ]);
                break;
        }
    }

    /**
     * Handle order-related events
     * معالجة أحداث الطلبات
     *
     * @param string $platform
     * @param string $event
     * @param array $data
     */
    protected function handleOrderEvent(string $platform, string $event, array $data): void
    {
        $orderId = $data['id'] ?? $data['order_id'] ?? null;

        Log::info('Order event received', [
            'platform' => $platform,
            'event' => $event,
            'order_id' => $orderId
        ]);

        // Add your custom logic here
        // أضف منطقك المخصص هنا
        // Examples: sync to database, send notifications, update inventory, etc.
        // أمثلة: المزامنة مع قاعدة البيانات، إرسال إشعارات، تحديث المخزون، إلخ
    }

    /**
     * Handle product-related events
     * معالجة أحداث المنتجات
     *
     * @param string $platform
     * @param string $event
     * @param array $data
     */
    protected function handleProductEvent(string $platform, string $event, array $data): void
    {
        $productId = $data['id'] ?? $data['product_id'] ?? null;

        Log::info('Product event received', [
            'platform' => $platform,
            'event' => $event,
            'product_id' => $productId
        ]);

        // Add your custom logic here
        // أضف منطقك المخصص هنا
    }

    /**
     * Handle customer-related events
     * معالجة أحداث العملاء
     *
     * @param string $platform
     * @param string $event
     * @param array $data
     */
    protected function handleCustomerEvent(string $platform, string $event, array $data): void
    {
        $customerId = $data['id'] ?? $data['customer_id'] ?? null;

        Log::info('Customer event received', [
            'platform' => $platform,
            'event' => $event,
            'customer_id' => $customerId
        ]);

        // Add your custom logic here
        // أضف منطقك المخصص هنا
    }

    /**
     * Handle payment-related events
     * معالجة أحداث الدفع
     *
     * @param string $platform
     * @param string $event
     * @param array $data
     */
    protected function handlePaymentEvent(string $platform, string $event, array $data): void
    {
        $paymentId = $data['id'] ?? $data['payment_id'] ?? null;

        Log::info('Payment event received', [
            'platform' => $platform,
            'event' => $event,
            'payment_id' => $paymentId
        ]);

        // Add your custom logic here
        // أضف منطقك المخصص هنا
    }

    /**
     * Handle subscription-related events
     * معالجة أحداث الاشتراكات
     *
     * @param string $platform
     * @param string $event
     * @param array $data
     */
    protected function handleSubscriptionEvent(string $platform, string $event, array $data): void
    {
        $subscriptionId = $data['id'] ?? $data['subscription_id'] ?? null;

        Log::info('Subscription event received', [
            'platform' => $platform,
            'event' => $event,
            'subscription_id' => $subscriptionId
        ]);

        // Add your custom logic here
        // أضف منطقك المخصص هنا
    }
}
