<?php
/**
 * Webhook Configuration Example
 * مثال على إعدادات الويب هوك
 *
 * Add this to your config/webhooks.php file
 * أضف هذا إلى ملف config/webhooks.php
 */

return [
    /*
    |--------------------------------------------------------------------------
    | Webhook Secrets
    | أسرار الويب هوك
    |--------------------------------------------------------------------------
    |
    | Your webhook secret keys from Salla and Zid dashboards
    | مفاتيح السر الخاصة بالويب هوك من لوحات تحكم Salla و Zid
    |
    */

    'salla_secret' => env('SALLA_WEBHOOK_SECRET', ''),
    'zid_secret' => env('ZID_WEBHOOK_SECRET', ''),

    /*
    |--------------------------------------------------------------------------
    | Webhook Endpoints
    | نقاط نهاية الويب هوك
    |--------------------------------------------------------------------------
    |
    | The URL endpoints where webhooks will be received
    | عناوين URL التي ستستقبل الويب هوك
    |
    */

    'endpoint' => env('WEBHOOK_ENDPOINT', '/webhooks'),

    /*
    |--------------------------------------------------------------------------
    | Webhook Logging
    | تسجيل الويب هوك
    |--------------------------------------------------------------------------
    |
    | Enable/disable detailed webhook logging
    | تفعيل/تعطيل تسجيل الويب هوك التفصيلي
    |
    */

    'log_all_requests' => env('WEBHOOK_LOG_ALL', true),
    'log_failed_only' => env('WEBHOOK_LOG_FAILED_ONLY', false),

    /*
    |--------------------------------------------------------------------------
    | Webhook Retry Settings
    | إعدادات إعادة محاولة الويب هوك
    |--------------------------------------------------------------------------
    |
    | Configure retry behavior for failed webhooks
    | تكوين سلوك إعادة المحاولة للويب هوك الفاشلة
    |
    */

    'retry_attempts' => env('WEBHOOK_RETRY_ATTEMPTS', 3),
    'retry_delay' => env('WEBHOOK_RETRY_DELAY', 5), // seconds

    /*
    |--------------------------------------------------------------------------
    | IP Whitelist (Optional)
    | القائمة البيضاء لعناوين IP (اختياري)
    |--------------------------------------------------------------------------
    |
    | Allowed IP addresses for webhook requests
    | عناوين IP المسموح بها لطلبات الويب هوك
    |
    | Salla IPs: Check https://docs.salla.dev/
    | Zid IPs: Check https://docs.zid.sa/
    */

    'ip_whitelist' => [
        'salla' => [],
        'zid' => [],
    ],

    /*
    |--------------------------------------------------------------------------
    | Event Handlers
    | معالجات الأحداث
    |--------------------------------------------------------------------------
    |
    | Map events to their handler classes
    | ربط الأحداث بفئات المعالجات الخاصة بها
    |
    */

    'handlers' => [
        'order.created' => \App\Handlers\OrderCreatedHandler::class,
        'order.updated' => \App\Handlers\OrderUpdatedHandler::class,
        'product.created' => \App\Handlers\ProductCreatedHandler::class,
        'customer.created' => \App\Handlers\CustomerCreatedHandler::class,
    ],
];
