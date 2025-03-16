import axios from 'axios';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PlayerRepositoryAdapter } from '../../src/adapters/player-repository.adapter';
import { ProviderRepositoryAdapter } from '../../src/adapters/provider-repository.adapter';
import { ImportPlayers } from '../../src/import-players';
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

describe('ImportPlayers (Job)', () => {
  let mongodb: MongoMemoryServer;
  let mongoClient: MongoClient;
  let db: Db;

  let importPlayers: ImportPlayers;

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

    importPlayers = new ImportPlayers(
      new ProviderRepositoryAdapter('https://transfermarkt-api.fly.dev'),
      new PlayerRepositoryAdapter(mongoClient, 'players_integ', 'players'),
    );
  });

  afterEach(async () => {
    await mongoClient.close();
    await mongodb.stop();
  });

  describe('importPlayersById', () => {
    it('should save the new players', async () => {
      expect(await db.collection('players').countDocuments()).toBe(0);
      await importPlayers.importPlayersById('5');
      expect(await db.collection('players').countDocuments()).toBe(5);
    });

    it('should update the players whose status was not updated last run', async () => {
      await db.collection('players').insertMany(playersStub);
      await importPlayers.importPlayersById('5');
      expect(await db.collection('players').countDocuments()).toBe(55);
    });
  });
});
