import { Module } from '@nestjs/common';
import { GeminiService } from './gemini-ai.service';

@Module({
  providers: [GeminiService],
  exports: [],
})
export class GeminiModule {}
