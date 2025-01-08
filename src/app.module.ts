import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { GeminiModule } from './gemini-ai/gemini-ai.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [UsersModule, AuthModule, GeminiModule, GamesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: 'games/start',
      method: RequestMethod.POST,
    });
    consumer.apply(AuthMiddleware).forRoutes('users');
  }
}
