import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CLIENT_URL, PORT } from './common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: CLIENT_URL.split(";").map((el) => el.trim()),
  });

  await app.listen(PORT);
}
bootstrap();
