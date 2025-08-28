import { Api } from 'telegram/tl/index.js';

function normalizeTarget(input) {
  let t = input.trim();
  if (t.startsWith('https://t.me/')) t = t.replace('https://t.me/', '');
  if (t.startsWith('http://t.me/')) t = t.replace('http://t.me/', '');
  if (t.startsWith('@')) t = t.slice(1);
  return t;
}

export async function resolveEntity(client, targetStr) {
  const t = normalizeTarget(targetStr);
  try {
    return await client.getEntity(t);
  } catch (e) {
    const r = await client.invoke(new Api.contacts.Search({ q: t, limit: 1 }));
    if (r && r.chats && r.chats.length > 0) return r.chats[0];
    throw new Error(`Cannot resolve target: ${targetStr}`);
  }
}

export async function fetchUsernames(client, entity) {
  const users = [];
  const seen = new Set();
  const seenUsernames = new Set();

  const baseFilters = [
    new Api.ChannelParticipantsSearch({ q: '' }),
    new Api.ChannelParticipantsRecent(),
    new Api.ChannelParticipantsAdmins(),
    new Api.ChannelParticipantsBanned({ q: '' }),
    new Api.ChannelParticipantsKicked({ q: '' }),
  ];

  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789_'.split('');
  const cyrillic = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'.split('');
  const commonPatterns = ['user', 'admin', 'moder', 'test', 'demo', 'info', 'support', 'help', 'news', 'media'];

  async function runPaged(filter) {
    let offset = 0;
    const limit = 200;
    while (true) {
      let result;
      try {
        result = await client.invoke(new Api.channels.GetParticipants({ channel: entity, filter, offset, limit, hash: 0 }));
      } catch (e) {
        if (e.errorMessage && e.errorMessage.startsWith('FLOOD_WAIT_')) {
          const seconds = Number(e.errorMessage.split('_').pop()) || 30;
          await new Promise((r) => setTimeout(r, seconds * 1000));
          continue;
        }
        break;
      }
      const batch = result?.users ?? [];
      if (batch.length === 0) break;
      for (const u of batch) {
        if (!seen.has(u.id) && u.username && !seenUsernames.has(u.username)) {
          seen.add(u.id);
          seenUsernames.add(u.username);
          users.push(u);
        }
      }
      offset += batch.length;
      if (batch.length < limit) break;
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  for (const f of baseFilters) await runPaged(f);
  for (const letter of alphabet) await runPaged(new Api.ChannelParticipantsSearch({ q: letter }));
  for (const letter of cyrillic) await runPaged(new Api.ChannelParticipantsSearch({ q: letter }));
  for (const pattern of commonPatterns) await runPaged(new Api.ChannelParticipantsSearch({ q: pattern }));

  return users;
}


