#!/bin/bash

# Salla/Zid Webhook Testing Script (Bash Version)
# سكريبت اختبار الويب هوك (نسخة Bash)

# Default values / القيم الافتراضية
PLATFORM="salla"
URL="http://localhost:3000/webhooks"
EVENT="order.created"
VERBOSE=false

# Colors / الألوان
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Parse arguments / تحليل الوسائط
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --platform|-p) PLATFORM="$2"; shift ;;
        --url|-u) URL="$2"; shift ;;
        --event|-e) EVENT="$2"; shift ;;
        --secret|-s) SECRET="$2"; shift ;;
        --verbose|-v) VERBOSE=true ;;
        --help|-h) show_help; exit 0 ;;
        *) echo "Unknown option: $1"; echo "Use --help for usage"; exit 1 ;;
    esac
    shift
done

show_help() {
    cat << EOF
Salla/Zid Webhook Testing Script (Bash)
سكريبت اختبار الويب هوك (Bash)

Usage / الاستخدام:
  ./test-webhook.sh [options]

Options / الخيارات:
  --platform, -p    Platform: salla or zid (default: salla)
  --url, -u         Webhook URL (default: http://localhost:3000/webhooks)
  --event, -e       Event type (default: order.created)
  --secret, -s      Webhook secret (required)
  --verbose, -v     Show detailed output
  --help, -h        Show this help

Examples / أمثلة:
  ./test-webhook.sh --platform salla --secret my_secret --url http://localhost:3000/webhooks
  ./test-webhook.sh --platform zid --secret my_secret --event product.created
EOF
}

# Generate sample payload / إنشاء حمولة نموذجية
generate_payload() {
    local event=$1
    cat << EOF
{
  "id": "test_$(date +%s)",
  "event": "$event",
  "reference": "REF_$(date +%s)",
  "status": "new",
  "total": 150.00,
  "currency": "SAR",
  "customer": {
    "id": "customer_$(date +%s)",
    "name": "Test Customer",
    "email": "test@example.com",
    "phone": "+966500000000"
  },
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF
}

# Main execution / التنفيذ الرئيسي
echo -e "${BLUE}=== Salla/Zid Webhook Test ===${NC}"
echo "Platform / المنصة: $PLATFORM"
echo "URL: $URL"
echo "Event / الحدث: $EVENT"
echo ""

PAYLOAD=$(generate_payload "$EVENT")

if [ "$VERBOSE" = true ]; then
    echo "Payload / الحمولة:"
    echo "$PAYLOAD"
    echo ""
fi

# Send request / إرسال الطلب
if [ "$PLATFORM" = "salla" ]; then
    HEADER="X-Salla-Signature"
elif [ "$PLATFORM" = "zid" ]; then
    HEADER="X-Zid-Signature"
fi

# Generate signature (requires openssl) / إنشاء التوقيع
if command -v openssl &> /dev/null && [ -n "$SECRET" ]; then
    SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')
    SIGNATURE="sha256=$SIGNATURE"
fi

echo "Sending webhook... / جاري إرسال الويب هوك..."
echo ""

# Send using curl / الإرسال باستخدام curl
if command -v curl &> /dev/null; then
    if [ -n "$SECRET" ]; then
        RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -H "$HEADER: $SIGNATURE" \
            -d "$PAYLOAD" \
            "$URL")
    else
        echo -e "${RED}Warning: No secret provided, signature header will be missing${NC}"
        RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -d "$PAYLOAD" \
            "$URL")
    fi

    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n -1)

    echo "HTTP Status: $HTTP_CODE"
    echo "Response / الاستجابة:"
    echo "$BODY"

    if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
        echo -e "\n${GREEN}✓ Webhook sent successfully!${NC}"
    else
        echo -e "\n${RED}✗ Webhook request failed${NC}"
    fi
else
    echo -e "${RED}Error: curl is not installed${NC}"
    exit 1
fi
