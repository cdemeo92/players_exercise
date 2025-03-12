import { mock } from 'jest-mock-extended';
import { AggregationCursor, Collection, Db, MongoClient } from 'mongodb';
import { Filter } from '../domain/filter.value-object';
import { Pagination } from '../domain/pagination.value-object';
import { Player } from '../domain/player.entity';
import { PlayerRepositoryAdapter } from './player-repository.adapter';

jest.mock('mongodb', () => ({
  ...jest.requireActual('mongodb'),
  MongoClient: {
    connect: jest.fn(),
  },
}));

describe('PlayerRepositoryAdapter', () => {
  const mockAggregateCoursor = mock<AggregationCursor>();
  let repository: PlayerRepositoryAdapter;
  let spyAggregate: jest.SpyInstance;

  beforeEach(async () => {
    const mockDb = mock<Db>();
    const mockCollection = mock<Collection>();

    mockDb.collection.mockReturnValue(mockCollection);
    mockCollection.aggregate.mockReturnValue(mockAggregateCoursor);
    mockAggregateCoursor.toArray.mockResolvedValue([]);

    spyAggregate = jest.spyOn(mockCollection, 'aggregate');

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

      mockAggregateCoursor.toArray.mockResolvedValue([{ players }]);
      const result = await repository.getPlayers();
      expect(result).toEqual(players);
    });

    it.each([
      [
        'position',
        {
          position: 'Goalkeeper',
          isActive: undefined,
          clubId: undefined,
          birthYearRange: undefined,
        },
      ],
      [
        'active status',
        {
          position: undefined,
          isActive: true,
          clubId: undefined,
          birthYearRange: undefined,
        },
      ],
      [
        'club',
        {
          position: undefined,
          isActive: undefined,
          clubId: '5',
          birthYearRange: undefined,
        },
      ],
      [
        'birth year range',
        {
          position: undefined,
          isActive: undefined,
          clubId: undefined,
          birthYearRange: { start: 1992, end: 2000 },
        },
      ],
      [
        'position, active status, club and birth year range',
        {
          position: 'Goalkeeper',
          isActive: true,
          clubId: '5',
          birthYearRange: { start: 1992, end: 2000 },
        },
      ],
    ])('should query the db filtering by %s', async (_, filter) => {
      await repository.getPlayers(
        new Filter(
          filter.position,
          filter.birthYearRange,
          filter.isActive,
          filter.clubId,
        ),
      );
      expect(spyAggregate).toHaveBeenCalledWith(
        expect.arrayContaining([{ $match: filter }]),
      );
    });

    it('should set page to 1 and pageSize to 10 when not provided', async () => {
      await repository.getPlayers();

      expect(spyAggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          {
            $facet: {
              metadata: [{ $count: 'totalCount' }],
              players: [{ $skip: 0 }, { $limit: 10 }],
            },
          },
        ]),
      );
    });

    it.each([
      [0, 0],
      [-1, -1],
    ])(
      'should set page to 1 and pageSize to 10 when they are less then or equal to 0',
      async (page, pageSize) => {
        await repository.getPlayers(undefined, new Pagination(page, pageSize));

        expect(spyAggregate).toHaveBeenCalledWith(
          expect.arrayContaining([
            {
              $facet: {
                metadata: [{ $count: 'totalCount' }],
                players: [{ $skip: 0 }, { $limit: 10 }],
              },
            },
          ]),
        );
      },
    );

    it.each([
      ['page', { page: 2 }],
      ['page size', { pageSize: 200 }],
      ['page and the page size', { page: 2, pageSize: 200 }],
    ])('should select the %s to return', async (_, pagination) => {
      const page = 'page' in pagination ? pagination.page : 1;
      const pageSize = 'pageSize' in pagination ? pagination.pageSize : 10;
      await repository.getPlayers(undefined, new Pagination(page, pageSize));

      expect(spyAggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          {
            $facet: {
              metadata: [{ $count: 'totalCount' }],
              players: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
            },
          },
        ]),
      );
    });
  });
});
