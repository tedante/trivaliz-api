import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GamesService } from './games.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GamesGateway {
  @WebSocketServer() server: Server;

  constructor(
    private gamesService: GamesService,
    private usersService: UsersService,
  ) {}

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() data: { gameId: string; playerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { gameId, playerId } = data;
    await client.join(gameId);
    client.data.playerId = playerId;
    client.data.gameId = gameId;

    const game = await this.gamesService.findGame(gameId);

    // add player to game table via gamesService
    await this.gamesService.joinPlayer(game, playerId);

    // get all players in the game, and send to all clients in the room
    const playerIds = Object.keys(game.players);
    const players = await this.usersService.findByIds(playerIds);

    this.server.to(gameId).emit('playersUpdate', { players });
  }

  @SubscribeMessage('startGame')
  async startGame(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { gameId } = data;
    try {
      this.server.to(gameId).emit('gameStarted');
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('submitAnswer')
  async handleSubmitAnswer(
    @MessageBody() data: { gameId: string; question: string; answer: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { gameId, question, answer } = data;
    const playerId = client.data.playerId;

    try {
      const result = await this.gamesService.submitAnswer(
        gameId,
        playerId,
        question,
        answer,
      );
      this.server.to(gameId).emit('answerResult', {
        playerId,
        question,
        answer,
        points: result.points,
      });
      return result;
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }

  @SubscribeMessage('endGame')
  async handleEndGame(
    @MessageBody() data: { gameId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { gameId } = data;

    try {
      const result = await this.gamesService.endGame(gameId);
      this.server.to(gameId).emit('gameEnded', result);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }
}
