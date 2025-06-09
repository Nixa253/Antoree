#!/bin/sh

# Chạy passport install
php artisan passport:install --force

# Chạy ứng dụng
php artisan serve --host=0.0.0.0 --port=${PORT:-10000}