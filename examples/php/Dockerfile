# PHP Dockerfile for Salla/Zid Webhook Handler
# Dockerfile لمعالج الويب هوك بـ PHP

FROM php:8.2-fpm-alpine

# Install system dependencies
# تثبيت التبعيات النظامية
RUN apk add --no-cache \
    nginx \
    curl \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install zip

# Install Composer
# تثبيت Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
# تعيين دليل العمل
WORKDIR /var/www/html

# Copy application files
# نسخ ملفات التطبيق
COPY . .

# Install PHP dependencies
# تثبيت تبعيات PHP
RUN composer install --no-dev --optimize-autoloader

# Set permissions
# تعيين الأذونات
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Copy nginx configuration
# نسخ تكوين nginx
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    index index.php;
    root /var/www/html/public;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
        include fastcgi_params;
    }
}
EOF

# Expose port
# كشف المنفذ
EXPOSE 80

# Start services
# بدء الخدمات
CMD php-fpm -D && nginx -g 'daemon off;'
