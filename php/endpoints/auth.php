<?php
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helper/response.php';


header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$parts  = explode('/', trim($uri, '/'));
$action = $parts[3] ?? ''; 

match(true) {
    $method === 'POST' && $action === 'login'    => login(),
    $method === 'POST' && $action === 'logout'   => logout(),
    $method === 'GET'  && $action === 'me'       => me(),
    $method === 'POST' && $action === 'register' => register(),
    default => json_error('Route not found', 404),
};


function login(): void {
    $body = json_decode(file_get_contents('php://input'), true);

    if (empty($body['username']) || empty($body['password'])) {
        json_error('Credenziali mancanti', 400);
    }

    $db   = getDB();
    $stmt = $db->prepare('SELECT * FROM user WHERE username = ? OR email = ?');
    $stmt->execute([$body['username'], $body['username']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($body['password'], $user['password'])) {
        json_error('Credenziali non valide', 401);
    }

    session_regenerate_id(true);
    $_SESSION['user_id']  = $user['user_id'];
    $_SESSION['username'] = $user['username'];

    json_ok(['username' => $user['username']]);
}

function logout(): void {
    session_destroy();
    json_ok(['logged_out' => true]);
}

function me(): void {
    if (empty($_SESSION['user_id'])) {
        json_error('Non autenticato', 401);
    }
    json_ok([
        'user_id'  => $_SESSION['user_id'],
        'username' => $_SESSION['username'],
    ]);
}

function register(): void {
    $body = json_decode(file_get_contents('php://input'), true);

    $fields = ['username', 'email', 'password', 'daily_calories'];
    foreach ($fields as $f) {
        if (empty($body[$f])) json_error("Campo mancante: $f", 400);
    }

    $db = getDB();

    $check = $db->prepare('SELECT user_id FROM user WHERE username = ? OR email = ?');
    $check->execute([$body['username'], $body['email']]);
    if ($check->fetch()) {
        json_error('Username o email già in uso', 409);
    }

    $hash = password_hash($body['password'], PASSWORD_BCRYPT);

    $stmt = $db->prepare('
        INSERT INTO user (username, email, password, daily_calories)
        VALUES (?, ?, ?, ?)
    ');
    $stmt->execute([
        $body['username'],
        $body['email'],
        $hash,
        $body['daily_calories'],
    ]);

    json_ok(['user_id' => $db->lastInsertId()], 201);
}
