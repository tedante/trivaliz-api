import { Injectable } from '@nestjs/common';
import { Game } from './game.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) { }

  async findAll(): Promise<Game[]> {
    return this.gameModel.find().exec();
  }

  async create(game: Game): Promise<Game> {
    const createdGame = new this.gameModel(game);
    return createdGame.save();
  }

  async findOneById(id: string): Promise<Game> {
    return await this.gameModel.findById(id).exec();
  }

  async updateOneById(id: string, game: Game): Promise<Game> {
    return this.gameModel.findByIdAndUpdate(id, game)
  }
}
