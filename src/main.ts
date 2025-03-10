import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('bootstrap');

  const docConfig = new DocumentBuilder()
    .setTitle('Players API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('port') || 3000;

  await app.listen(port);
  logger.log(`Server running on http://localhost:${port}`);
}

bootstrap().catch((err) => console.error(err));
