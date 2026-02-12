<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
session_start();

require __DIR__ . '/db.php';

$body = json_decode(file_get_contents('php://input'), true) ?: [];
$phone = trim((string)($body['phone'] ?? ''));
$code  = trim((string)($body['code'] ?? ''));

if ($phone === '' || $code === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Нет данных']);
  exit;
}

$st = $pdo->prepare("
  SELECT id, code_hash, expires_at, attempts
  FROM otp_codes
  WHERE phone = ?
  ORDER BY id DESC
  LIMIT 1
");
$st->execute([$phone]);
$row = $st->fetch();

if (!$row) { echo json_encode(['ok'=>false,'error'=>'Код не найден']); exit; }

if ((int)$row['attempts'] >= 5) { echo json_encode(['ok'=>false,'error'=>'Слишком много попыток']); exit; }

if (new DateTimeImmutable($row['expires_at']) < new DateTimeImmutable()) {
  echo json_encode(['ok'=>false,'error'=>'Код истёк']);
  exit;
}

$pdo->prepare("UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?")->execute([$row['id']]);

if (!password_verify($code, $row['code_hash'])) {
  echo json_encode(['ok'=>false,'error'=>'Неверный код']);
  exit;
}

$_SESSION['verified_phone'] = $phone;
echo json_encode(['ok' => true]);
