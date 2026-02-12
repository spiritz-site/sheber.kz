function mobizon_send_sms(string $apiKey, string $recipient, string $text, ?string $from = null): array {
  $url = 'https://api.mobizon.kz/service/message/sendsmsmessage';

  $payload = [
    'apiKey'     => $apiKey,
    'api'        => 'v1',
    'output'     => 'json',
    'recipient'  => $recipient,
    'text'       => $text,
  ];
  if ($from) $payload['from'] = $from; // можно не указывать — будет общая/дефолтная подпись

  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
  ]);
  $raw = curl_exec($ch);
  $err = curl_error($ch);
  curl_close($ch);

  if ($raw === false) return ['ok' => false, 'error' => $err ?: 'curl error'];

  $json = json_decode($raw, true);
  if (!is_array($json)) return ['ok' => false, 'error' => 'bad json', 'raw' => $raw];

  // В ответе есть поле code: 0 = успех, иначе ошибка (и часто message/data). :contentReference[oaicite:6]{index=6}
  if (($json['code'] ?? null) !== 0) {
    return ['ok' => false, 'error' => $json['message'] ?? 'api error', 'resp' => $json];
  }

  return ['ok' => true, 'resp' => $json];
}
