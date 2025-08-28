import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import qrcode from 'qrcode-terminal';

export function createClient(sessionString, apiId, apiHash) {
  const session = new StringSession(sessionString || '');
  return new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });
}

export async function ensureAuthorized(client, hasSession) {
  if (hasSession) {
    if (!client.connected) await client.connect();
    return;
  }

  console.log('Нет TG_SESSION. Выполняю вход. Можно сканировать QR или ввести код.');
  await client.start({
    qrCode: (qr) => {
      console.log('Сканируйте QR в Telegram: Настройки → Устройства → Привязать устройство.');
      qrcode.generate(qr, { small: true });
    },
    phoneNumber: async () => {
      process.stdout.write('Введите номер телефона (с кодом страны): ');
      return await new Promise((resolve) => {
        process.stdin.once('data', (d) => resolve(String(d).trim()));
      });
    },
    password: async () => {
      process.stdout.write('Введите пароль 2FA (если включён): ');
      return await new Promise((resolve) => {
        process.stdin.once('data', (d) => resolve(String(d).trim()));
      });
    },
    phoneCode: async () => {
      process.stdout.write('Введите код из Telegram: ');
      return await new Promise((resolve) => {
        process.stdin.once('data', (d) => resolve(String(d).trim()));
      });
    },
    onError: (err) => console.error('Ошибка входа:', err),
  });

  const session = client.session.save();
  console.log('\nВаш TG_SESSION (вставьте в .env → TG_SESSION):');
  console.log(session);
}


