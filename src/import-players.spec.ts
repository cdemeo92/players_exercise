import { Filter } from './application/domain/filter.value-object';
import { Pagination } from './application/domain/pagination.value-object';
import { Player, UPDATE_STATUS } from './application/domain/player.entity';
import { PlayerRepositoryPort } from './application/ports/player-repository.port';
import { ProviderRepositoryPort } from './application/ports/provider-repository.port';
import { ImportPlayers } from './import-players';

jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('ImportPlayers', () => {
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
  const importPlayers = new ImportPlayers(providerRepository, playerRepository);

  beforeEach(() => {
    getPlayersByClubIdMock.mockClear();
    getPlayerActiveStatusMock.mockClear();
    putPlayersMock.mockClear();
    getPlayersMock.mockClear();
  });
  describe('importPlayersById', () => {
    it('should retrieve the players information from the provider api', async () => {
      await importPlayers.importPlayersById('5');
      expect(getPlayersByClubIdMock).toHaveBeenCalledWith('5');
    });

    it('should not update the db when there are no players with the give clubId', async () => {
      await importPlayers.importPlayersById('5');
      expect(putPlayersMock).not.toHaveBeenCalled();
    });

    it('should put the players in the db when retrived with the give clubId', async () => {
      getPlayersByClubIdMock.mockResolvedValueOnce(playersStub);
      await importPlayers.importPlayersById('5');
      expect(putPlayersMock).toHaveBeenCalledWith(playersStub);
    });

    it('should get the players to update from the db when there are no players with the given club id', async () => {
      await importPlayers.importPlayersById('5');
      expect(getPlayersMock).toHaveBeenCalledWith(
        new Filter({ updateStatus: UPDATE_STATUS.TO_UPDATE }),
        new Pagination(undefined, Infinity),
      );
    });

    it('should get the players to update from the db when there are players with the given club id', async () => {
      getPlayersByClubIdMock.mockResolvedValueOnce(playersStub);
      await importPlayers.importPlayersById('5');
      expect(getPlayersMock).toHaveBeenCalledWith(
        new Filter({ updateStatus: UPDATE_STATUS.TO_UPDATE }),
        new Pagination(undefined, Infinity),
      );
    });

    it('should retrieve the active status from the provider api', async () => {
      getPlayersMock.mockResolvedValueOnce({
        players: playersStub,
      });
      await importPlayers.importPlayersById('5');

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
      await importPlayers.importPlayersById('5');

      expect(getPlayerActiveStatusMock).not.toHaveBeenCalled();
    });

    it('should update the active status in the db for the players', async () => {
      getPlayersMock.mockResolvedValueOnce({
        players: playersStub,
      });
      await importPlayers.importPlayersById('5');

      playersStub.forEach((player) => {
        expect(putPlayersMock).toHaveBeenCalledWith([player], true);
      });
    });

    it('should not update the active status in the db for the players when there are no players to update', async () => {
      getPlayersMock.mockResolvedValueOnce({
        players: [],
      });
      await importPlayers.importPlayersById('5');

      expect(putPlayersMock).not.toHaveBeenCalled();
    });

    it('should log the new players to insert', async () => {
      getPlayersByClubIdMock.mockResolvedValueOnce(playersStub);
      putPlayersMock.mockResolvedValue({ insertedPlayers: 5 });
      const spyLog = jest.spyOn(console, 'log');
      await importPlayers.importPlayersById('5');

      expect(spyLog).toHaveBeenCalledWith('Found 5 new players');
    });

    it('should log the imported players', async () => {
      getPlayersMock.mockResolvedValueOnce({
        players: playersStub,
      });
      putPlayersMock.mockResolvedValue({
        modifiedPlayers: 1,
      });
      const spyLog = jest.spyOn(console, 'log');
      await importPlayers.importPlayersById('5');

      expect(spyLog).toHaveBeenCalledWith('2 players imported');
    });

    it('should log a warning when there is an error during the club fatching', async () => {
      getPlayersByClubIdMock.mockRejectedValueOnce(new Error('Error message'));
      const spyWarn = jest.spyOn(console, 'warn');
      await importPlayers.importPlayersById('5');

      expect(spyWarn).toHaveBeenCalledWith(
        'Got an error during the players fatching:',
        'PUT PLAYERS ERROR: Error message',
      );
    });

    it('should log an error when there is an error during the players import', async () => {
      getPlayersMock.mockRejectedValueOnce(new Error('Error message'));
      const spyError = jest.spyOn(console, 'error');
      await importPlayers.importPlayersById('5');

      expect(spyError).toHaveBeenCalledWith(
        'Got an error during the players import:',
        'UPDATE PLAYERS ERROR: Error message',
      );
    });
  });
});
