import 'dotenv/config';

export function loadConfig() {
  const apiId = Number(process.env.TG_API_ID || 0);
  const apiHash = process.env.TG_API_HASH || '';
  const sessionString = process.env.TG_SESSION || '';
  const target = process.env.TG_TARGET || 'https://t.me/suetanawb';
  const output = process.env.OUTPUT_FILE || 'usernames.xlsx';
  const maxUsersPerFile = parseInt(process.env.MAX_USERS_PER_FILE) || 500;
  const excludedUsernames = process.env.EXCLUDED_USERNAMES?.split(',').map(u => u.trim()) || ['@arli_96', '@ir_ka1710'];

  if (!apiId || !apiHash) {
    throw new Error('Please set TG_API_ID and TG_API_HASH in .env');
  }

  return {
    apiId,
    apiHash,
    sessionString,
    target,
    output,
    maxUsersPerFile,
    excludedUsernames,
  };
}


