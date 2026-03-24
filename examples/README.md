# Salla/Zid Webhook Handler Examples
# أمثلة معالجات الويب هوك لـ Salla و Zid

This directory contains working webhook handler examples for both Salla and Zid e-commerce platforms.
يحتوي هذا الدليل على أمثلة عاملة لمعالجات الويب هوك لكل من منصتي Salla و Zid للتجارة الإلكترونية.

## Directory Structure / هيكل الدليل

```
examples/
├── php/                         # PHP Examples / أمثلة PHP
│   ├── signature-verification.php
│   ├── laravel-webhook-handler.php
│   ├── composer.json
│   ├── config-webhooks.php
│   └── routes-example.php
├── javascript/                  # JavaScript Examples / أمثلة JavaScript
│   ├── signature-verification.js
│   ├── express-webhook-handler.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── python/                      # Python Examples / أمثلة Python
│   ├── signature_verification.py
│   ├── flask_webhook_handler.py
│   ├── fastapi_webhook_handler.py
│   ├── requirements.txt
│   └── .env.example
├── docker-compose.yml           # Docker setup
├── docker-compose.ngrok.yml     # Ngrok setup
├── ngrok-config.yml             # Ngrok configuration
├── test-webhook.js              # Testing script / سكريبت الاختبار
└── README.md
```

## Quick Start / البدء السريع

### PHP/Laravel Setup

```bash
cd php
composer install
cp .env.example .env
# Add your secrets to .env / أضف أسرارك إلى ملف .env
php artisan serve
```

### Node.js/Express Setup

```bash
cd javascript
npm install
cp .env.example .env
# Add your secrets to .env / أضف أسرارك إلى ملف .env
npm start
```

### Python/Flask Setup

```bash
cd python
pip install -r requirements.txt
cp .env.example .env
# Add your secrets to .env / أضف أسرارك إلى ملف .env
python flask_webhook_handler.py
```

### Python/FastAPI Setup

```bash
cd python
pip install -r requirements.txt
cp .env.example .env
# Add your secrets to .env / أضف أسرارك إلى ملف .env
uvicorn fastapi_webhook_handler:app --reload
```

## Using Docker

```bash
# Start all handlers / تشغيل جميع المعالجات
docker-compose up -d

# Start with ngrok / التشغيل مع ngrok
docker-compose --profile ngrok up -d

# Start specific handler / تشغيل معالج محدد
docker-compose up php-handler
docker-compose up node-handler
docker-compose up python-flask-handler
docker-compose up python-fastapi-handler
```

## Testing Webhooks / اختبار الويب هوك

### Using the Test Script / استخدام سكريبت الاختبار

```bash
# Test Salla webhook / اختبار webhook Salla
node test-webhook.js --platform salla --secret your_secret --url http://localhost:3000/webhooks

# Test Zid webhook / اختبار webhook Zid
node test-webhook.js --platform zid --secret your_secret --url http://localhost:3000/webhooks

# Test with specific event / اختبار بحدث محدد
node test-webhook.js --event product.created

# Verbose output / إخراج تفصيلي
node test-webhook.js --verbose
```

### Using Ngrok / استخدام Ngrok

```bash
# Install ngrok / تثبيت ngrok
npm install -g ngrok

# Expose local server / كشف الخادم المحلي
ngrok http 3000

# Or use Docker / أو استخدم Docker
docker-compose --profile ngrok up
```

## Environment Variables / متغيرات البيئة

Required variables for all handlers:
المتغيرات المطلوبة لجميع المعالجات:

```bash
SALLA_WEBHOOK_SECRET=your_salla_webhook_secret
ZID_WEBHOOK_SECRET=your_zid_webhook_secret
```

Optional variables:
متغيرات اختيارية:

```bash
PORT=3000                    # Server port / منفذ الخادم
LOG_LEVEL=info              # Logging level / مستوى التسجيل
RATE_LIMIT_MAX=60           # Max requests per minute / الحد الأقصى للطلبات في الدقيقة
```

## Getting Your Webhook Secrets
# الحصول على أسرار الويب هوك

### Salla / سلة

1. Go to your Salla dashboard / اذهب إلى لوحة تحكم Salla
2. Navigate to Settings > Developers > Webhooks
   انتقل إلى الإعدادات > المطورون > Webhooks
3. Add a new webhook / أضف webhook جديد
4. Copy the secret key / انسخ مفتاح السر

### Zid / زد

1. Go to your Zid dashboard / اذهب إلى لوحة تحكم Zid
2. Navigate to Settings > Developers > Webhooks
   انتقل إلى الإعدادات > المطورون > Webhooks
3. Add a new webhook / أضف webhook جديد
4. Copy the secret key / انسخ مفتاح السر

## Supported Events / الأحداث المدعومة

### Order Events / أحداث الطلبات
- `order.created` - New order created / إنشاء طلب جديد
- `order.updated` - Order updated / تحديث الطلب
- `order.status.changed` - Order status changed / تغيير حالة الطلب
- `order.cancelled` - Order cancelled / إلغاء الطلب

### Product Events / أحداث المنتجات
- `product.created` - Product created / إنشاء منتج
- `product.updated` - Product updated / تحديث منتج
- `product.deleted` - Product deleted / حذف منتج

### Customer Events / أحداث العملاء
- `customer.created` - Customer created / إنشاء عميل
- `customer.updated` - Customer updated / تحديث عميل
- `customer.deleted` - Customer deleted / حذف عميل

### Payment Events / أحداث الدفع
- `payment.captured` - Payment captured / قبض الدفع
- `payment.failed` - Payment failed / فشل الدفع
- `payment.refunded` - Payment refunded / استرداد الدفع

### Subscription Events / أحداث الاشتراكات
- `subscription.created` - Subscription created / إنشاء اشتراك
- `subscription.renewed` - Subscription renewed / تجديد الاشتراك
- `subscription.cancelled` - Subscription cancelled / إلغاء الاشتراك

## Security Notes / ملاحظات الأمان

1. **Always verify signatures** - Never trust webhook requests without signature verification
   **تحقق دائماً من التوقيعات** - لا تثق أبداً بطلبات الويب هوك بدون التحقق من التوقيع

2. **Use HTTPS in production** - Always use HTTPS for your webhook endpoints
   **استخدم HTTPS في الإنتاج** - استخدم دائماً HTTPS لنقاط نهاية الويب هوك

3. **Keep secrets secure** - Never commit webhook secrets to version control
   **احفظ الأسرار بشكل آمن** - لا ترتكب أبداً أسرار الويب هوك إلى نظام التحكم في الإصدارات

4. **Implement rate limiting** - Protect your endpoints from abuse
   **نفذ الحد من المعدل** - احم نقاط النهاية الخاصة بك من الإساءة

5. **Log all webhooks** - Keep records of all webhook requests for debugging
   **سجل جميع الويب هوك** - احتفظ بسجلات لجميع طلبات الويب هوك لتصحيح الأخطاء

## License / الرخصة

MIT License
