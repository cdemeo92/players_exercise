import { MongoClient } from 'mongodb';
import { PlayerRepositoryAdapter } from './adapters/player-repository.adapter';
import { ProviderRepositoryAdapter } from './adapters/provider-repository.adapter';
import config from './configuration';
import { ImportPlayers } from './import-players';

async function start(clubId: string) {
  const username = config().dbUser;
  const password = config().dbPassword;
  const host = config().dbHost;
  const port = config().dbPort;
  const dbUri = config().dbUri;
  const client = new MongoClient(
    dbUri ?? `mongodb://${username}:${password}@${host}:${port}`,
  );

  const providerRepository = new ProviderRepositoryAdapter(
    config().providerDomain,
  );
  const playerRepository = new PlayerRepositoryAdapter(
    await client.connect(),
    config().dbName,
    config().collectionName,
  );

  await new ImportPlayers(
    providerRepository,
    playerRepository,
  ).importPlayersById(clubId);
}

start(process.argv[2]).catch((err) => console.error(err));
