<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/db.php';

$body = json_decode(file_get_contents('php://input'), true) ?: [];
$phone = trim((string)($body['phone'] ?? ''));

// Минимальная валидация (лучше приводить к E.164: +7707...)
if ($phone === '' || mb_strlen($phone) < 10) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Неверный номер']);
  exit;
}

$code = (string)random_int(100000, 999999);
$hash = password_hash($code, PASSWORD_DEFAULT);

$expires = (new DateTimeImmutable('+5 minutes'))->format('Y-m-d H:i:s');

$st = $pdo->prepare("INSERT INTO otp_codes (phone, code_hash, expires_at) VALUES (?, ?, ?)");
$st->execute([$phone, $hash, $expires]);

// TODO: здесь отправка SMS провайдером
// send_sms($phone, "Ваш код: $code");

echo json_encode(['ok' => true]);
