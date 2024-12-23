import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { DATABASE } from './common/config';
import { RateLimiterModule, RateLimiterGuard } from 'nestjs-rate-limiter'
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { QuestionModule } from './question/question.module';

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE.URI, { dbName: DATABASE.DB_NAME }),
    UserModule,
    RateLimiterModule.register({
      points: 10, // Number of points
      duration: 1, // Per second(s)
    }),
    AuthModule,
    GameModule,
    QuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: RateLimiterGuard,
  }],
})
export class AppModule { }
