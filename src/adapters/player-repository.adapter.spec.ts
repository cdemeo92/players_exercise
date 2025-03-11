import { mock } from 'jest-mock-extended';
import { Collection, Db, FindCursor, MongoClient } from 'mongodb';
import { Player } from '../domain/player.entity';
import { PlayerRepositoryAdapter } from './player-repository.adapter';

jest.mock('mongodb', () => ({
  ...jest.requireActual('mongodb'),
  MongoClient: {
    connect: jest.fn(),
  },
}));

describe('PlayerRepositoryAdapter', () => {
  let repository: PlayerRepositoryAdapter;
  const mockFindToArray = jest.fn(
    (): Promise<Array<Player>> => Promise.resolve([]),
  );

  beforeEach(async () => {
    const mockDb = mock<Db>();
    const mockCollection = mock<Collection>();

    mockDb.collection.mockReturnValue(mockCollection);

    mockCollection.find.mockReturnValue({
      toArray: mockFindToArray,
    } as unknown as FindCursor<Document>);

    (MongoClient.connect as jest.Mock).mockResolvedValue({
      db: () => mockDb,
    });

    const client = await MongoClient.connect('mongodb://mock-uri');
    const db = client.db();
    repository = new PlayerRepositoryAdapter(db);
  });

  describe('getPlayers', () => {
    it('should return an empty array when the DB is empty', async () => {
      expect(await repository.getPlayers()).toEqual([]);
    });

    it('should return an array of players when the DB is not empty', async () => {
      const players = Array<Player>(30).fill({
        id: '182906',
        name: 'Mike Maignan',
        position: 'Goalkeeper',
        dateOfBirth: '1995-07-03',
        age: 29,
        nationality: ['France', 'French Guiana'],
        height: 191,
        foot: 'right',
        joinedOn: '2021-07-01',
        signedFrom: 'LOSC Lille',
        contract: '2026-06-30',
        marketValue: 35000000,
        status: 'Team captain',
        clubId: '5',
        isActive: false,
      });

      mockFindToArray.mockResolvedValue(players);
      const result = await repository.getPlayers();
      expect(result).toEqual(players);
    });
  });
});
