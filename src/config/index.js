import 'dotenv/config';

export function loadConfig() {
  const apiId = Number(process.env.TG_API_ID || 0);
  const apiHash = process.env.TG_API_HASH || '';
  const sessionString = process.env.TG_SESSION || '';
  const target = process.env.TG_TARGET || '';
  const output = process.env.OUTPUT_FILE || 'usernames.xlsx';

  if (!apiId || !apiHash) {
    throw new Error('Please set TG_API_ID and TG_API_HASH in .env');
  }
  if (!target) {
    throw new Error('Please set TG_TARGET in .env to the channel/group username or t.me link');
  }

  return {
    apiId,
    apiHash,
    sessionString,
    target,
    output,
  };
}


