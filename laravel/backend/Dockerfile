FROM php:8.2-fpm

# 必要なパッケージインストール
RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install pdo_pgsql pgsql mbstring zip exif pcntl bcmath xml

# Composerインストール
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Laravelの依存をインストール（初回だけ）
# RUN composer install --no-interaction --prefer-dist --optimize-autoloader

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000
