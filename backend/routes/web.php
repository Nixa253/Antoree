<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/run-migrate', function () {
    try {
        \Artisan::call('migrate', ['--force' => true]);
        return 'Đã migrate thành công!';
    } catch (\Exception $e) {
        return 'Lỗi: ' . $e->getMessage();
    }
});