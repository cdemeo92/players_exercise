import { Filter } from './domain/filter.value-object';
import { Pagination } from './domain/pagination.value-object';
import { Player, UPDATE_STATUS } from './domain/player.entity';
import { PlayerRepositoryPort } from './ports/player-repository.port';
import { ProviderRepositoryPort } from './ports/provider-repository.port';
import { UpdatePlayersAction } from './update-players.action';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('UpdatePlayersAction', () => {
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
  const getPlayerActiveStatusMock = jest.fn().mockResolvedValue(true);

  const providerRepository: ProviderRepositoryPort = {
    getPlayersByClubId: jest.fn(),
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
  const action = new UpdatePlayersAction(providerRepository, playerRepository);

  beforeEach(() => {
    getPlayerActiveStatusMock.mockClear();
    putPlayersMock.mockClear();
    getPlayersMock.mockClear();
  });

  describe('execute', () => {
    it('should get the players to update from the db', async () => {
      await action.execute();
      expect(getPlayersMock).toHaveBeenCalledWith(
        new Filter({ updateStatus: UPDATE_STATUS.TO_UPDATE }),
        new Pagination(undefined, Infinity),
      );
    });

    it('should retrieve the active status from the provider api', async () => {
      getPlayersMock.mockResolvedValueOnce({
        players: playersStub,
      });
      await action.execute();

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
      await action.execute();

      expect(getPlayerActiveStatusMock).not.toHaveBeenCalled();
    });

    it('should update the active status in the db for the players', async () => {
      getPlayersMock.mockResolvedValueOnce({
        players: playersStub,
      });
      await action.execute();

      playersStub.forEach((player) => {
        expect(putPlayersMock).toHaveBeenCalledWith([player], true);
      });
    });

    it('should not update the active status in the db for the players when there are no players to update', async () => {
      getPlayersMock.mockResolvedValueOnce({
        players: [],
      });
      await action.execute();

      expect(putPlayersMock).not.toHaveBeenCalled();
    });

    it('should return a success true when the players are updated', async () => {
      const result = await action.execute();

      expect(result.success).toBeTruthy();
    });

    it('should return a success true and 0 updatedPlayers when there are no players to update', async () => {
      const result = await action.execute();

      expect(result).toMatchObject({
        success: true,
        updatedPlayers: 0,
      });
    });

    it('should return a success true and the numbers of updated players', async () => {
      getPlayersMock.mockResolvedValueOnce({ players: playersStub });
      putPlayersMock.mockResolvedValue({
        insertedPlayers: 5,
        modifiedPlayers: 1,
      });
      const result = await action.execute();

      expect(result).toMatchObject({
        success: true,
        updatedPlayers: 2,
      });
    });

    it('should return success false and a message when there is an error during the players retrieval from the db', async () => {
      getPlayersMock.mockRejectedValueOnce(new Error('Error message'));
      const result = await action.execute();

      expect(result).toMatchObject({
        success: false,
        message: 'UPDATE PLAYERS ERROR: Error message',
      });
    });

    it('should return success true and the array of skipped players id when there is an error during the db write', async () => {
      getPlayersMock.mockResolvedValueOnce({ players: playersStub });
      putPlayersMock.mockRejectedValueOnce(new Error('Error message'));
      const result = await action.execute();

      expect(result).toMatchObject({
        success: true,
        skipped: ['182906'],
      });
    });

    it('should skip players whose status cannot be retrieved', async () => {
      getPlayersMock.mockResolvedValueOnce({ players: playersStub });
      getPlayerActiveStatusMock.mockRejectedValue(new Error('Error message'));
      const result = await action.execute();

      expect(result).toMatchObject({
        success: true,
        skipped: ['182906', '199976'],
      });
    });
  });
});
