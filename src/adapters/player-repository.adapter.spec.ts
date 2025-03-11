import { MongoClient } from 'mongodb';
import { PlayerRepositoryAdapter } from './player-repository.adapter';

jest.mock('mongodb', () => ({
  ...jest.requireActual('mongodb'),
  MongoClient: {
    connect: jest.fn().mockResolvedValue({
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          find: jest.fn().mockReturnValue({
            toArray: jest.fn(
              async (): Promise<Array<unknown>> => Promise.resolve([]),
            ),
          }),
        }),
      }),
    }),
  },
}));

describe('PlayerRepositoryAdapter', () => {
  let repository: PlayerRepositoryAdapter;

  beforeEach(async () => {
    const client = await MongoClient.connect('mongodb://mock-uri');
    const db = client.db();
    repository = new PlayerRepositoryAdapter(db);
  });

  describe('getPlayers', () => {
    it('should return an empty array when there are no player', async () => {
      expect(await repository.getPlayers()).toEqual([]);
    });
  });
});
