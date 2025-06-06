<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

use App\Models\User;

$users = User::all();

echo "=== DANH SÁCH TÀI KHOẢN ===\n";
foreach ($users as $user) {
    echo "ID: " . $user->id . "\n";
    echo "Name: " . $user->name . "\n";
    echo "Email: " . $user->email . "\n";
    echo "Role: " . $user->role . "\n";
    echo "Created: " . $user->created_at . "\n";
    echo "------------------------\n";
}

echo "Tổng số users: " . $users->count() . "\n";
