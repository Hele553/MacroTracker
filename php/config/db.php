<?php
require_once "config.php";

function getDB(): PDO {
    $srv  = $_ENV["IP_SERVER"];
    $db   = $_ENV["DB_NAME"];
    $usr  = $_ENV["USERNAME"];
    $pass = $_ENV["PASSWORD"];
    static $pdo = null;
    if ($pdo) return $pdo;

    $pdo = new PDO("mysql:host=$srv;dbname=$db", $usr, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    return $pdo;
}
