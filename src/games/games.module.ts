import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { GeminiService } from '../gemini-ai/gemini-ai.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
  ],
  controllers: [GamesController],
  providers: [GamesService, GeminiService],
  exports: [GamesService],
})
export class GamesModule {}
