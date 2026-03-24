"""
Salla/Zid Webhook Handler for Flask
معالج أحداث Webhook لـ Salla و Zid باستخدام Flask

This module handles incoming webhooks from both Salla and Zid platforms
يتعامل هذا الوحدة مع الويب هوك القادمة من كل من Salla و Zid
"""

import os
import json
import logging
from typing import Dict, Any
from flask import Flask, request, jsonify
from signature_verification import (
    verify_signature_auto_detect,
    WebhookVerifier
)

# Configure logging
# تكوين التسجيل
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask app
# تهيئة تطبيق Flask
app = Flask(__name__)

# Configuration
# التكوين
app.config.update({
    'SALLA_WEBHOOK_SECRET': os.getenv('SALLA_WEBHOOK_SECRET', ''),
    'ZID_WEBHOOK_SECRET': os.getenv('ZID_WEBHOOK_SECRET', ''),
})

# Initialize verifier
# تهيئة المدقق
verifier = WebhookVerifier(
    salla_secret=app.config['SALLA_WEBHOOK_SECRET'],
    zid_secret=app.config['ZID_WEBHOOK_SECRET']
)


@app.route('/', methods=['GET'])
def index():
    """Root endpoint with service information"""
    """نقطة النهاية الجذرية مع معلومات الخدمة"""
    return jsonify({
        'service': 'Salla/Zid Webhook Handler',
        'status': 'running',
        'version': '1.0.0',
        'endpoints': {
            'webhooks': '/webhooks',
            'webhooks_salla': '/webhooks/salla',
            'webhooks_zid': '/webhooks/zid',
            'health': '/health'
        }
    })


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    """نقطة نهاية الفحص الصحي"""
    return jsonify({
        'status': 'healthy',
        'message': 'Webhook service is running',
        'message_ar': 'خدمة الويب هوك تعمل',
    })


@app.route('/webhooks', methods=['POST'])
def handle_webhook():
    """
    Main webhook handler endpoint
    نقطة نهاية معالج الويب هوك الرئيسية
    """
    try:
        # Get raw payload
        # الحصول على الحمولة الخام
        payload = request.get_data(as_text=True)

        # Log incoming webhook
        # تسجيل الويب هوك القادم
        logger.info('Webhook received', extra={
            'ip': request.remote_addr,
            'user_agent': request.headers.get('User-Agent'),
        })

        # Verify signature
        # التحقق من التوقيع
        verification = verifier.verify(payload, dict(request.headers))

        if not verification['valid']:
            logger.warning('Invalid webhook signature', extra={
                'platform': verification.get('platform', 'unknown'),
                'ip': request.remote_addr
            })

            return jsonify({
                'error': 'Invalid signature',
                'message': 'التوقيع غير صالح'
            }), 401

        # Parse webhook data
        # تحليل بيانات الويب هوك
        try:
            data = request.get_json()
        except Exception as e:
            logger.error(f'Invalid JSON payload: {e}')
            return jsonify({
                'error': 'Invalid JSON',
                'message': 'تنسيق JSON غير صالح'
            }), 400

        # Get event type
        # الحصول على نوع الحدث
        event = data.get('event') or data.get('event_name') or 'unknown'

        logger.info(f'Processing webhook: {verification["platform"]} - {event}')

        # Process the webhook based on platform and event type
        # معالجة الويب هوك بناءً على المنصة ونوع الحدث
        process_webhook(verification['platform'], event, data, request)

        # Return success response
        # إرجاع استجابة النجاح
        return jsonify({
            'success': True,
            'message': 'Webhook received successfully',
            'message_ar': 'تم استلام الويب هوك بنجاح'
        }), 200

    except Exception as e:
        # Log error
        # تسجيل الخطأ
        logger.exception('Webhook processing error')

        # Return error response
        # إرجاع استجابة الخطأ
        return jsonify({
            'error': 'Internal server error',
            'message': 'خطأ في الخادم الداخلي'
        }), 500


@app.route('/webhooks/salla', methods=['POST'])
def handle_salla_webhook():
    """Dedicated Salla webhook endpoint"""
    """نقطة نهاية مخصصة لـ Salla"""
    try:
        payload = request.get_data(as_text=True)
        signature = request.headers.get('X-Salla-Signature')

        if not signature:
            return jsonify({
                'error': 'Missing signature',
                'message': 'التوقيع مفقود'
            }), 401

        if not verifier.verify_salla(payload, signature):
            return jsonify({
                'error': 'Invalid signature',
                'message': 'التوقيع غير صالح'
            }), 401

        data = request.get_json()
        event = data.get('event') or data.get('event_name') or 'unknown'

        process_webhook('salla', event, data, request)

        return jsonify({'success': True}), 200

    except Exception as e:
        logger.exception('Salla webhook error')
        return jsonify({'error': 'Internal error'}), 500


@app.route('/webhooks/zid', methods=['POST'])
def handle_zid_webhook():
    """Dedicated Zid webhook endpoint"""
    """نقطة نهاية مخصصة لـ Zid"""
    try:
        payload = request.get_data(as_text=True)
        signature = request.headers.get('X-Zid-Signature')

        if not signature:
            return jsonify({
                'error': 'Missing signature',
                'message': 'التوقيع مفقود'
            }), 401

        if not verifier.verify_zid(payload, signature):
            return jsonify({
                'error': 'Invalid signature',
                'message': 'التوقيع غير صالح'
            }), 401

        data = request.get_json()
        event = data.get('event') or data.get('event_name') or 'unknown'

        process_webhook('zid', event, data, request)

        return jsonify({'success': True}), 200

    except Exception as e:
        logger.exception('Zid webhook error')
        return jsonify({'error': 'Internal error'}), 500


def process_webhook(platform: str, event: str, data: Dict[str, Any], req) -> None:
    """
    Process webhook based on platform and event type
    معالجة الويب هوك بناءً على المنصة ونوع الحدث

    Args:
        platform: 'salla' or 'zid'
        event: Event name/type
        data: Webhook payload data
        req: Flask request object
    """
    logger.info(f'[{platform.upper()}] Processing event: {event}')

    # Order events / أحداث الطلبات
    if event in ['order.created', 'order.updated', 'order.status.changed', 'order.cancelled']:
        handle_order_event(platform, event, data)

    # Product events / أحداث المنتجات
    elif event in ['product.created', 'product.updated', 'product.deleted']:
        handle_product_event(platform, event, data)

    # Customer events / أحداث العملاء
    elif event in ['customer.created', 'customer.updated', 'customer.deleted']:
        handle_customer_event(platform, event, data)

    # Payment events / أحداث الدفع
    elif event in ['payment.captured', 'payment.failed', 'payment.refunded']:
        handle_payment_event(platform, event, data)

    # Subscription events / أحداث الاشتراكات
    elif event in ['subscription.created', 'subscription.renewed', 'subscription.cancelled']:
        handle_subscription_event(platform, event, data)

    else:
        logger.info(f'Unhandled webhook event: {event}')


def handle_order_event(platform: str, event: str, data: Dict[str, Any]) -> None:
    """Handle order-related events"""
    """معالجة أحداث الطلبات"""
    order_id = data.get('id') or data.get('order_id')

    logger.info(f'Order event received: {platform} - {event} - Order ID: {order_id}')

    # Add your custom logic here
    # أضف منطقك المخصص هنا
    # Examples: sync to database, send notifications, update inventory, etc.
    # أمثلة: المزامنة مع قاعدة البيانات، إرسال إشعارات، تحديث المخزون، إلخ


def handle_product_event(platform: str, event: str, data: Dict[str, Any]) -> None:
    """Handle product-related events"""
    """معالجة أحداث المنتجات"""
    product_id = data.get('id') or data.get('product_id')

    logger.info(f'Product event received: {platform} - {event} - Product ID: {product_id}')

    # Add your custom logic here
    # أضف منطقك المخصص هنا


def handle_customer_event(platform: str, event: str, data: Dict[str, Any]) -> None:
    """Handle customer-related events"""
    """معالجة أحداث العملاء"""
    customer_id = data.get('id') or data.get('customer_id')

    logger.info(f'Customer event received: {platform} - {event} - Customer ID: {customer_id}')

    # Add your custom logic here
    # أضف منطقك المخصص هنا


def handle_payment_event(platform: str, event: str, data: Dict[str, Any]) -> None:
    """Handle payment-related events"""
    """معالجة أحداث الدفع"""
    payment_id = data.get('id') or data.get('payment_id')

    logger.info(f'Payment event received: {platform} - {event} - Payment ID: {payment_id}')

    # Add your custom logic here
    # أضف منطقك المخصص هنا


def handle_subscription_event(platform: str, event: str, data: Dict[str, Any]) -> None:
    """Handle subscription-related events"""
    """معالجة أحداث الاشتراكات"""
    subscription_id = data.get('id') or data.get('subscription_id')

    logger.info(f'Subscription event received: {platform} - {event} - Subscription ID: {subscription_id}')

    # Add your custom logic here
    # أضف منطقك المخصص هنا


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    """معالجة أخطاء 404"""
    return jsonify({
        'error': 'Not found',
        'message': 'النقطة المطلوبة غير موجودة'
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    """معالجة أخطاء 500"""
    logger.exception('Internal server error')
    return jsonify({
        'error': 'Internal server error',
        'message': 'خطأ في الخادم الداخلي'
    }), 500


if __name__ == '__main__':
    # Run the app
    # تشغيل التطبيق
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'

    app.run(host='0.0.0.0', port=port, debug=debug)
