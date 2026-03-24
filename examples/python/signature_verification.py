"""
Salla/Zid Webhook Signature Verification
التحقق من توقيع Webhook لـ Salla و Zid

This utility provides signature verification for both Salla and Zid webhooks
توفر هذه الأداة التحقق من التوقيع لكل من Salla و Zid
"""

import hmac
import hashlib
from typing import Optional, Dict, Any


def verify_salla_signature(payload: str, signature: str, secret: str) -> bool:
    """
    Verify Salla webhook signature
    التحقق من توقيع webhook لـ Salla

    Salla uses HMAC-SHA256 with the webhook secret
    تستخدم Salla تشفير HMAC-SHA256 مع مفتاح السر

    Args:
        payload: The raw webhook payload JSON
        signature: The signature from header (X-Salla-Signature)
        secret: Your webhook secret key

    Returns:
        bool: True if signature is valid
    """
    # Remove 'sha256=' prefix if present
    # إزالة بادئة 'sha256=' إذا كانت موجودة
    signature = signature.replace('sha256=', '').replace('SHA256=', '')

    # Calculate expected signature
    # حساب التوقيع المتوقع
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    # Constant-time comparison to prevent timing attacks
    # مقارنة ثابتة الزمن لمنع هجمات التوقيت
    return hmac.compare_digest(expected_signature, signature)


def verify_zid_signature(payload: str, signature: str, secret: str) -> bool:
    """
    Verify Zid webhook signature
    التحقق من توقيع webhook لـ Zid

    Zid uses HMAC-SHA256 with the webhook secret
    تستخدم Zid تشفير HMAC-SHA256 مع مفتاح السر

    Args:
        payload: The raw webhook payload JSON
        signature: The signature from header (X-Zid-Signature)
        secret: Your webhook secret key

    Returns:
        bool: True if signature is valid
    """
    # Remove any prefix if present
    # إزالة أي بادئة إذا كانت موجودة
    signature = signature.replace('sha256=', '').replace('SHA256=', '')
    signature = signature.replace('hmac_sha256=', '').replace('HMAC_SHA256=', '')

    # Calculate expected signature
    # حساب التوقيع المتوقع
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()

    # Constant-time comparison to prevent timing attacks
    # مقارنة ثابتة الزمن لمنع هجمات التوقيت
    return hmac.compare_digest(expected_signature, signature)


def verify_signature_auto_detect(
    payload: str,
    headers: Dict[str, str],
    salla_secret: str,
    zid_secret: str
) -> Dict[str, Any]:
    """
    Auto-detect platform and verify signature
    الكشف التلقائي عن المنصة والتحقق من التوقيع

    Args:
        payload: The raw webhook payload
        headers: All request headers
        salla_secret: Salla webhook secret
        zid_secret: Zid webhook secret

    Returns:
        dict: {'valid': bool, 'platform': str or None}
    """
    # Normalize header keys to lowercase
    # توحيد مفاتيح الرؤوس إلى أحرف صغيرة
    headers_lower = {k.lower(): v for k, v in headers.items()}

    # Check for Salla signature
    # التحقق من توقيع Salla
    salla_signature = headers_lower.get('x-salla-signature')
    if salla_signature:
        return {
            'valid': verify_salla_signature(payload, salla_signature, salla_secret),
            'platform': 'salla'
        }

    # Check for Zid signature
    # التحقق من توقيع Zid
    zid_signature = headers_lower.get('x-zid-signature')
    if zid_signature:
        return {
            'valid': verify_zid_signature(payload, zid_signature, zid_secret),
            'platform': 'zid'
        }

    return {
        'valid': False,
        'platform': None
    }


def extract_signatures(headers: Dict[str, str]) -> Dict[str, Optional[str]]:
    """
    Extract signatures from headers
    استخراج التوقيعات من الرؤوس

    Args:
        headers: Request headers

    Returns:
        dict: {'salla': str or None, 'zid': str or None}
    """
    headers_lower = {k.lower(): v for k, v in headers.items()}

    return {
        'salla': headers_lower.get('x-salla-signature'),
        'zid': headers_lower.get('x-zid-signature')
    }


class WebhookVerifier:
    """
    Webhook signature verifier class
    فئة مدقق توقيع الويب هوك
    """

    def __init__(self, salla_secret: str = None, zid_secret: str = None):
        """
        Initialize the verifier with secrets
        تهيئة المدقق بأسرار المفاتيح

        Args:
            salla_secret: Salla webhook secret key
            zid_secret: Zid webhook secret key
        """
        import os

        self.salla_secret = salla_secret or os.getenv('SALLA_WEBHOOK_SECRET', '')
        self.zid_secret = zid_secret or os.getenv('ZID_WEBHOOK_SECRET', '')

    def verify(self, payload: str, headers: Dict[str, str]) -> Dict[str, Any]:
        """
        Verify webhook signature with auto-detection
        التحقق من توقيع الويب هوك بالكشف التلقائي

        Args:
            payload: Raw webhook payload
            headers: Request headers

        Returns:
            dict: Verification result with 'valid' and 'platform' keys
        """
        return verify_signature_auto_detect(
            payload,
            headers,
            self.salla_secret,
            self.zid_secret
        )

    def verify_salla(self, payload: str, signature: str) -> bool:
        """Verify Salla signature specifically"""
        return verify_salla_signature(payload, signature, self.salla_secret)

    def verify_zid(self, payload: str, signature: str) -> bool:
        """Verify Zid signature specifically"""
        return verify_zid_signature(payload, signature, self.zid_secret)
