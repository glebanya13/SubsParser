import { loadConfig } from './config/index.js';
import { createClient, ensureAuthorized } from './telegram/client.js';
import { resolveEntity, fetchUsernames } from './telegram/participants.js';
import { saveUsernamesToExcel } from './export/excel.js';

async function main() {
  const config = loadConfig();
  const client = createClient(config.sessionString, config.apiId, config.apiHash);
  await ensureAuthorized(client, Boolean(config.sessionString));

  const entity = await resolveEntity(client, config.target);
  console.log('Resolved target:', entity?.title || entity?.username || config.target);

  const users = await fetchUsernames(client, entity, config.excludedUsernames);
  console.log(`Total users fetched: ${users.length}`);

  // Разделяем пользователей на файлы по 500 записей
  const userChunks = [];
  for (let i = 0; i < users.length; i += config.maxUsersPerFile) {
    userChunks.push(users.slice(i, i + config.maxUsersPerFile));
  }

  console.log(`Splitting into ${userChunks.length} files with max ${config.maxUsersPerFile} users each`);

  // Сохраняем каждый чанк в отдельный файл
  for (let i = 0; i < userChunks.length; i++) {
    const chunk = userChunks[i];
    const fileName = `usernames_part_${i + 1}.xlsx`;
    await saveUsernamesToExcel(chunk, fileName);
    console.log(`Saved ${chunk.length} users to ${fileName}`);
  }

  await client.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


