import axios from 'axios';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PlayerRepositoryAdapter } from '../../src/adapters/player-repository.adapter';
import { ProviderRepositoryAdapter } from '../../src/adapters/provider-repository.adapter';
import { PutPlayersAction } from '../../src/application/put-players.action';
import * as clubStub from '../stub/club.stub.json';
import * as playersStub from '../stub/players.stub.json';
import * as profilesStub from '../stub/profiles.stub.json';

jest.setTimeout(30000);
jest.mock('axios');

jest.spyOn(console, 'log').mockImplementation(() => {});

const mockGetPayersByClub = (url: string) => {
  const match = url.match(/\/clubs\/(\d+)\/players/);

  if (match) {
    return Promise.resolve({ data: clubStub[match[1]] });
  }
};

const mockGetPayerProfile = (url: string) => {
  const match = url.match(/\/players\/(\d+)\/profile/);
  if (match) {
    return Promise.resolve({ data: profilesStub[match[1]] });
  }
};

describe('PutPlayers (Job)', () => {
  let mongodb: MongoMemoryServer;
  let mongoClient: MongoClient;
  let db: Db;

  let action: PutPlayersAction;

  (axios.get as jest.Mock).mockImplementation((url: string) => {
    if (url.includes('clubs')) {
      return mockGetPayersByClub(url);
    }
    if (url.includes('profile')) {
      return mockGetPayerProfile(url);
    }
  });

  beforeEach(async () => {
    mongodb = await MongoMemoryServer.create();
    mongoClient = await MongoClient.connect(mongodb.getUri(), {});
    db = mongoClient.db('players_integ');

    await db.collection('players').insertMany(playersStub);

    action = new PutPlayersAction(
      new ProviderRepositoryAdapter('https://transfermarkt-api.fly.dev'),
      new PlayerRepositoryAdapter(mongoClient, 'players_integ', 'players'),
    );
  });

  afterEach(async () => {
    await mongoClient.close();
    await mongodb.stop();
  });

  describe('execute', () => {
    it('should save the new players', async () => {
      await db.dropCollection('players');
      expect(await action.execute('5')).toMatchObject({
        success: true,
        newPlayers: 5,
        updatedPlayers: 5,
      });
    });

    it('should update the players whose status was not updated last run', async () => {
      expect(await action.execute('5')).toMatchObject({
        success: true,
        updatedPlayers: 10,
        newPlayers: 0,
      });
    });

    it('should update the players whose status was not updated last run', async () => {
      expect(await action.execute('6')).toMatchObject({
        success: true,
        updatedPlayers: 7,
        newPlayers: 4,
        skipped: ['458173', '1169004', '50483'],
      });
    });
  });
});
