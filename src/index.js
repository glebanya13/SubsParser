import { loadConfig } from './config/index.js';
import { createClient, ensureAuthorized } from './telegram/client.js';
import { resolveEntity, fetchUsernames } from './telegram/participants.js';
import { saveUsernamesToExcel } from './export/excel.js';

async function main() {
  const { apiId, apiHash, sessionString, target, output } = loadConfig();
  const client = createClient(sessionString, apiId, apiHash);
  await ensureAuthorized(client, Boolean(sessionString));

  const entity = await resolveEntity(client, target);
  console.log('Resolved target:', entity?.title || entity?.username || target);

  const users = await fetchUsernames(client, entity);
  console.log(`Total users fetched: ${users.length}`);

  await saveUsernamesToExcel(users, output);
  console.log(`Saved to ${output}`);

  await client.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


