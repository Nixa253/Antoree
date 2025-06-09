FROM php:8.2-fpm

# Install dependencies and MySQL client
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    default-mysql-client \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# # # Copy wait-for-mysql
# COPY wait-for-mysql.sh /wait-for-mysql.sh
# RUN chmod +x /wait-for-mysql.sh

WORKDIR /var/www

COPY . .

# Install PHP dependencies
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

RUN chmod 600 /var/www/storage/oauth-private.key || true \
    && chmod 600 /var/www/storage/oauth-public.key || true

EXPOSE 9000
CMD sh -c 'php artisan serve --host=0.0.0.0 --port=${PORT:-9000}'

