import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { Request } from 'express';
import { count } from 'console';

interface User {
  id: string;
}

interface CustomRequest extends Request {
}

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('start')
  async startGame(@Req() request: Request) {
    let user = (request.user as any); 
    
    return this.gameService.startGame(user.id, user.country);
  }
}
