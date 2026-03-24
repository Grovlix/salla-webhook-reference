"""
Salla/Zid Webhook Handler for FastAPI
معالج أحداث Webhook لـ Salla و Zid باستخدام FastAPI

This module handles incoming webhooks from both Salla and Zid platforms
يتعامل هذا الوحدة مع الويب هوك القادمة من كل من Salla و Zid
"""

import os
import logging
from typing import Dict, Any, Optional
from fastapi import FastAPI, Request, HTTPException, Header, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn

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

# Initialize FastAPI app
# تهيئة تطبيق FastAPI
app = FastAPI(
    title="Salla/Zid Webhook Handler",
    description="Webhook handler for Salla and Zid e-commerce platforms",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuration
# التكوين
SALLA_WEBHOOK_SECRET = os.getenv('SALLA_WEBHOOK_SECRET', '')
ZID_WEBHOOK_SECRET = os.getenv('ZID_WEBHOOK_SECRET', '')

# Initialize verifier
# تهيئة المدقق
verifier = WebhookVerifier(
    salla_secret=SALLA_WEBHOOK_SECRET,
    zid_secret=ZID_WEBHOOK_SECRET
)


# Response models
# نماذج الاستجابة
class HealthResponse(BaseModel):
    """Health check response model"""
    """نموذج استجابة الفحص الصحي"""
    status: str
    message: str
    message_ar: str


class WebhookResponse(BaseModel):
    """Webhook response model"""
    """نموذج استجابة الويب هوك"""
    success: bool
    message: str = "Webhook received successfully"
    message_ar: str = "تم استلام الويب هوك بنجاح"


class ErrorResponse(BaseModel):
    """Error response model"""
    """نموذج استجابة الخطأ"""
    error: str
    message: str


# Root endpoint
# نقطة النهاية الجذرية
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint with service information
    نقطة النهاية الجذرية مع معلومات الخدمة
    """
    return {
        "service": "Salla/Zid Webhook Handler",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "webhooks": "/webhooks",
            "webhooks_salla": "/webhooks/salla",
            "webhooks_zid": "/webhooks/zid",
            "health": "/health",
            "docs": "/docs"
        }
    }


# Health check endpoint
# نقطة نهاية الفحص الصحي
@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health():
    """
    Health check endpoint
    نقطة نهاية الفحص الصحي
    """
    return HealthResponse(
        status="healthy",
        message="Webhook service is running",
        message_ar="خدمة الويب هوك تعمل"
    )


# Main webhook handler
# معالج الويب هوك الرئيسي
@app.post("/webhooks", response_model=WebhookResponse, tags=["Webhooks"])
async def handle_webhook(request: Request):
    """
    Main webhook handler endpoint (supports both Salla and Zid)
    نقطة نهاية معالج الويب هوك الرئيسية (تدعم كل من Salla و Zid)

    This endpoint auto-detects the platform based on the signature header
    هذه النقطة تكتشف المنصة تلقائياً بناءً على رأس التوقيع
    """
    try:
        # Get raw payload
        # الحصول على الحمولة الخام
        payload = await request.body()
        payload_str = payload.decode('utf-8')

        # Log incoming webhook
        # تسجيل الويب هوك القادم
        client_ip = request.client.host if request.client else "unknown"
        logger.info(
            f"Webhook received from {client_ip}",
            extra={"user_agent": request.headers.get("user-agent")}
        )

        # Verify signature
        # التحقق من التوقيع
        headers = dict(request.headers)
        verification = verify_signature_auto_detect(
            payload_str,
            headers,
            SALLA_WEBHOOK_SECRET,
            ZID_WEBHOOK_SECRET
        )

        if not verification['valid']:
            logger.warning(
                f"Invalid webhook signature for platform: {verification.get('platform', 'unknown')}",
                extra={"ip": client_ip}
            )
            raise HTTPException(
                status_code=401,
                detail={
                    "error": "Invalid signature",
                    "message": "التوقيع غير صالح"
                }
            )

        # Parse webhook data
        # تحليل بيانات الويب هوك
        try:
            data = await request.json()
        except Exception as e:
            logger.error(f"Invalid JSON payload: {e}")
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "Invalid JSON",
                    "message": "تنسيق JSON غير صالح"
                }
            )

        # Get event type
        # الحصول على نوع الحدث
        event = data.get('event') or data.get('event_name') or 'unknown'

        logger.info(f"Processing webhook: {verification['platform']} - {event}")

        # Process the webhook based on platform and event type
        # معالجة الويب هوك بناءً على المنصة ونوع الحدث
        await process_webhook(verification['platform'], event, data, request)

        # Return success response
        # إرجاع استجابة النجاح
        return WebhookResponse(success=True)

    except HTTPException:
        raise
    except Exception as e:
        # Log error
        # تسجيل الخطأ
        logger.exception("Webhook processing error")

        # Return error response
        # إرجاع استجابة الخطأ
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Internal server error",
                "message": "خطأ في الخادم الداخلي"
            }
        )


# Dedicated Salla webhook endpoint
# نقطة نهاية مخصصة لـ Salla
@app.post("/webhooks/salla", response_model=WebhookResponse, tags=["Webhooks"])
async def handle_salla_webhook(
    request: Request,
    x_salla_signature: Optional[str] = Header(None, alias="X-Salla-Signature")
):
    """
    Dedicated Salla webhook endpoint
    نقطة نهاية مخصصة لـ Salla

    Requires X-Salla-Signature header for verification
    يتطلب رأس X-Salla-Signature للتحقق
    """
    try:
        if not x_salla_signature:
            raise HTTPException(
                status_code=401,
                detail={
                    "error": "Missing signature",
                    "message": "التوقيع مفقود"
                }
            )

        payload = await request.body()
        payload_str = payload.decode('utf-8')

        if not verifier.verify_salla(payload_str, x_salla_signature):
            raise HTTPException(
                status_code=401,
                detail={
                    "error": "Invalid signature",
                    "message": "التوقيع غير صالح"
                }
            )

        data = await request.json()
        event = data.get('event') or data.get('event_name') or 'unknown'

        await process_webhook('salla', event, data, request)

        return WebhookResponse(success=True)

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Salla webhook error")
        raise HTTPException(status_code=500, detail={"error": "Internal error"})


# Dedicated Zid webhook endpoint
# نقطة نهاية مخصصة لـ Zid
@app.post("/webhooks/zid", response_model=WebhookResponse, tags=["Webhooks"])
async def handle_zid_webhook(
    request: Request,
    x_zid_signature: Optional[str] = Header(None, alias="X-Zid-Signature")
):
    """
    Dedicated Zid webhook endpoint
    نقطة نهاية مخصصة لـ Zid

    Requires X-Zid-Signature header for verification
    يتطلب رأس X-Zid-Signature للتحقق
    """
    try:
        if not x_zid_signature:
            raise HTTPException(
                status_code=401,
                detail={
                    "error": "Missing signature",
                    "message": "التوقيع مفقود"
                }
            )

        payload = await request.body()
        payload_str = payload.decode('utf-8')

        if not verifier.verify_zid(payload_str, x_zid_signature):
            raise HTTPException(
                status_code=401,
                detail={
                    "error": "Invalid signature",
                    "message": "التوقيع غير صالح"
                }
            )

        data = await request.json()
        event = data.get('event') or data.get('event_name') or 'unknown'

        await process_webhook('zid', event, data, request)

        return WebhookResponse(success=True)

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Zid webhook error")
        raise HTTPException(status_code=500, detail={"error": "Internal error"})


async def process_webhook(platform: str, event: str, data: Dict[str, Any], request: Request) -> None:
    """
    Process webhook based on platform and event type
    معالجة الويب هوك بناءً على المنصة ونوع الحدث

    Args:
        platform: 'salla' or 'zid'
        event: Event name/type
        data: Webhook payload data
        request: FastAPI request object
    """
    logger.info(f"[{platform.upper()}] Processing event: {event}")

    # Order events / أحداث الطلبات
    if event in ['order.created', 'order.updated', 'order.status.changed', 'order.cancelled']:
        await handle_order_event(platform, event, data)

    # Product events / أحداث المنتجات
    elif event in ['product.created', 'product.updated', 'product.deleted']:
        await handle_product_event(platform, event, data)

    # Customer events / أحداث العملاء
    elif event in ['customer.created', 'customer.updated', 'customer.deleted']:
        await handle_customer_event(platform, event, data)

    # Payment events / أحداث الدفع
    elif event in ['payment.captured', 'payment.failed', 'payment.refunded']:
        await handle_payment_event(platform, event, data)

    # Subscription events / أحداث الاشتراكات
    elif event in ['subscription.created', 'subscription.renewed', 'subscription.cancelled']:
        await handle_subscription_event(platform, event, data)

    else:
        logger.info(f"Unhandled webhook event: {event}")


async def handle_order_event(platform: str, event: str, data: Dict[str, Any]) -> None:
    """Handle order-related events"""
    """معالجة أحداث الطلبات"""
    order_id = data.get('id') or data.get('order_id')

    logger.info(f"Order event received: {platform} - {event} - Order ID: {order_id}")

    # Add your custom logic here
    # أضف منطقك المخصص هنا
    # Examples: sync to database, send notifications, update inventory, etc.
    # أمثلة: المزامنة مع قاعدة البيانات، إرسال إشعارات، تحديث المخزون، إلخ


async def handle_product_event(platform: str, event: str, data: Dict[str, Any]) -> None:
    """Handle product-related events"""
    """معالجة أحداث المنتجات"""
    product_id = data.get('id') or data.get('product_id')

    logger.info(f"Product event received: {platform} - {event} - Product ID: {product_id}")

    # Add your custom logic here
    # أضف منطقك المخصص هنا


async def handle_customer_event(platform: str, event: str, data: Dict[str, Any]) -> None:
    """Handle customer-related events"""
    """معالجة أحداث العملاء"""
    customer_id = data.get('id') or data.get('customer_id')

    logger.info(f"Customer event received: {platform} - {event} - Customer ID: {customer_id}")

    # Add your custom logic here
    # أضف منطقك المخصص هنا


async def handle_payment_event(platform: str, event: str, data: Dict[str, Any]) -> None:
    """Handle payment-related events"""
    """معالجة أحداث الدفع"""
    payment_id = data.get('id') or data.get('payment_id')

    logger.info(f"Payment event received: {platform} - {event} - Payment ID: {payment_id}")

    # Add your custom logic here
    # أضف منطقك المخصص هنا


async def handle_subscription_event(platform: str, event: str, data: Dict[str, Any]) -> None:
    """Handle subscription-related events"""
    """معالجة أحداث الاشتراكات"""
    subscription_id = data.get('id') or data.get('subscription_id')

    logger.info(f"Subscription event received: {platform} - {event} - Subscription ID: {subscription_id}")

    # Add your custom logic here
    # أضف منطقك المخصص هنا


# Exception handlers
# معالجات الاستثناءات
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom HTTP exception handler"""
    """معالج استثناء HTTP مخصص"""
    return JSONResponse(
        status_code=exc.status_code,
        content=exc.detail if isinstance(exc.detail, dict) else {"error": exc.detail}
    )


if __name__ == "__main__":
    # Run the app
    # تشغيل التطبيق
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
