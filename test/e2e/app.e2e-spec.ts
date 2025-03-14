import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoClient } from 'mongodb';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { PlayerRepositoryAdapter } from '../../src/adapters/player-repository.adapter';
import { ProviderRepositoryAdapter } from '../../src/adapters/provider-repository.adapter';
import { appBuilder, AppModule } from '../../src/app.module';
import { PutPlayersAction } from '../../src/application/put-players.action';
import config from '../../src/configuration';
import { GetPlayersResponse } from '../../src/controllers/dto/get-players.dto';

jest.setTimeout(30000);

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let mongoClient: MongoClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = appBuilder(
      moduleFixture.createNestApplication(),
    ) as INestApplication<App>;

    mongoClient = app.get<MongoClient>('MONGO_CLIENT');

    await app.init();

    const putPlayersAction = new PutPlayersAction(
      new ProviderRepositoryAdapter(config().providerDomain),
      new PlayerRepositoryAdapter(mongoClient, 'players_e2e', 'players'),
    );

    await putPlayersAction.execute('1');
    await putPlayersAction.execute('5');
    await putPlayersAction.execute('6');
  });

  afterAll(async () => {
    await mongoClient.close();
    await app.close();
  });

  describe('/players (GET)', () => {
    it('should return an array of 10 players by default', async () => {
      return request(app.getHttpServer())
        .get('/players')
        .expect(200)
        .expect((res: { body: GetPlayersResponse }) => {
          expect(res.body.players.length).toBe(10);
          expect(res.body.pageSize).toBe(10);
          expect(res.body.page).toBe(1);
          expect(res.body.totalCount).toEqual(expect.any(Number));
        });
    });

    it('should return the required page', async () => {
      return request(app.getHttpServer())
        .get('/players?page=3')
        .expect(200)
        .expect((res: { body: GetPlayersResponse }) => {
          expect(res.body.page).toBe(3);
        });
    });

    it('should return the required amount of players per page', async () => {
      return request(app.getHttpServer())
        .get('/players?pageSize=30')
        .expect(200)
        .expect((res: { body: GetPlayersResponse }) => {
          expect(res.body.players.length).toBe(30);
        });
    });

    it('should filter the players by position, active status, club id and birth year range', () => {
      return request(app.getHttpServer())
        .get(
          '/players?position=Goalkeeper&birthYearRange=1992-2000&isActive=true&clubId=5',
        )
        .expect(200)
        .expect((res: { body: GetPlayersResponse }) => {
          expect(res.body.players.length).toBeGreaterThan(0);
          res.body.players.forEach((p) => {
            expect(p.position).toBe('Goalkeeper');
            expect(p.isActive).toBe(true);
            expect(p.clubId).toBe('5');
            expect(
              parseInt(p.dateOfBirth.split('-')[0]),
            ).toBeGreaterThanOrEqual(1992);
            expect(parseInt(p.dateOfBirth.split('-')[1])).toBeLessThanOrEqual(
              2000,
            );
          });
        });
    });

    it('should ignore the isActive parameter when not valid', () => {
      return request(app.getHttpServer())
        .get('/players?isActive=not-valid')
        .expect(200)
        .expect((res: { body: GetPlayersResponse }) =>
          expect(res.body.players.length).toBe(10),
        );
    });

    it('should return 400 bad request when the birth year range parameter is not valid', () => {
      return request(app.getHttpServer())
        .get('/players?birthYearRange=not-valid')
        .expect(400)
        .expect((res: { body: { message: string[] } }) =>
          expect(res.body.message).toContain(
            'birthYearRange must be in the format YYYY-YYYY (e.g., 1992-2000)',
          ),
        );
    });
  });

  describe('/docs (GET)', () => {
    it('should return the swagger page', () => {
      return request(app.getHttpServer())
        .get('/docs')
        .expect(200)
        .expect((res) => {
          expect(res.text).toContain('Swagger UI');
        });
    });
  });
});
