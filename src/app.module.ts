import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
  ],
})
export class AppModule {}
