import { Filter } from './domain/filter.value-object';
import { Player, UPDATE_STATUS } from './domain/player.entity';
import { PlayerRepositoryPort } from './ports/player-repository.port';
import { ProviderRepositoryPort } from './ports/provider-repository.port';
import { PutPlayersAction } from './put-players.action';

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
  const getPlayerActiveStatusMock = jest.fn().mockResolvedValue(true);

  const providerRepository: ProviderRepositoryPort = {
    getPlayersByClubId: getPlayersByClubIdMock,
    getPlayerActiveStatus: getPlayerActiveStatusMock,
  };

  const putPlayersMock = jest.fn().mockResolvedValue({});
  const getPlayersMock = jest
    .fn()
    .mockResolvedValue({ players: [], page: 1, pageSize: 10, totalCount: 0 });

  const playerRepository: PlayerRepositoryPort = {
    getPlayers: getPlayersMock,
    putPlayers: putPlayersMock,
  };
  const action = new PutPlayersAction(providerRepository, playerRepository);

  beforeEach(() => {
    getPlayersByClubIdMock.mockClear();
    getPlayerActiveStatusMock.mockClear();
    putPlayersMock.mockClear();
    getPlayersMock.mockClear();
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

    it('should get the players to update from the db when there are no players with the given club id', async () => {
      await action.execute('5');
      expect(getPlayersMock).toHaveBeenCalledWith(
        new Filter({ updateStatus: UPDATE_STATUS.TO_UPDATE }),
      );
    });

    it('should get the players to update from the db when there are players with the given club id', async () => {
      getPlayersByClubIdMock.mockResolvedValueOnce(playersStub);
      await action.execute('5');
      expect(getPlayersMock).toHaveBeenCalledWith(
        new Filter({ updateStatus: UPDATE_STATUS.TO_UPDATE }),
      );
    });

    it('should retrieve the active status from the provider api', async () => {
      getPlayersMock.mockResolvedValueOnce({
        players: playersStub,
      });
      await action.execute('5');

      playersStub.forEach((player) => {
        expect(getPlayerActiveStatusMock).toHaveBeenCalledWith(player.id);
      });
    });

    it('should not retrieve the active status from the provider api when there are no players to update', async () => {
      getPlayersMock.mockResolvedValueOnce({
        players: [],
        page: 1,
        pageSize: 10,
        totalCount: 0,
      });
      await action.execute('5');

      expect(getPlayerActiveStatusMock).not.toHaveBeenCalled();
    });

    it('should update the active status in the db for the players', async () => {
      getPlayersMock.mockResolvedValueOnce({
        players: playersStub,
      });
      await action.execute('5');

      playersStub.forEach((player) => {
        expect(putPlayersMock).toHaveBeenCalledWith([player], true);
      });
    });

    it('should not update the active status in the db for the players when there are no players to update', async () => {
      getPlayersMock.mockResolvedValueOnce({
        players: [],
      });
      await action.execute('5');

      expect(putPlayersMock).not.toHaveBeenCalled();
    });

    it('should return a success true when the players are saved', async () => {
      getPlayersByClubIdMock.mockResolvedValueOnce(playersStub);
      const result = await action.execute('5');

      expect(result).toMatchObject({ success: true });
    });

    it('should return a success true and 0 updatedPlayers when there are no players to update', async () => {
      const result = await action.execute('5');

      expect(result).toMatchObject({
        success: true,
        updatedPlayers: 0,
      });
    });

    it('should return a success true and 0 newPlayers when there are no new players to insert', async () => {
      const result = await action.execute('5');

      expect(result).toMatchObject({
        success: true,
        newPlayers: 0,
      });
    });

    it('should return a success true and the numbers of new and updated players', async () => {
      getPlayersByClubIdMock.mockResolvedValueOnce(playersStub);
      getPlayersMock.mockResolvedValueOnce({ players: playersStub });
      putPlayersMock.mockResolvedValue({
        insertedPlayers: 5,
        modifiedPlayers: 1,
      });
      const result = await action.execute('5');

      expect(result).toMatchObject({
        success: true,
        updatedPlayers: 2,
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
