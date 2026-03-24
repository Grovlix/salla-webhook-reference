/**
 * Express Server Setup for Webhook Handling
 * إعداد خادم Express لمعالجة الويب هوك
 *
 * This file sets up the Express server with webhook handlers
 * يقوم هذا الملف بإعداد خادم Express مع معالجات الويب هوك
 */

require('dotenv').config();
const express = require('express');
const webhookRouter = require('./express-webhook-handler');

const app = express();
const PORT = process.env.PORT || 3000;

// Request logging middleware
// برمجية لتسجيل الطلبات
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Trust proxy for getting correct client IP behind load balancer
// الوثوق بالوكيل للحصول على عنوان IP الصحيح خلف موازن التحميل
app.set('trust proxy', true);

// Mount webhook router
// تثبيت موجه الويب هوك
app.use('/', webhookRouter);

// Root endpoint
// نقطة النهاية الجذرية
app.get('/', (req, res) => {
  res.json({
    service: 'Salla/Zid Webhook Handler',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      webhooks: '/webhooks',
      webhooksSalla: '/webhooks/salla',
      webhooksZid: '/webhooks/zid',
      health: '/webhooks/health'
    }
  });
});

// 404 handler
// معالج 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'النقطة المطلوبة غير موجودة'
  });
});

// Error handler
// معالج الأخطاء
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: 'خطأ في الخادم الداخلي'
  });
});

// Start server
// بدء الخادم
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/webhooks/health`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhooks`);
});

// Graceful shutdown
// إيقاف تشغيل أنيق
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;
