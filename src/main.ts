import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { PartEventService } from './modules/part/part-event.service';

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

  /* Server Start */
  await app.listen(PORT);

  const partEventService: PartEventService = app.get(PartEventService);
  partEventService.listen();

  const logger = new Logger();
  logger.log(`Listening on port: ${PORT}`);
}
bootstrap();
