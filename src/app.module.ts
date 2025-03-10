import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GetPlayersAction } from './application/get-players.action';
import configuration from './configuration';
import { AppController } from './controllers/app.controller';
import { PlayerRepositoryAdapter } from './adapters/player-repository.adapter';

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
