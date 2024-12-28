import { Injectable } from '@nestjs/common';
import { GeminiService } from 'src/gemini-ai/gemini-ai.service';
import { dynamoDBClient } from '../dynamodb/dynamodb.service';

@Injectable()
export class GamesService {
  constructor(private readonly geminiService: GeminiService) {}

  async create(game: any): Promise<any> {
    const params = {
      TableName: 'Games',
      Item: {
        ...game,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    try {
      await dynamoDBClient().put(params).promise();
      return params.Item;
    } catch (error) {
      throw new Error(`Failed to create game: ${error.message}`);
    }
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
    const newGame = {
      status: 'created',
      country,
      hostId: userId,
      question: response,
    };

    await this.create(newGame);

    return {
      // id: newGame.id,
      status: newGame.status,
      country: newGame.country,
      question: newGame.question,
    };
  }
}
