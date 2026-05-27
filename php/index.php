<?php
require_once __DIR__ . '/helper/response.php';

$uri      = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts    = explode('/', trim($uri, '/'));
$resource = $parts[2] ?? '';

match($resource) {
    'diary'  => require __DIR__ . '/endpoints/diary.php',
    'food'   => require __DIR__ . '/endpoints/food.php',
    default  => json_error('Endpoint not found', 404),
};