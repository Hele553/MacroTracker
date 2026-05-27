<?php
function json_ok(mixed $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode(['data' => $data]);
    exit;
}

function json_error(string $message, int $status = 400): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode(['error' => $message]);
    exit;
}