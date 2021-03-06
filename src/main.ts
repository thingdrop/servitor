import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { ModelHandlerService } from './modules/model/model-handler.service';

const { PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /* Middleware */
  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );

  app.enableCors({ origin: true });

  /* Remove all fields from requests not found in DTOs */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  /* Swagger API Docs */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Thingdrop API')
    .setDescription('Documentation for interacting with the Thingdrop API')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  /* Server Start */
  await app.listen(PORT);

  const modelHandlerService: ModelHandlerService = app.get(ModelHandlerService);
  modelHandlerService.listen();

  const logger = new Logger();
  logger.log(`Listening on port: ${PORT}`);
}
bootstrap();
