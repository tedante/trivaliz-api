import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { DATABASE } from './common/config';
import { RateLimiterModule, RateLimiterGuard } from 'nestjs-rate-limiter'
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
// import { QuestionModule } from './question/question.module';
import { GeminiService } from './gemini/gemini.service';
import { GeminiModule } from './gemini/gemini.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { DynamoDBService } from './dynamodb/dynamodb.service';

@Module({
  imports: [
    UserModule,
    RateLimiterModule.register({
      points: 10, // Number of points
      duration: 1, // Per second(s)
    }),
    AuthModule,
    GameModule,
    // QuestionModule,
    GeminiModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: RateLimiterGuard,
  }, GeminiService, DynamoDBService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'games/start', method: RequestMethod.POST
      },
    )
  }
}
