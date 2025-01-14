import { Injectable, NotFoundException } from '@nestjs/common';
import { GeminiService } from '../gemini-ai/gemini-ai.service';
import { DynamoDBService } from '../dynamodb/dynamodb.service';
import { v4 as uuidv4 } from 'uuid';

interface PlayerScore {
  playerId: string;
  score: number;
}

@Injectable()
export class GamesService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly dynamoDBService: DynamoDBService,
  ) {}

  async create(game: any): Promise<any> {
    const players = {};
    players[game.hostId] = 0;
    const params = {
      TableName: 'Games',
      Item: {
        id: uuidv4(),
        ...game,
        players,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    try {
      await this.dynamoDBService
        .dynamoDB 
        .put(params)
        .promise();
      return params.Item;
    } catch (error) {
      throw new Error(`Failed to create game: ${error.message}`);
    }
  }

  async startGame(
    userId: string,
    country: string,
    mode: 'SP' | 'MP',
    answerDuration: number,
  ): Promise<any> {
    try {
      const prompt = `
      You are creating trivia questions for a "Family Feud"-style game. Make 10 the question that can be explore and learn about the customs, traditions, quirks of the people in ${country} or general knowledge, culture, history, or anything that can be fun and interesting.
      Use ${country === 'Indonesia' ? 'Indonesia' : 'English'} as the language.
      1. A trivia question.
      2. A list of posibble answers must be 4, ordered by popularity.
      3. Points for each answer (100 for the most common, decreasing randomly).
      4. Make the question and answers as fun and interesting as possible.
      5. Do not include any offensive or inappropriate content.
      6. Make the question like the player and the host are in the same country.
      Example output:json. please response in json format.
      {
        "question": "Name something people do when they're tired.",
        "answers": [
          {"text": "Sleep", "points": 40},
          {"text": "Yawn", "points": 30},
          {"text": "Drink coffee", "points": 20},
          {"text": "Rest on the couch", "points": 10}
        ]
      }. `;

      const response = await this.geminiService.generateQuestion(prompt);
      const newGame = {
        status: 'created',
        country,
        hostId: userId,
        mode,
        answerDuration,
        questions: response,
      };
      const gameCreated = await this.create(newGame);

      const result = {
        id: gameCreated.id,
        status: gameCreated.status,
        country: gameCreated.country,
        mode: gameCreated.mode,
        answerDuration: gameCreated.answerDuration,
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

      return result;
    } catch (error) {
      throw new Error(`Failed to start game: ${error.message}`);
    }
  }

  async findGame(gameId: string): Promise<any> {
    const params = {
      TableName: 'Games',
      Key: { id: gameId },
    };

    try {
      const result = await this.dynamoDBService.dynamoDB.get(params).promise();
      if (!result.Item) {
        throw new NotFoundException(`Game with ID ${gameId} not found`);
      }
      return result.Item;
    } catch (error) {
      throw new Error(`Failed to find game: ${error.message}`);
    }
  }

  async joinPlayer(game: any, playerId: string): Promise<any> {
    try {
      if (game.status !== 'created') {
        throw new Error('Game has already started');
      }

      if (!game.players) {
        game.players = {};
      }

      game.players[playerId] = 0;

      await this.dynamoDBService
        .dynamoDB 
        .update({
          TableName: 'Games',
          Key: { id: game.id },
          UpdateExpression: 'SET players = :players',
          ExpressionAttributeValues: {
            ':players': game.players,
          },
        })
        .promise();

      return game;
    } catch (error) {
      throw new Error(`Failed to join player: ${error.message}`);
    }
  }

  async submitAnswer(
    gameId: string,
    playerId: string,
    question: string,
    answer: string,
  ): Promise<{ points: number }> {
    try {
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

      if (!game.players[playerId]) {
        game.players[playerId] = 0;
      }
      game.players[playerId] += points;

      await this.dynamoDBService
        .dynamoDB 
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
    } catch (error) {
      throw new Error(`Failed to submit answer: ${error.message}`);
    }
  }

  async endGame(gameId: string): Promise<{ rankings: PlayerScore[] }> {
    try {
      const game = await this.findGame(gameId);

      if (game.status === 'ended') {
        throw new Error('Game has already ended');
      }

      const rankings: PlayerScore[] = Object.entries(game.players)
        .map(([playerId, score]) => ({ playerId, score: score as number }))
        .sort((a, b) => b.score - a.score);

      for (const ranking of rankings) {
        await this.dynamoDBService
          .dynamoDB 
          .update({
            TableName: 'Users',
            Key: { id: ranking.playerId },
            UpdateExpression: 'SET xp = xp + :xp',
            ExpressionAttributeValues: {
              ':xp': ranking.score,
            },
            ReturnValues: 'ALL_NEW',
          })
          .promise();
      }

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

      await this.dynamoDBService.dynamoDB.update(params).promise();

      return { rankings };
    } catch (error) {
      throw new Error(`Failed to end game: ${error.message}`);
    }
  }

  async getGameHistory(userId: string): Promise<any> {
    const params = {
      TableName: 'Games',
      ProjectionExpression:
        'id, country, answerDuration, players, #mode, createdAt, updatedAt, #status',
      FilterExpression: 'attribute_exists(players.#playerId)',
      ExpressionAttributeNames: {
        '#playerId': userId,
        '#mode': 'mode',
        '#status': 'status',
      },
    };

    try {
      const result = await this.dynamoDBService
        .dynamoDB 
        .scan(params)
        .promise();
      return result.Items;
    } catch (error) {
      throw new Error(`Failed to get game history: ${error.message}`);
    }
  }
}
