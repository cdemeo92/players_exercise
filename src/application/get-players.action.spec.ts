import { Player } from 'src/domain/player.entity';
import { GetPlayersAction } from './get-players.action';
import { PlayerRepositoryPort } from './ports/player-repository.port';

describe('GetPlayersAction', () => {
  const getPlayersMock = jest.fn(
    (): Promise<Array<Player>> => Promise.resolve([]),
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
      expect(result).toEqual([]);
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
      getPlayersMock.mockResolvedValueOnce(players);

      const result = await action.execute();
      expect(result).toEqual(players);
    });

    it.each([
      ['position', { position: 'Goalkeeper' }],
      ['active status', { isActive: true }],
      ['club', { clubId: '5' }],
      ['birth year range', { birthYearRange: { start: 1992, end: 2000 } }],
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
      await action.execute(filter);
      expect(getPlayersMock).toHaveBeenCalledWith(filter, undefined);
    });

    it.each([
      ['page', { page: 2 }],
      ['page size', { pageSize: 200 }],
      ['page and the page size', { page: 2, pageSize: 200 }],
    ])('should select the %s to return', async (_, pagination) => {
      await action.execute(undefined, pagination);
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
