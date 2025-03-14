import { MongoClient } from 'mongodb';
import { PlayerRepositoryAdapter } from './adapters/player-repository.adapter';
import { ProviderRepositoryAdapter } from './adapters/provider-repository.adapter';
import { PutPlayersAction } from './application/put-players.action';
import config from './configuration';

export class PutPlayersJob {
  public async putPlayersById(clubId: string): Promise<void> {
    const action = await this.buildAction();

    const result = await action.execute(clubId);
    console.log(result);
  }

  private async buildAction(): Promise<PutPlayersAction> {
    return new PutPlayersAction(
      new ProviderRepositoryAdapter(config().providerDomain),
      new PlayerRepositoryAdapter(
        await this.buildMongoDbClient(),
        config().dbName,
        config().collectionName,
      ),
    );
  }

  private async buildMongoDbClient(): Promise<MongoClient> {
    const username = config().dbUser;
    const password = config().dbPassword;
    const host = config().dbHost;
    const port = config().dbPort;
    const client = new MongoClient(
      `mongodb://${username}:${password}@${host}:${port}`,
    );
    return client.connect();
  }
}

new PutPlayersJob()
  .putPlayersById(process.argv[2])
  .catch((err) => console.error(err));
