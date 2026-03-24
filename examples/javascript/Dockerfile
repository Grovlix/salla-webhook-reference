# Node.js Dockerfile for Salla/Zid Webhook Handler
# Dockerfile لمعالج الويب هوك بـ Node.js

FROM node:18-alpine

# Set working directory
# تعيين دليل العمل
WORKDIR /app

# Copy package files
# نسخ ملفات الحزمة
COPY package*.json ./

# Install dependencies
# تثبيت التبعيات
RUN npm ci --only=production

# Copy application files
# نسخ ملفات التطبيق
COPY . .

# Create non-root user
# إنشاء مستخدم غير جذري
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
# التبديل إلى مستخدم غير جذري
USER nodejs

# Expose port
# كشف المنفذ
EXPOSE 3000

# Start application
# بدء التطبيق
CMD ["node", "server.js"]
