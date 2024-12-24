import { Injectable } from '@nestjs/common';
import { Game } from './game.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { GeminiService } from 'src/gemini/gemini.service';

@Injectable()
export class GameService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>, private readonly userService: UserService, private readonly geminiService: GeminiService) { }

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

  async startGame(userId: string, country: string) {
    // Generate question and answer using Google Gemini
    const prompt = `
    You are creating trivia questions for a "Family Feud"-style game. Make 10 the question is relate and with ${country} country also use ${country} language Provide:
    1. A trivia question. 
    2. A list of 4 or 6 possible answers, ordered by popularity. But only between 5 and 8 answers that has a point, 4 question has 5 "correct" answer, 3 question has 6 "correct" answer, 2 question has 7 "correct" answer,
    3. Points for each answer (100 for the most common, decreasing randomly). 
    Example output:json. please response in json format.
    {
      "question": "Name something people do when they're tired.",
      "answers": [
        {"text": "Sleep", "points": 40},
        {"text": "Yawn", "points": 30},
        {"text": "Drink coffee", "points": 20},
        {"text": "Rest on the couch", "points": 10},
        {"text": "Close their eyes", "points": 5},
        ...
      ]
    }. `;

    const response = await this.geminiService.generateQuestion(prompt);
    // Create a new game
    const newGame = new this.gameModel({
      status: 'created',
      country,
      hostId: userId,
      question: response,
    });

    await newGame.save();

    return {
      id: newGame._id,
      status: newGame.status,
      country: newGame.country,
      question: newGame.question,
    };
  }
}
