import { Controller, Param, Get, Post, Req, Body } from '@nestjs/common';
import { GamesService } from './games.service';
import { Request } from 'express';
import { StartGameDto } from './games.dto';
import { UsersService } from 'src/users/users.service';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService, private readonly usersService: UsersService) {}

  @Post('start')
  async startGame(@Req() request: Request, @Body() body: StartGameDto) {
    const user = request.user as any;

    let country = body.country || user.country;

    return this.gamesService.startGame(
      user.id,
      country,
      body.mode,
      body.answerDuration,
    );
  }

  @Get('history')
  async getGameHistory(@Req() request: Request) {
    const user = request.user as any;
    return this.gamesService.getGameHistory(user.id);
  }

  @Get(':gameId')
  async getGame(@Param('gameId') gameId: string) {
    const game = await this.gamesService.findGame(gameId);

    const playerIds = Object.keys(game.players);
    const players = await this.usersService.findByIds(playerIds);

    const rankings = game.rankings.map((ranking) => ({
      playerId: ranking.playerId,
      score: ranking.score,
      player: players.find((player) => player.id === ranking.playerId),
    }));

    return {
      ...game,
      rankings,
    };
  }
}
