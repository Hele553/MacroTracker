<?php
require_once __DIR__ . '/helper/response.php';

ini_set('session.cookie_samesite', 'Lax');
session_set_cookie_params([
    'lifetime' => 86400,
    'path'     => '/',
    'secure'   => false,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

$uri      = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts    = explode('/', trim($uri, '/'));
$resource = $parts[2] ?? '';

match($resource) {
    'diary'  => require __DIR__ . '/endpoints/diary.php',
    'food'   => require __DIR__ . '/endpoints/food.php',
    'auth'   => require __DIR__ . '/endpoints/auth.php', 
    default  => json_error('Endpoint not found', 404),
};