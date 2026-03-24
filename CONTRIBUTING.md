# Contributing to Salla & Zid Webhook Reference

<!-- English -->
Thank you for your interest in contributing to this project!

<!-- Arabic -->
شكراً لاهتمامك بالمساهمة في هذا المشروع!

---

## English

## How to Contribute

We appreciate all contributions, including:

- **Documentation improvements** - fixing typos, clarifying explanations
- **New webhook events** - adding documentation for undocumented events
- **Code examples** - adding examples in new languages or improving existing ones
- **Bug reports** - reporting issues with existing documentation
- **Schema updates** - improving JSON schemas for better validation

### Getting Started

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/salla-webhook-reference.git
   cd salla-webhook-reference
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing file structure and naming conventions
   - Ensure all documentation is bilingual (Arabic + English)
   - Test any code examples before submitting

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add documentation for order.updated event"
   ```

   Commit message prefixes:
   - `feat:` - New features or documentation
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `schema:` - Schema updates
   - `example:` - Code example changes

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Documentation Guidelines

#### File Structure

```
docs/
├── salla/
│   └── {entity}/
│       └── {event}.md
└── zid/
    └── {entity}/
        └── {event}.md
```

#### Markdown Template

```markdown
# Event Name

## English Description

Brief description of what this webhook event does.

## وصف الحدث

وصف مختصر لوظيفة هذا الويب هوك.

## Trigger

When does this event fire?

## التفعيل

متى يتم تشغيل هذا الحدث؟

## Payload Schema

```json
{
  "event": "event.name",
  "data": { ... }
}
```

## Example Usage

```javascript
// Code example
```

## أمثلة الاستخدام

```javascript
// مثال برمجي
```
```

#### Bilingual Content

- **Always provide both Arabic and English** for all documentation
- Place English content first, followed by Arabic
- Use clear separators between languages

### Code Style

- Use 4 spaces for indentation
- Follow existing formatting patterns
- Include comments in both languages when helpful

### Schema Guidelines

When adding or updating JSON schemas:

1. Use **JSON Schema Draft 2020-12**
2. Include **descriptions** for all properties
3. Provide **examples** in the schema
4. Test schemas against real webhook payloads

### Pull Request Checklist

Before submitting your PR, ensure:

- [ ] All documentation is bilingual
- [ ] Code examples are tested
- [ ] Schemas validate against example payloads
- [ ] Commit messages follow conventions
- [ ] No markdown linting errors
- [ ] Links are valid and working

---

## العربية

## كيفية المساهمة

نقدر جميع المساهمات، بما في ذلك:

- **تحسينات التوثيق** - تصحيح الأخطاء الإملائية، توضيح الشروحات
- **أحداث webhook جديدة** - إضافة توثيق للأحداث غير الموثقة
- **أمثلة برمجية** - إضافة أمثلة بلغات جديدة أو تحسين الأمثلة الحالية
- **التقارير عن الأخطاء** - الإبلاغ عن مشاكل في التوثيق الحالي
- **تحديثات المخططات** - تحسين مخططات JSON للتحقق الأفضل

### البدء

1. **قم بعمل Fork للمستودع**
   ```bash
   # انقر على زر "Fork" في GitHub، ثم استنسخ fork الخاص بك
   git clone https://github.com/YOUR_USERNAME/salla-webhook-reference.git
   cd salla-webhook-reference
   ```

2. **أنشئ فرعًا جديدًا**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **قم بإجراء التغييرات**
   - اتبع هيكل الملفات existing وقواعد التسمية
   - تأكد من أن جميع التوثيق ثنائي اللغة (عربي + إنجليزي)
   - اختبر الأمثلة البرمجية قبل الإرسال

4. **قم بحفظ التغييرات**
   ```bash
   git add .
   git commit -m "feat: add documentation for order.updated event"
   ```

   بادئات رسائل الالتزام:
   - `feat:` - ميزات أو توثيق جديد
   - `fix:` - إصلاحات أخطاء
   - `docs:` - تغييرات التوثيق
   - `schema:` - تحديثات المخططات
   - `example:` - تغييرات الأمثلة البرمجية

5. **ادفع وأنشئ طلب سحب**
   ```bash
   git push origin feature/your-feature-name
   ```

### إرشادات التوثيق

#### هيكل الملفات

```
docs/
├── salla/
│   └── {entity}/
│       └── {event}.md
└── zid/
    └── {entity}/
        └── {event}.md
```

#### قالب Markdown

```markdown
# اسم الحدث

## وصف بالإنجليزية

وصف مختصر لوظيفة هذا الويب هوك.

## وصف عربي

وصف مختصر لوظيفة هذا الويب هوك.

## التفعيل

متى يتم تشغيل هذا الحدث؟

## Payload Schema

```json
{
  "event": "event.name",
  "data": { ... }
}
```

## مثال الاستخدام

```javascript
// مثال برمجي
```

## Example Usage

```javascript
// Code example
```
```

#### المحتوى ثنائي اللغة

- **قدم دائمًا كلاً من العربية والإنجليزية** لجميع التوثيق
- ضع المحتوى الإنجليزي أولاً، يليه العربي
- استخدم فواصل واضحة بين اللغتين

### نمط الكود

- استخدم 4 مسافات للإزاحة
- اتبع أنماط التنسيق existing
- أضف تعليقات بلغتين عند الحاجة

### إرشادات المخططات

عند إضافة أو تحديث مخططات JSON:

1. استخدم **JSON Schema Draft 2020-12**
2. أضف **أوصاف** لجميع الخصائص
3. قدم **أمثلة** في المخطط
4. اختبر المخططات مقابل payloads حقيقية

### قائمة التحقق من طلب السحب

قبل إرسال PR الخاص بك، تأكد من:

- [ ] جميع التوثيق ثنائي اللغة
- [ ] الأمثلة البرمجية مختبرة
- [ ] المخططات تتحقق من payloads المثال
- [ ] رسائل الالتزام تتبع الاصطلاحات
- [ ] لا توجد أخطاء في linting Markdown
- [ ] الروابط صالحة وعاملة

---

## Code of Conduct / قواعد السلوك

- Be respectful to all contributors / كن محترمًا لجميع المساهمين
- Use constructive language / استخدم لغة بناءة
- Welcome newcomers and help them grow / رحب بالوافدين الجدد وساعدهم على النمو

---

<div align="center">

**Need help? Join our community at [Grovlix.com](https://grovlix.com)**

**تحتاج مساعدة؟ انضم إلى مجتمعنا على [Grovlix.com](https://grovlix.com)**

</div>
