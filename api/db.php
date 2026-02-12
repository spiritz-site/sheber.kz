<?php
declare(strict_types=1);

$DB_HOST = 'sql203.infinityfree.com';
$DB_PORT = 3306;
$DB_NAME = 'if0_41120711_sheber';
$DB_USER = 'if0_41120711';
$DB_PASS = 'flyLIyFGe4D9'; // password

$dsn = "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME;charset=utf8mb4";
$pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
