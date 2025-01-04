import { Controller, Param, Get, Post, Req } from '@nestjs/common';
import { GamesService } from './games.service';
import { Request } from 'express';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('start')
  async startGame(@Req() request: Request) {
    const user = request.user as any;

    return this.gamesService.startGame(user.id, user.country);
  }

  @Get(':gameId')
  async getGame(@Param('gameId') gameId: string) {
    return this.gamesService.findGame(gameId);
  }
}
