import { Filter } from '../domain/filter.value-object';
import { Pagination } from '../domain/pagination.value-object';
import { Player } from '../domain/player.entity';
import { GetPlayersAction } from './get-players.action';
import {
  GetPlayersResult,
  PlayerRepositoryPort,
} from './ports/player-repository.port';

describe('GetPlayersAction', () => {
  const getPlayersMock = jest.fn(
    (): Promise<GetPlayersResult> =>
      Promise.resolve({ players: [], page: 1, pageSize: 10, totalCount: 0 }),
  );

  const playerRepository: PlayerRepositoryPort = {
    getPlayers: getPlayersMock,
  };

  const action = new GetPlayersAction(playerRepository);

  describe('execute', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an empty array when the DB is empty', async () => {
      const result = await action.execute();
      expect(result).toEqual({
        players: [],
        page: 1,
        pageSize: 10,
        totalCount: 0,
      });
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
      getPlayersMock.mockResolvedValueOnce({
        players,
        page: 1,
        pageSize: 30,
        totalCount: 30,
      });

      const result = await action.execute();
      expect(result).toEqual({
        players,
        page: 1,
        pageSize: 30,
        totalCount: 30,
      });
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
      await action.execute(
        new Filter(
          filter.position,
          filter.birthYearRange,
          filter.isActive,
          filter.clubId,
        ),
      );
      expect(getPlayersMock).toHaveBeenCalledWith(filter, undefined);
    });

    it.each([
      ['page', { page: 2 }],
      ['page size', { pageSize: 200 }],
      ['page and the page size', { page: 2, pageSize: 200 }],
    ])('should select the %s to return', async (_, pagination) => {
      const page = 'page' in pagination ? pagination.page : undefined;
      const pageSize =
        'pageSize' in pagination ? pagination.pageSize : undefined;
      await action.execute(undefined, new Pagination(page, pageSize));
      expect(getPlayersMock).toHaveBeenCalledWith(undefined, pagination);
    });

    it('should throw an exception when an error occour', async () => {
      getPlayersMock.mockImplementationOnce(() => {
        throw new Error('Error');
      });

      await expect(async () => await action.execute()).rejects.toThrow(
        'An error occurred while fetching players: Error',
      );
    });
  });
});
