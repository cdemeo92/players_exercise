import axios from 'axios';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PlayerRepositoryAdapter } from '../../src/adapters/player-repository.adapter';
import { ProviderRepositoryAdapter } from '../../src/adapters/provider-repository.adapter';
import { UpdatePlayersAction } from '../../src/application/update-players.action';
import * as playersStub from '../stub/players.stub.json';
import * as profilesStub from '../stub/profiles.stub.json';

jest.setTimeout(30000);
jest.mock('axios');

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('PutPlayers (Job)', () => {
  let mongodb: MongoMemoryServer;
  let mongoClient: MongoClient;
  let db: Db;

  let action: UpdatePlayersAction;

  (axios.get as jest.Mock).mockImplementation((url: string) => {
    const match = url.match(/\/players\/(\d+)\/profile/);
    if (match) {
      return Promise.resolve({ data: profilesStub[match[1]] });
    }
  });

  beforeEach(async () => {
    mongodb = await MongoMemoryServer.create();
    mongoClient = await MongoClient.connect(mongodb.getUri(), {});
    db = mongoClient.db('players_integ');

    await db.collection('players').insertMany(playersStub);

    action = new UpdatePlayersAction(
      new ProviderRepositoryAdapter('https://transfermarkt-api.fly.dev'),
      new PlayerRepositoryAdapter(mongoClient, 'players_integ', 'players'),
    );
  });

  afterEach(async () => {
    await mongoClient.close();
    await mongodb.stop();
  });

  describe('execute', () => {
    it('should update the players status', async () => {
      expect(await action.execute()).toMatchObject({
        success: true,
        updatedPlayers: 6,
      });
    });

    it('should skip players whose status cannot be found', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: {} });
      expect(await action.execute()).toMatchObject({
        success: true,
        updatedPlayers: 5,
        skipped: ['109855'],
      });
    });
  });
});
