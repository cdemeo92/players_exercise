import { Player } from 'src/domain/player.entity';
import { GetPlayersAction } from './get-players.action';

describe('GetPlayersAction', () => {
  const fakeGetPlayers = jest.fn((): Array<Player> => []);

  const playerRepository = {
    getPlayers: fakeGetPlayers,
  };

  const action = new GetPlayersAction(playerRepository);

  describe('execute', () => {
    it('should return an empty array when the DB is empty', () => {
      const result = action.execute();
      expect(result).toEqual([]);
    });

    it('should return an array with one player when the DB has one player', () => {
      fakeGetPlayers.mockReturnValue([
        {
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
        },
      ]);

      const result = action.execute();
      expect(result).toEqual([
        {
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
        },
      ]);
    });
  });
});
