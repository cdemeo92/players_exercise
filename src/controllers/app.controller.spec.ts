import { Test, TestingModule } from '@nestjs/testing';
import { Player } from 'src/domain/player.entity';
import { GetPlayersAction } from '../application/get-players.action';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;
  const getPlayersActionMock = jest.fn((): Player[] => []);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        GetPlayersAction,
        {
          provide: GetPlayersAction,
          useValue: { execute: getPlayersActionMock },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getPlayers', () => {
    it('should return an array with of players in the response', () => {
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

      getPlayersActionMock.mockReturnValueOnce(players);
      expect(appController.getPlayers()).toEqual(
        expect.objectContaining({ players }),
      );
    });
  });
});
