import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { appBuilder, AppModule } from './app.module';

async function bootstrap() {
  const app = appBuilder(await NestFactory.create(AppModule));
  const configService = app.get(ConfigService);
  const logger = new Logger('bootstrap');

  const port = configService.get<number>('port') || 3000;

  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
}

bootstrap().catch((err) => console.error(err));
