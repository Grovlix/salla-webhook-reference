# Salla & Zid Webhook Reference

<!-- English -->
A comprehensive reference guide for Salla and Zid webhook events, payloads, and integration patterns.

<!-- Arabic -->
دليل شامل لأحداث الـ Webhook الخاصة بمنصتي سلة وزد، يتضمن الـ payloads ونماذج التكامل.

---

## English

## About This Project

This repository serves as a complete reference for developers integrating with [Salla](https://www.salla.sa) and [Zid](https://zid.sa) e-commerce platforms through their webhook systems. It includes:

- **Complete webhook event documentation** for both platforms
- **JSON schemas** for validating webhook payloads
- **Code examples** in multiple programming languages
- **Integration guides** and best practices
- **Security guidelines** for webhook verification

## Quick Start

1. **Explore the Documentation**
   - Visit [docs.zid.sa](https://docs.zid.sa) or [docs.salla.sa](https://docs.salla.sa) for official API documentation
   - Browse the `/docs` folder in this repository for detailed event references

2. **Use the Schemas**
   ```bash
   # Validate a webhook payload against a schema
   npx ajv validate -s schemas/salla/order.created.json -d payload.json
   ```

3. **Implement Webhook Verification**
   ```javascript
   import { verifySallaSignature } from './examples/verify-signature.js';

   const isValid = verifySallaSignature(
     request.headers['x-salla-signature'],
     request.body,
     process.env.SALLA_WEBHOOK_SECRET
   );
   ```

## Repository Structure

```
.
├── docs/              # Detailed webhook documentation
│   ├── salla/         # Salla platform events
│   ├── zid/           # Zid platform events
│   └── guides/        # Integration guides
├── schemas/           # JSON schemas for validation
├── examples/          # Code examples
└── guides/            # Quick reference guides
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Resources

- [Official Salla Docs](https://docs.salla.sa)
- [Official Zid Docs](https://docs.zid.sa)
- [Grovlix.com](https://grovlix.com) - Integration services and consulting

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

---

## العربية

## حول هذا المشروع

يخدم هذا المستودع كمرجع شامل للمطورين الذين يدمجون مع منصتي [سلة](https://www.salla.sa) و[زد](https://zid.sa) للتجارة الإلكترونية من خلال أنظمة الـ Webhook الخاصة بهم. يتضمن:

- **توثيق شامل لأحداث الـ Webhook** لكلا المنصتين
- **مخططات JSON** للتحقق من صحة الـ payloads
- **أمثلة برمجية** بلغات متعددة
- **أدلة التكامل** وأفضل الممارسات
- **إرشادات الأمان** للتحقق من الـ webhooks

## البدء السريع

1. **استكشف التوثيق**
   - قم بزيارة [docs.zid.sa](https://docs.zid.sa) أو [docs.salla.sa](https://docs.salla.sa) للتوثيق الرسمي
   - تصفح المجلد `/docs` في هذا المستودع للمراجع التفصيلية للأحداث

2. **استخدم المخططات**
   ```bash
   # تحقق من صحة webhook payload باستخدام المخطط
   npx ajv validate -s schemas/salla/order.created.json -d payload.json
   ```

3. **طبق التحقق من الـ Webhook**
   ```javascript
   import { verifySallaSignature } from './examples/verify-signature.js';

   const isValid = verifySallaSignature(
     request.headers['x-salla-signature'],
     request.body,
     process.env.SALLA_WEBHOOK_SECRET
   );
   ```

## هيكل المستودع

```
.
├── docs/              # توثيق webhook المفصل
│   ├── salla/         # أحداث منصة سلة
│   ├── zid/           # أحداث منصة زد
│   └── guides/        # أدلة التكامل
├── schemas/           # مخططات JSON للتحقق من الصحة
├── examples/          # أمثلة برمجية
└── guides/            # أدلة مرجعية سريعة
```

## المساهمة

نرحب بمساهماتكم! يرجى مراجعة [CONTRIBUTING.md](CONTRIBUTING.md) للإرشادات.

## موارد

- [توثيق سلة الرسمي](https://docs.salla.sa)
- [توثيق زد الرسمي](https://docs.zid.sa)
- [Grovlix.com](https://grovlix.com) - خدمات التكامل والاستشارات

## الترخيص

هذا المشروع مرخص تحت ترخيص MIT - راجع [LICENSE](LICENSE) للتفاصيل.

---

<div align="center">

**Powered by [Grovlix.com](https://grovlix.com)**

Made with ❤️ for the Saudi developer community

</div>
