<?php
/**
 * Salla/Zid Webhook Signature Verification
 * التحقق من توقيع Webhook لـ Salla و Zid
 *
 * This utility provides signature verification for both Salla and Zid webhooks
 * توفر هذه الأداة التحقق من التوقيع لكل من Salla و Zid
 */

namespace App\Utils;

class WebhookSignature
{
    /**
     * Verify Salla webhook signature
     * التحقق من توقيع webhook لـ Salla
     *
     * Salla uses HMAC-SHA256 with the webhook secret
     * تستخدم Salla تشفير HMAC-SHA256 مع مفتاح السر
     *
     * @param string $payload The raw webhook payload JSON
     * @param string $signature The signature from header (X-Salla-Signature)
     * @param string $secret Your webhook secret key
     * @return bool True if signature is valid
     */
    public static function verifySallaSignature(string $payload, string $signature, string $secret): bool
    {
        // Remove 'sha256=' prefix if present
        // إزالة بادئة 'sha256=' إذا كانت موجودة
        $signature = str_replace('sha256=', '', $signature);

        // Calculate expected signature
        // حساب التوقيع المتوقع
        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        // Constant-time comparison to prevent timing attacks
        // مقارنة ثابتة الزمن لمنع هجمات التوقيت
        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Verify Zid webhook signature
     * التحقق من توقيع webhook لـ Zid
     *
     * Zid uses HMAC-SHA256 with the webhook secret
     * تستخدم Zid تشفير HMAC-SHA256 مع مفتاح السر
     *
     * @param string $payload The raw webhook payload JSON
     * @param string $signature The signature from header (X-Zid-Signature)
     * @param string $secret Your webhook secret key
     * @return bool True if signature is valid
     */
    public static function verifyZidSignature(string $payload, string $signature, string $secret): bool
    {
        // Remove any prefix if present
        // إزالة أي بادئة إذا كانت موجودة
        $signature = str_replace(['sha256=', 'hmac_sha256='], '', $signature);

        // Calculate expected signature
        // حساب التوقيع المتوقع
        $expectedSignature = hash_hmac('sha256', $payload, $secret);

        // Constant-time comparison to prevent timing attacks
        // مقارنة ثابتة الزمن لمنع هجمات التوقيت
        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Auto-detect platform and verify signature
     * الكشف التلقائي عن المنصة والتحقق من التوقيع
     *
     * @param string $payload The raw webhook payload
     * @param array $headers All request headers
     * @param string $sallaSecret Salla webhook secret
     * @param string $zidSecret Zid webhook secret
     * @return array{valid: bool, platform: ?string}
     */
    public static function verifyAutoDetect(
        string $payload,
        array $headers,
        string $sallaSecret,
        string $zidSecret
    ): array {
        // Normalize headers to lowercase
        // توحيد الأحngen头部 إلى أحرف صغيرة
        $headers = array_change_key_case($headers, CASE_LOWER);

        // Check for Salla signature
        // التحقق من توقيع Salla
        if (isset($headers['x-salla-signature'])) {
            return [
                'valid' => self::verifySallaSignature($payload, $headers['x-salla-signature'], $sallaSecret),
                'platform' => 'salla'
            ];
        }

        // Check for Zid signature
        // التحقق من توقيع Zid
        if (isset($headers['x-zid-signature'])) {
            return [
                'valid' => self::verifyZidSignature($payload, $headers['x-zid-signature'], $zidSecret),
                'platform' => 'zid'
            ];
        }

        return [
            'valid' => false,
            'platform' => null
        ];
    }

    /**
     * Extract signature from request headers
     * استخراج التوقيع من رؤوس الطلب
     *
     * @param \Illuminate\Http\Request $request
     * @return array{salla: ?string, zid: ?string}
     */
    public static function extractSignatures($request): array
    {
        return [
            'salla' => $request->header('X-Salla-Signature'),
            'zid' => $request->header('X-Zid-Signature')
        ];
    }
}
