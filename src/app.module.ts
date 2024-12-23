import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { DATABASE } from './common/config';
import { RateLimiterModule, RateLimiterGuard } from 'nestjs-rate-limiter'
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot(DATABASE.URI, { dbName: DATABASE.DB_NAME }),
    UserModule,
    RateLimiterModule.register({
      points: 10, // Number of points
      duration: 1, // Per second(s)
    }),
    RateLimiterModule
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: RateLimiterGuard,
  }],
})
export class AppModule { }
