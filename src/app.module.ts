import { INestApplication, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MongoClient } from 'mongodb';
import { PlayerRepositoryAdapter } from './adapters/player-repository.adapter';
import { GetPlayersAction } from './application/get-players.action';
import configuration from './configuration';
import { GetPlayersParams } from './controllers/dto/get-players.dto';
import { GetPlayersController } from './controllers/get-players.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
  controllers: [GetPlayersController],
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
        const dbUri = configService.get<string>('dbUri');
        const client = new MongoClient(
          dbUri ?? `mongodb://${username}:${password}@${host}:${port}`,
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
    {
      provide: 'DB_NAME',
      useFactory: (configService: ConfigService): string => {
        return configService.get<string>('dbName') ?? '';
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}

export function appBuilder(app: INestApplication): INestApplication {
  const docConfig = new DocumentBuilder()
    .setTitle('Players API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeDefaultValues: true,
        targetMaps: [GetPlayersParams],
      },
      validateCustomDecorators: true,
    }),
  );

  return app;
}
