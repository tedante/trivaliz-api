import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { Request } from 'express';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('start')
  async startGame(@Req() request: Request) {
    let user = request.user as any;

    return this.gamesService.startGame(user.id, user.country);
  }
}
