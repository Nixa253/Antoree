#!/bin/sh

echo "⏳ Waiting for MySQL to be ready..."

while ! mysqladmin ping -h"$DB_HOST" --silent; do
  sleep 1
done

echo "✅ MySQL is ready. Starting Laravel..."

# Thêm dòng này trước khi chạy server
php artisan migrate --force
php artisan passport:install --force

exec "$@"
