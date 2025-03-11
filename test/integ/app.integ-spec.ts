import { Test, TestingModule } from '@nestjs/testing';
import { GetPlayersAction } from '../../src/application/get-players.action';
import { AppController } from '../../src/controllers/app.controller';

describe('AppController (integ)', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        GetPlayersAction,
        {
          provide: 'PlayerRepositoryPort',
          useValue: { getPlayers: getPlayersActionExecuteMock },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });
});
