"""Minimal Salla + Zid webhook receiver.

    pip install flask
    SALLA_WEBHOOK_SECRET=... ZID_WEBHOOK_USER=... ZID_WEBHOOK_PASSWORD=... flask --app app run -p 3000

Salla: POST /webhooks/salla   Zid: POST /webhooks/zid
"""

import base64
import hashlib
import hmac
import os

from flask import Flask, abort, request

app = Flask(__name__)


def verify_salla(raw_body: bytes, headers) -> bool:
    secret = os.environ["SALLA_WEBHOOK_SECRET"]
    if headers.get("X-Salla-Security-Strategy") == "Token":
        return hmac.compare_digest(secret, headers.get("Authorization", ""))
    # Signature strategy (default): HMAC-SHA256 of the raw body.
    expected = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, headers.get("X-Salla-Signature", ""))


def verify_zid(headers) -> bool:
    # Zid sends Basic auth when the webhook was created with username and password.
    credentials = f"{os.environ['ZID_WEBHOOK_USER']}:{os.environ['ZID_WEBHOOK_PASSWORD']}"
    expected = "Basic " + base64.b64encode(credentials.encode()).decode()
    return hmac.compare_digest(expected, headers.get("Authorization", ""))


@app.post("/webhooks/<platform>")
def webhook(platform):
    raw_body = request.get_data()
    if platform == "salla":
        valid = verify_salla(raw_body, request.headers)
    elif platform == "zid":
        valid = verify_zid(request.headers)
    else:
        abort(404)
    if not valid:
        abort(401)

    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        abort(400)

    # Queue the work here and return quickly; both platforms retry slow or failed deliveries.
    app.logger.info("%s %s", platform, payload.get("event") or payload.get("event_name") or "store event")
    return "ok", 200
