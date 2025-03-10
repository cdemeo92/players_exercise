import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GetPlayersAction } from './application/get-players.action';
import { AppController } from './controllers/app.controller';
import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [GetPlayersAction],
})
export class AppModule {}
