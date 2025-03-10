import { Player } from 'src/domain/player.entity';
import { GetPlayersAction } from './get-players.action';

describe('GetPlayersAction', () => {
  const getPlayersStub = jest.fn((): Array<Player> => []);

  const playerRepositoryStub = {
    getPlayers: getPlayersStub,
  };

  const action = new GetPlayersAction(playerRepositoryStub);

  describe('execute', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an empty array when the DB is empty', () => {
      const result = action.execute();
      expect(result).toEqual([]);
    });

    it('should return an array with of players when the DB is not empty', () => {
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
      getPlayersStub.mockReturnValueOnce(players);

      const result = action.execute();
      expect(result).toEqual(players);
    });

    //TODO: convert into integration test
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
    ])('should query the db filtering by %s', (_, filter) => {
      action.execute(filter);
      expect(getPlayersStub).toHaveBeenCalledWith(filter, undefined);
    });

    //TODO: convert into integration test
    it.each([
      ['page', { page: 2 }],
      ['page size', { pageSize: 200 }],
      ['page and the page size', { page: 2, pageSize: 200 }],
    ])('should select the %s to return', (_, pagination) => {
      action.execute(undefined, pagination);
      expect(getPlayersStub).toHaveBeenCalledWith(undefined, pagination);
    });

    it('should throw an exception when the repository throws an exception', () => {
      getPlayersStub.mockImplementationOnce(() => {
        throw new Error('Error');
      });

      expect(() => action.execute()).toThrow(
        'An error occurred while fetching players: Error',
      );
    });
  });
});
