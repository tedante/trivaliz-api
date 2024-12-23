import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CLIENT_URL, PORT } from './common/config';
import helmet from 'helmet';
import { RateLimiterModule } from 'nestjs-rate-limiter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: CLIENT_URL.split(";").map((el) => el.trim()),
  });

  app.use(helmet());

  await app.listen(PORT);
}
bootstrap();
