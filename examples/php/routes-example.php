<?php
/**
 * Laravel Routes for Webhook Handling
    */

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WebhookController;

/*
|--------------------------------------------------------------------------
| Webhook Routes
| مسارات الويب هوك
|--------------------------------------------------------------------------
|
| Here is where you can register webhook routes for your application.
| هنا يمكنك تسجيل مسارات الويب هوك لتطبيقك.
|
*/

// Main webhook handler - handles both Salla and Zid
// معالج الويب هوك الرئيسي - يتعامل مع كل من Salla و Zid
Route::post('/webhooks', [WebhookController::class, 'handle'])
    ->name('webhook.handle')
    ->middleware(['throttle:webhooks']);

// Dedicated Salla webhook endpoint
// نقطة نهاية مخصصة لـ Salla
Route::post('/webhooks/salla', [WebhookController::class, 'handle'])
    ->name('webhook.salla')
    ->middleware(['throttle:webhooks']);

// Dedicated Zid webhook endpoint
// نقطة نهاية مخصصة لـ Zid
Route::post('/webhooks/zid', [WebhookController::class, 'handle'])
    ->name('webhook.zid')
    ->middleware(['throttle:webhooks']);

/*
|--------------------------------------------------------------------------
| Rate Limiting Configuration
| تكوين الحد من المعدل
|--------------------------------------------------------------------------
|
| Add this to App\Providers\RouteServiceProvider
| أضف هذا إلى App\Providers\RouteServiceProvider
|
*/

// In RouteServiceProvider boot method:
// Rate limit for webhooks (60 requests per minute)
// الحد من معدل الويب هوك (60 طلب في الدقيقة)
RateLimiter::for('webhooks', function (Request $request) {
    return Limit::perMinute(60);
});
