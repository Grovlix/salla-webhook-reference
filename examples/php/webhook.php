<?php
// Minimal Salla + Zid webhook receiver.
//   php -S localhost:3000 webhook.php
// Salla: POST /webhooks/salla   Zid: POST /webhooks/zid

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$rawBody = file_get_contents('php://input');

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !in_array($path, ['/webhooks/salla', '/webhooks/zid'], true)) {
    http_response_code(404);
    exit;
}

if ($path === '/webhooks/salla') {
    $secret = getenv('SALLA_WEBHOOK_SECRET');
    if (($_SERVER['HTTP_X_SALLA_SECURITY_STRATEGY'] ?? '') === 'Token') {
        $valid = hash_equals($secret, $_SERVER['HTTP_AUTHORIZATION'] ?? '');
    } else {
        // Signature strategy (default): HMAC-SHA256 of the raw body.
        $valid = hash_equals(hash_hmac('sha256', $rawBody, $secret), $_SERVER['HTTP_X_SALLA_SIGNATURE'] ?? '');
    }
} else {
    // Zid sends Basic auth when the webhook was created with username and password.
    $expected = 'Basic ' . base64_encode(getenv('ZID_WEBHOOK_USER') . ':' . getenv('ZID_WEBHOOK_PASSWORD'));
    $valid = hash_equals($expected, $_SERVER['HTTP_AUTHORIZATION'] ?? '');
}

if (!$valid) {
    http_response_code(401);
    exit;
}

$payload = json_decode($rawBody, true);
if (!is_array($payload)) {
    http_response_code(400);
    exit;
}

// Queue the work here and return quickly; both platforms retry slow or failed deliveries.
error_log(($payload['event'] ?? $payload['event_name'] ?? 'store event') . ' received');
http_response_code(200);
echo 'ok';
