#!/usr/bin/env node

/**
 * Salla/Zid Webhook Testing Script
 * سكريبت اختبار الويب هوك لـ Salla و Zid
 *
 * This script allows you to test webhook handlers locally
 * يتيح لك هذا السكريبت اختبار معالجات الويب هوك محلياً
 *
 * Usage:
 *   node test-webhook.js --platform salla --secret your_secret --url http://localhost:3000/webhooks
 *   node test-webhook.js --platform zid --secret your_secret --url http://localhost:3000/webhooks
 */

const crypto = require('crypto');
const http = require('http');
const https = require('https');
const { URL } = require('url');

// Parse command line arguments
// تحليل وسيطات سطر الأوامر
const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, value] = arg.replace(/^--/, '').split('=');
  acc[key] = value || true;
  return acc;
}, {});

// Configuration from arguments or defaults
// التكوين من الوسائط أو الافتراضيات
const config = {
  platform: args.platform || args.p || 'salla',
  secret: args.secret || args.s || 'test_webhook_secret',
  url: args.url || args.u || 'http://localhost:3000/webhooks',
  event: args.event || args.e || 'order.created',
  method: args.method || args.m || 'POST',
  verbose: args.verbose || args.v || false,
  help: args.help || args.h || false
};

/**
 * Show usage information
 * عرض معلومات الاستخدام
 */
function showHelp() {
  console.log(`
Salla/Zid Webhook Testing Script
سكريبت اختبار الويب هوك لـ Salla و Zid

Usage / الاستخدام:
  node test-webhook.js [options]

Options / الخيارات:
  --platform, -p    Platform: salla or zid (default: salla)
                    المنصة: salla أو zid (الافتراضي: salla)
  --secret, -s      Webhook secret key (default: test_webhook_secret)
                    مفتاح سر الويب هوك (الافتراضي: test_webhook_secret)
  --url, -u         Webhook URL (default: http://localhost:3000/webhooks)
                    رابط الويب هوك (الافتراضي: http://localhost:3000/webhooks)
  --event, -e       Event type (default: order.created)
                    نوع الحدث (الافتراضي: order.created)
  --method, -m      HTTP method (default: POST)
                    طريقة HTTP (الافتراضي: POST)
  --verbose, -v     Show detailed output / إخراج تفصيلي
  --help, -h        Show this help message / عرض رسالة المساعدة

Examples / أمثلة:
  # Test Salla webhook
  # اختبار webhook Salla
  node test-webhook.js --platform salla --secret my_secret --url http://localhost:3000/webhooks

  # Test Zid webhook
  # اختبار webhook Zid
  node test-webhook.js --platform zid --secret my_secret --url http://localhost:3000/webhooks

  # Test with specific event
  # اختبار بحدث محدد
  node test-webhook.js --event product.created

  # Verbose output
  # إخراج تفصيلي
  node test-webhook.js --verbose
`);
}

/**
 * Generate signature for webhook payload
 * إنشاء توقيع لحمولة الويب هوك
 */
function generateSignature(payload, secret, platform) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload);
  const signature = hmac.digest('hex');
  return `sha256=${signature}`;
}

/**
 * Generate sample webhook payload
 * إنشاء حمولة ويب هوك نموذجية
 */
function generatePayload(event, platform) {
  const payloads = {
    'order.created': {
      id: `order_${Date.now()}`,
      event: event,
      reference: `REF-${Date.now()}`,
      status: 'new',
      total: 150.00,
      currency: 'SAR',
      customer: {
        id: `customer_${Date.now()}`,
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+966500000000'
      },
      items: [
        {
          id: `product_${Date.now()}`,
          name: 'Test Product',
          quantity: 1,
          price: 150.00
        }
      ],
      created_at: new Date().toISOString()
    },
    'order.updated': {
      id: `order_${Date.now()}`,
      event: event,
      reference: `REF-${Date.now()}`,
      status: 'processing',
      total: 150.00,
      currency: 'SAR',
      updated_at: new Date().toISOString()
    },
    'product.created': {
      id: `product_${Date.now()}`,
      event: event,
      name: 'Test Product',
      description: 'A test product for webhook testing',
      price: 150.00,
      quantity: 100,
      status: 'active',
      created_at: new Date().toISOString()
    },
    'customer.created': {
      id: `customer_${Date.now()}`,
      event: event,
      name: 'Test Customer',
      email: 'test@example.com',
      phone: '+966500000000',
      created_at: new Date().toISOString()
    },
    'payment.captured': {
      id: `payment_${Date.now()}`,
      event: event,
      order_id: `order_${Date.now()}`,
      amount: 150.00,
      currency: 'SAR',
      status: 'captured',
      payment_method: 'credit_card',
      created_at: new Date().toISOString()
    }
  };

  return payloads[event] || {
    event: event,
    id: `test_${Date.now()}`,
    platform: platform,
    timestamp: new Date().toISOString()
  };
}

/**
 * Send webhook request
 * إرسال طلب الويب هوك
 */
function sendWebhook(url, payload, signature, platform) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const httpModule = isHttps ? https : http;

    const payloadString = JSON.stringify(payload);

    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payloadString)
    };

    // Add platform-specific signature header
    // إضافة رأس التوقيع الخاص بالمنصة
    if (platform === 'salla') {
      headers['X-Salla-Signature'] = signature;
      headers['X-Salla-Event'] = payload.event;
    } else if (platform === 'zid') {
      headers['X-Zid-Signature'] = signature;
      headers['X-Zid-Event'] = payload.event;
    }

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: config.method,
      headers: headers
    };

    if (config.verbose) {
      console.log('\n=== Request Details / تفاصيل الطلب ===');
      console.log('URL:', url);
      console.log('Method:', options.method);
      console.log('Headers:', JSON.stringify(headers, null, 2));
      console.log('Payload:', JSON.stringify(payload, null, 2));
    }

    const req = httpModule.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(payloadString);
    req.end();
  });
}

/**
 * Main function
 * الوظيفة الرئيسية
 */
async function main() {
  if (config.help) {
    showHelp();
    process.exit(0);
  }

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║     Salla/Zid Webhook Testing Tool                          ║
║     أداة اختبار الويب هوك لـ Salla و Zid                   ║
╚══════════════════════════════════════════════════════════════╝
`);

  console.log('Configuration / التكوين:');
  console.log(`  Platform / المنصة:    ${config.platform}`);
  console.log(`  URL:                  ${config.url}`);
  console.log(`  Event / الحدث:        ${config.event}`);
  console.log(`  Method / الطريقة:     ${config.method}`);
  console.log(`  Secret / السر:        ${config.secret.substring(0, 3)}***`);
  console.log('');

  // Generate payload
  // إنشاء الحمولة
  const payload = generatePayload(config.event, config.platform);

  // Generate signature
  // إنشاء التوقيع
  const payloadString = JSON.stringify(payload);
  const signature = generateSignature(payloadString, config.secret, config.platform);

  console.log(`Generated Signature / التوقيع المولد: ${signature.substring(0, 20)}...`);
  console.log('');

  try {
    // Send webhook
    // إرسال الويب هوك
    console.log('Sending webhook... / جاري إرسال الويب هوك...\n');

    const response = await sendWebhook(config.url, payload, signature, config.platform);

    // Display response
    // عرض الاستجابة
    console.log('=== Response / الاستجابة ===');
    console.log(`Status Code / رمز الحالة: ${response.statusCode}`);

    try {
      const responseBody = JSON.parse(response.body);
      console.log('Body / المحتوى:', JSON.stringify(responseBody, null, 2));
    } catch {
      console.log('Body / المحتوى:', response.body);
    }

    // Check if successful
    // التحقق من النجاح
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log('\n✓ Webhook sent successfully! / تم إرسال الويب هوك بنجاح!');
    } else {
      console.log('\n✗ Webhook request failed / فشل طلب الويب هوك');
    }

  } catch (error) {
    console.error('\n✗ Error / خطأ:', error.message);
    if (config.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Run main function
// تشغيل الوظيفة الرئيسية
main().catch(console.error);
