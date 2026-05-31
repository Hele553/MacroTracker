<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helper/response.php';

header('Content-Type: application/json');

if (empty($_SESSION['user_id'])) {
    json_error('Non autenticato', 401);
}

$method = $_SERVER['REQUEST_METHOD'];
$parts  = explode('/', trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/'));
$action = $parts[3] ?? '';

match(true) {
    $method === 'GET' && $action === 'dailyCalories' => getDailyCalories(),
    default => json_error('Route not found', 404),
};

function getDailyCalories(): void {
    $db   = getDB();
    $stmt = $db->prepare('SELECT daily_calories FROM user WHERE user_id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $row  = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) json_error('Utente non trovato', 404);

    json_ok(['daily_calories' => (int) $row['daily_calories']]);
}