import { Injectable } from '@nestjs/common';
import { GeminiService } from 'src/gemini-ai/gemini-ai.service';
import { dynamoDBClient } from '../dynamodb/dynamodb.service';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundException } from '@nestjs/common';

interface PlayerScore {
  playerId: string;
  score: number;
}

@Injectable()
export class GamesService {
  constructor(private readonly geminiService: GeminiService) {}

  async create(game: any): Promise<any> {
    const params = {
      TableName: 'Games',
      Item: {
        id: uuidv4(),
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

  async startGame(userId: string, country: string, mode: 'SP' | 'MP') {
    // Generate question and answer using Google Gemini
    const prompt = `
    You are creating trivia questions for a "Family Feud"-style game. Make 10 the question is relate and with ${country} country also use ${country} language Provide:
    1. A trivia question.
    2. A list of 4 or 6 possible answers, ordered by popularity. But only between 5 and 8 answers that has a point, 4 question has 4 "correct" answer, 5 question has 6 "correct" answer,
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
      mode,
      questions: response,
    };

    const gameCreated = await this.create(newGame);

    return {
      id: gameCreated.id,
      status: gameCreated.status,
      country: gameCreated.country,
      mode: gameCreated.mode,
      hostId: gameCreated.hostId,
      questions: gameCreated.questions.map((e) => {
        return {
          question: e.question,
          answers: e.answers.map((answer) => {
            return {
              text: answer.text,
            };
          }),
        };
      }),
    };
  }

  async findGame(gameId: string): Promise<any> {
    const params = {
      TableName: 'Games',
      Key: { id: gameId },
    };

    const result = await dynamoDBClient().get(params).promise();
    if (!result.Item) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }
    return result.Item;
  }

  async submitAnswer(
    gameId: string,
    playerId: string,
    question: string,
    answer: string,
  ): Promise<{ points: number }> {
    const game = await this.findGame(gameId);
    const questionObj = game.questions.find((q) => q.question === question);

    if (!questionObj) {
      throw new NotFoundException(
        `Question "${question}" not found in game ${gameId}`,
      );
    }

    const matchingAnswer = questionObj.answers.find(
      (a) => a.text.toLowerCase() === answer.toLowerCase(),
    );
    const points = matchingAnswer ? matchingAnswer.points : 0;

    // Update player's score
    if (!game.players[playerId]) {
      game.players[playerId] = 0;
    }
    game.players[playerId] += points;

    // Update the game in the database
    // await this.dynamoDBService.update({
    //   TableName: 'Games',
    //   Key: { id: gameId },
    //   UpdateExpression: 'SET players = :players',
    //   ExpressionAttributeValues: {
    //     ':players': game.players,
    //   },
    // });

    await dynamoDBClient()
      .update({
        TableName: 'Games',
        Key: { id: gameId },
        UpdateExpression: 'SET players = :players',
        ExpressionAttributeValues: {
          ':players': game.players,
        },
      })
      .promise();

    return { points };
  }

  async endGame(gameId: string): Promise<{ rankings: PlayerScore[] }> {
    const game = await this.findGame(gameId);

    if (game.status === 'ended') {
      throw new Error('Game has already ended');
    }

    const rankings: PlayerScore[] = Object.entries(game.players)
      .map(([playerId, score]) => ({ playerId, score: score as number }))
      .sort((a, b) => b.score - a.score);

    const params = {
      TableName: 'Games',
      Key: { id: gameId },
      UpdateExpression: 'SET #status = :status, rankings = :rankings',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': 'ended',
        ':rankings': rankings,
      },
    };

    await dynamoDBClient().update(params).promise();

    return { rankings };
    // return result.Item;

    // Update game status to 'ended'
    // await this.dynamoDBService.update({
    //   TableName: 'Games',
    //   Key: { id: gameId },
    //   UpdateExpression: 'SET #status = :status, rankings = :rankings',
    //   ExpressionAttributeNames: {
    //     '#status': 'status',
    //   },
    //   ExpressionAttributeValues: {
    //     ':status': 'ended',
    //     ':rankings': rankings,
    //   },
    // });

    // return { rankings };
  }
}
