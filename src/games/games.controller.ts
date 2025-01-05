import { Controller, Param, Get, Post, Req, Body } from '@nestjs/common';
import { GamesService } from './games.service';
import { Request } from 'express';
import { StartGameDto } from './games.dto';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('start')
  async startGame(@Req() request: Request, @Body() body: StartGameDto) {
    const user = request.user as any;

    let country = body.country || user.country;

    return this.gamesService.startGame(user.id, country, body.mode);
  }

  @Get(':gameId')
  async getGame(@Param('gameId') gameId: string) {
    return this.gamesService.findGame(gameId);
  }
}
