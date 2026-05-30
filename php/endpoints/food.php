<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helper/response.php';

if (empty($_SESSION['user_id'])) {
    json_error('Non autenticato', 401);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

$uri   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts = explode('/', trim($uri, '/'));
$id    = isset($parts[2]) && is_numeric($parts[2]) ? (int)$parts[2] : null;

match (true) {
    $method === 'GET' && $id === null => getEntries(),
    default => json_error('Route not found', 404),
};

function getEntries()
{
    $db = getDB();
    $stmt = $db->prepare('
        SELECT *
        FROM food AS f 
    ');
    $stmt->execute();
    json_ok($stmt->fetchAll(PDO::FETCH_ASSOC));
}
