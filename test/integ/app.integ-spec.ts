import { Test, TestingModule } from '@nestjs/testing';
import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { PlayerRepositoryAdapter } from '../../src/adapters/player-repository.adapter';
import { GetPlayersAction } from '../../src/application/get-players.action';
import { AppController } from '../../src/controllers/app.controller';
import { GetPlayersParams } from '../../src/controllers/dto/get-players.dto';
import * as playersStub from './stub/players.stub.json';

jest.setTimeout(30000);

describe('AppController (integ)', () => {
  let appController: AppController;
  let mongodb: MongoMemoryServer;
  let mongoClient: MongoClient;
  let db: Db;

  beforeEach(async () => {
    mongodb = await MongoMemoryServer.create();
    mongoClient = await MongoClient.connect(mongodb.getUri());
    db = mongoClient.db();

    await db.collection('players').insertMany(playersStub);

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        GetPlayersAction,
        {
          provide: 'PlayerRepositoryPort',
          useClass: PlayerRepositoryAdapter,
        },
        {
          provide: 'MONGO_CLIENT',
          useValue: db,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterEach(async () => {
    await mongoClient.close();
    await mongodb.stop();
  });

  describe('/players (GET)', () => {
    it('should return an array of 10 players by default', async () => {
      const response = await appController.getPlayers();

      expect(response.players.length).toBe(10);
    });

    it.each([0, -1])(
      'should return an array of 10 players when the pageSize query is %s',
      async (pageSize) => {
        const response = await appController.getPlayers(
          GetPlayersParams.fromQuery({ pageSize }),
        );

        expect(response.players.length).toBe(10);
      },
    );

    it.each([1, 5, 20])(
      'should return an array of %s players when the pageSize query parameter is provided',
      async (pageSize) => {
        const response = await appController.getPlayers(
          GetPlayersParams.fromQuery({ pageSize }),
        );

        expect(response.players.length).toBe(pageSize);
      },
    );
  });
});
