import { Player } from './domain/player.entity';
import { PlayerRepositoryPort } from './ports/player-repository.port';
import { ProviderRepositoryPort } from './ports/provider-repository.port';
import { PutPlayersAction } from './put-players.action';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('PutPlayerAction', () => {
  const playersStub: Array<Player> = [
    new Player({
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
      isActive: true,
    }),
    new Player({
      id: '199976',
      name: 'Marco Sportiello',
      position: 'Goalkeeper',
      dateOfBirth: '1992-05-10',
      age: 32,
      nationality: ['Italy'],
      height: 192,
      foot: 'right',
      joinedOn: '2023-07-01',
      signedFrom: 'Atalanta BC',
      contract: '2027-06-30',
      marketValue: 1500000,
      clubId: '5',
      isActive: true,
    }),
  ];
  const getPlayersByClubIdMock = jest.fn().mockResolvedValue([]);

  const providerRepository: ProviderRepositoryPort = {
    getPlayersByClubId: getPlayersByClubIdMock,
    getPlayerActiveStatus: jest.fn(),
  };

  const putPlayersMock = jest.fn().mockResolvedValue({});

  const playerRepository: PlayerRepositoryPort = {
    getPlayers: jest.fn(),
    putPlayers: putPlayersMock,
  };
  const action = new PutPlayersAction(providerRepository, playerRepository);

  beforeEach(() => {
    getPlayersByClubIdMock.mockClear();
    putPlayersMock.mockClear();
  });

  describe('execute', () => {
    it('should retrieve the players information from the provider api', async () => {
      await action.execute('5');
      expect(getPlayersByClubIdMock).toHaveBeenCalledWith('5');
    });

    it('should not update the db when there are no players with the give clubId', async () => {
      await action.execute('5');
      expect(putPlayersMock).not.toHaveBeenCalled();
    });

    it('should put the players in the db when retrived with the give clubId', async () => {
      getPlayersByClubIdMock.mockResolvedValueOnce(playersStub);
      await action.execute('5');
      expect(putPlayersMock).toHaveBeenCalledWith(playersStub);
    });

    it('should return a success true when the players are saved', async () => {
      getPlayersByClubIdMock.mockResolvedValueOnce(playersStub);
      const result = await action.execute('5');

      expect(result).toMatchObject({ success: true });
    });

    it('should return a success true and 0 newPlayers when there are no new players to insert', async () => {
      const result = await action.execute('5');

      expect(result).toMatchObject({
        success: true,
        newPlayers: 0,
      });
    });

    it('should return a success true and the numbers of new players', async () => {
      getPlayersByClubIdMock.mockResolvedValueOnce(playersStub);
      putPlayersMock.mockResolvedValue({
        insertedPlayers: 5,
      });
      const result = await action.execute('5');

      expect(result).toMatchObject({
        success: true,
        newPlayers: 5,
      });
    });

    it('should return a success false and a message when the request to get the players returns an error', async () => {
      getPlayersByClubIdMock.mockRejectedValueOnce(new Error('Error message'));
      const result = await action.execute('5');

      expect(result).toMatchObject({
        success: false,
        message: 'PUT PLAYERS ERROR: Error message',
      });
    });

    it('should return a success false and a message when there is an error during the db write', async () => {
      getPlayersByClubIdMock.mockResolvedValueOnce(playersStub);
      putPlayersMock.mockRejectedValueOnce(new Error('Error message'));
      const result = await action.execute('5');

      expect(result).toMatchObject({
        success: false,
        message: 'PUT PLAYERS ERROR: Error message',
      });
    });
  });
});
