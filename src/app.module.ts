import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import { PlayerRepositoryAdapter } from './adapters/player-repository.adapter';
import { GetPlayersAction } from './application/get-players.action';
import configuration from './configuration';
import { AppController } from './controllers/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [
    GetPlayersAction,
    {
      provide: 'PlayerRepositoryPort',
      useClass: PlayerRepositoryAdapter,
    },
    {
      provide: 'MONGO_CLIENT',
      useFactory: async (
        configService: ConfigService,
      ): Promise<MongoClient> => {
        const username = configService.get<string>('dbUser');
        const password = configService.get<string>('dbPassword');
        const host = configService.get<string>('dbHost');
        const port = configService.get<number>('dbPort');
        const client = new MongoClient(
          `mongodb://${username}:${password}@${host}:${port}`,
        );
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
    {
      provide: 'COLLECTION_NAME',
      useFactory: (configService: ConfigService): string => {
        return configService.get<string>('collectionName') ?? '';
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
