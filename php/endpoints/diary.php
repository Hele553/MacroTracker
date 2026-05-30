<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helper/response.php';

if (empty($_SESSION['user_id'])) {
    json_error('Non autenticato', 401);
    exit;
}

header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];

$uri   = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts = explode('/', trim($uri, '/'));
$id    = isset($parts[3]) && is_numeric($parts[3]) ? (int)$parts[3] : null;

if ($method === 'GET' && $id === null) {
    getEntries();
} elseif ($method === 'POST' && $id === null) {
    addEntry();
} elseif ($method === 'PUT' && $id !== null) {
    updateEntry($id);
} elseif ($method === 'DELETE' && $id !== null) {
    removeEntry($id);
} else {
    json_error('Route not found', 404);
}


function getEntries(): void
{
    $userId = $_SESSION['user_id'];
    $date   = $_GET['date'] ?? null;

    if (!$userId || !$date) {
        json_error('Parameters user and date are required');
    }

    $db   = getDB();
    $stmt = $db->prepare('
        SELECT e.entry_id, e.weight_grams, e.meal, e.date,
               f.food_id, f.name, f.calories, f.carbs, f.protein, f.fat
        FROM   diary_entry e
        JOIN   food f ON f.food_id = e.food_id
        WHERE  e.user_id = ? AND e.date = ?
        ORDER BY e.meal, e.created_at
    ');
    $stmt->execute([$userId, $date]);
    json_ok($stmt->fetchAll(PDO::FETCH_ASSOC));
}


function addEntry(): void
{
    $body   = json_decode(file_get_contents('php://input'), true);
    $fields = ['food_id', 'weight_grams', 'date', 'meal'];

    foreach ($fields as $field) {
        if (empty($body[$field])) {
            json_error("Missing required field: $field");
        }
    }

    $validMeals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    if (!in_array($body['meal'], $validMeals)) {
        json_error('Invalid meal value');
    }

    $db = getDB();

    $check = $db->prepare('SELECT food_id FROM food WHERE food_id = ?');
    $check->execute([$body['food_id']]);
    if (!$check->fetch()) {
        json_error('Food not found', 404);
    }

    $dayStmt = $db->prepare('INSERT IGNORE INTO day (date, user_id) VALUES (?, ?)');
    $dayStmt->execute([$body['date'], $_SESSION['user_id']]);

    $stmt = $db->prepare('
        INSERT INTO diary_entry (food_id, weight_grams, meal, date, user_id, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    ');
    $stmt->execute([
        $body['food_id'],
        $body['weight_grams'],
        $body['meal'],
        $body['date'],
        $_SESSION['user_id'],
    ]);

    json_ok(['entry_id' => $db->lastInsertId()], 201);
}


function updateEntry(int $id): void
{
    $body = json_decode(file_get_contents('php://input'), true);

    $fields = ['food_id', 'weight_grams', 'date', 'meal'];
    foreach ($fields as $field) {
        if (empty($body[$field])) {
            json_error("Missing required field: $field");
        }
    }

    $validMeals = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    if (!in_array($body['meal'], $validMeals)) {
        json_error('Invalid meal value');
    }

    $db   = getDB();
    $stmt = $db->prepare('
        UPDATE diary_entry
        SET food_id = ?, weight_grams = ?, date = ?, meal = ?
        WHERE entry_id = ?
    ');
    $stmt->execute([
        $body['food_id'],
        $body['weight_grams'],
        $body['date'],
        $body['meal'],
        $id,
    ]);

    if ($stmt->rowCount() === 0) {
        json_error('Entry not found', 404);
    }

    json_ok(['updated' => $id]);
}

function removeEntry(int $id): void
{
    $db   = getDB();
    $stmt = $db->prepare('DELETE FROM diary_entry WHERE entry_id = ?');
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        json_error('Entry not found', 404);
    }

    json_ok(['deleted' => $id]);
}