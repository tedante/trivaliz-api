import { Test, TestingModule } from '@nestjs/testing';
import { GamesService } from './games.service';
import { GeminiService } from '../gemini-ai/gemini-ai.service';
import { dynamoDBClient } from '../dynamodb/dynamodb.service';
import { NotFoundException } from '@nestjs/common';
import { scan } from 'rxjs';

jest.mock('../dynamodb/dynamodb.service', () => ({
  dynamoDBClient: jest.fn().mockReturnValue({
    put: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    scan: jest.fn().mockReturnThis(),
    promise: jest.fn(),
  }),
}));

const game = {
  id: '5a59194c-95e7-40ce-96cb-ae442d05c813',
  status: 'created',
  country: 'Indonesia',
  hostId: '3d6badd4-633c-4f99-8fe5-573feb459a0d',
  questions: [
    {
      question: 'Sebutkan pulau terbesar di Indonesia!',
      answers: [
        {
          text: 'Pulau Kalimantan',
          points: 100,
        },
        {
          text: 'Pulau Papua',
          points: 80,
        },
        {
          text: 'Pulau Sumatra',
          points: 60,
        },
        {
          text: 'Pulau Sulawesi',
          points: 40,
        },
      ],
    },
    {
      question: 'Apa makanan nasional Indonesia?',
      answers: [
        {
          text: 'Nasi Goreng',
          points: 100,
        },
        {
          text: 'Rendang',
          points: 75,
        },
        {
          text: 'Sate',
          points: 60,
        },
        {
          text: 'Gado-gado',
          points: 50,
        },
        {
          text: 'Soto',
          points: 35,
        },
        {
          text: 'Bakso',
          points: 25,
        },
      ],
    },
    {
      question: 'Sebutkan tiga hewan endemik Indonesia!',
      answers: [
        {
          text: 'Komodo',
          points: 100,
        },
        {
          text: 'Orangutan',
          points: 90,
        },
        {
          text: 'Anoa',
          points: 70,
        },
        {
          text: 'Cendrawasih',
          points: 50,
        },
      ],
    },
    {
      question: 'Sebutkan beberapa tarian tradisional Indonesia!',
      answers: [
        {
          text: 'Tari Saman',
          points: 100,
        },
        {
          text: 'Tari Kecak',
          points: 85,
        },
        {
          text: 'Tari Pendet',
          points: 70,
        },
        {
          text: 'Tari Jaipong',
          points: 55,
        },
      ],
    },
    {
      question: 'Sebutkan beberapa alat musik tradisional Indonesia!',
      answers: [
        {
          text: 'Gamelan',
          points: 100,
        },
        {
          text: 'Angklung',
          points: 80,
        },
        {
          text: 'Suling',
          points: 60,
        },
        {
          text: 'Rebab',
          points: 50,
        },
        {
          text: 'Kendang',
          points: 40,
        },
        {
          text: 'Gendang',
          points: 30,
        },
      ],
    },
    {
      question: 'Apa beberapa destinasi wisata terkenal di Indonesia?',
      answers: [
        {
          text: 'Bali',
          points: 100,
        },
        {
          text: 'Raja Ampat',
          points: 85,
        },
        {
          text: 'Borobudur',
          points: 70,
        },
        {
          text: 'Komodo',
          points: 60,
        },
        {
          text: 'Yogyakarta',
          points: 50,
        },
        {
          text: 'Danau Toba',
          points: 40,
        },
      ],
    },
    {
      question: 'Sebutkan beberapa bahasa daerah yang digunakan di Indonesia!',
      answers: [
        {
          text: 'Jawa',
          points: 100,
        },
        {
          text: 'Sunda',
          points: 90,
        },
        {
          text: 'Batak',
          points: 75,
        },
        {
          text: 'Madura',
          points: 60,
        },
      ],
    },
    {
      question: 'Sebutkan beberapa jenis kopi yang berasal dari Indonesia!',
      answers: [
        {
          text: 'Kopi Luwak',
          points: 100,
        },
        {
          text: 'Kopi Mandheling',
          points: 80,
        },
        {
          text: 'Kopi Toraja',
          points: 70,
        },
        {
          text: 'Kopi Arabika Gayo',
          points: 60,
        },
      ],
    },
    {
      question: 'Sebutkan beberapa gunung berapi terkenal di Indonesia!',
      answers: [
        {
          text: 'Gunung Agung (Bali)',
          points: 100,
        },
        {
          text: 'Gunung Merapi (Jawa Tengah)',
          points: 90,
        },
        {
          text: 'Gunung Bromo (Jawa Timur)',
          points: 75,
        },
        {
          text: 'Gunung Krakatau (Sunda Strait)',
          points: 60,
        },
        {
          text: 'Gunung Rinjani (Lombok)',
          points: 50,
        },
      ],
    },
    {
      question: 'Sebutkan beberapa pahlawan nasional Indonesia!',
      answers: [
        {
          text: 'Ir. Soekarno',
          points: 100,
        },
        {
          text: 'Mohammad Hatta',
          points: 90,
        },
        {
          text: 'Cut Nyak Dien',
          points: 75,
        },
        {
          text: 'Pangeran Diponegoro',
          points: 65,
        },
        {
          text: 'Kartini',
          points: 50,
        },
        {
          text: 'Sultan Agung',
          points: 40,
        },
      ],
    },
  ],
  players: {
    '3d6badd4-633c-4f99-8fe5-573feb459a0d': 0,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('GamesService', () => {
  let service: GamesService;
  let dynamoDB;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: GeminiService,
          useValue: {
            generateQuestion: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    dynamoDB = dynamoDBClient();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new game', async () => {
      const input = { ...game };
      delete input.id;

      dynamoDB.put().promise.mockResolvedValueOnce({});
      const result = await service.create(game);

      expect(result).toEqual(
        expect.objectContaining({
          country: game.country,
          hostId: game.hostId,
          questions: game.questions,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );

      expect(result.questions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            question: expect.any(String),
            answers: expect.arrayContaining([
              expect.objectContaining({
                text: expect.any(String),
              }),
            ]),
          }),
        ]),
      );
    });

    it('should throw an error if creation fails', async () => {
      const game = { name: 'Test Game' };
      dynamoDB
        .put()
        .promise.mockRejectedValueOnce(new Error('Failed to create game'));

      await expect(service.create(game)).rejects.toThrow(
        'Failed to create game',
      );
    });
  });

  // describe('startGame', () => {
  //   it('should start a new game', async () => {
  //     const userId = 'user1';
  //     const country = 'USA';
  //     const response = {
  //       question: 'Name something people do when they are tired.',
  //       answers: [
  //         { text: 'Sleep', points: 40 },
  //         { text: 'Yawn', points: 30 },
  //         { text: 'Drink coffee', points: 20 },
  //         { text: 'Rest on the couch', points: 10 },
  //       ],
  //     };

  //     geminiService.generateQuestion.mockResolvedValueOnce(response);
  //     dynamoDB.put().promise.mockResolvedValueOnce({});

  //     const result = await service.startGame(userId, country);

  //     expect(result).toEqual({
  //       id: expect.any(String),
  //       status: 'created',
  //       country,
  //       questions: [
  //         {
  //           question: response.question,
  //           answers: response.answers.map((answer) => ({ text: answer.text })),
  //         },
  //       ],
  //     });
  //     expect(geminiService.generateQuestion).toHaveBeenCalled();
  //     expect(dynamoDB.put).toHaveBeenCalled();
  //   });
  // });

  describe('findGame', () => {
    it('should find a game by ID', async () => {
      const gameId = '5a59194c-95e7-40ce-96cb-ae442d05c813';

      dynamoDB.get().promise.mockResolvedValueOnce({ Item: game });
      const result = await service.findGame(gameId);

      expect(result).toEqual(game);
      expect(dynamoDB.get).toHaveBeenCalledWith({
        TableName: 'Games',
        Key: { id: gameId },
      });
    });

    it('should throw a NotFoundException if game is not found', async () => {
      const gameId = '1';

      dynamoDB.get().promise.mockResolvedValueOnce({});
      await expect(service.findGame(gameId)).rejects.toThrow(NotFoundException);
    });
  });

  // Add more tests for other methods like joinPlayer, submitAnswer, endGame, etc.

  describe('joinPlayer', () => {
    it('should join a player to a game', async () => {
      const gameCreated = { ...game };
      gameCreated.status = 'created';

      const playerId = '3d6badd4-633c-4f99-8fe5-573feb459a0d';
      dynamoDB.get().promise.mockResolvedValueOnce({ Item: gameCreated });
      dynamoDB.update().promise.mockResolvedValueOnce({});
      const result = await service.joinPlayer(gameCreated, playerId);

      expect(result.players).toHaveProperty(playerId);
    });
  });

  // test getGameHistory
  describe('getGameHistory', () => {
    it('should get game history for a user', async () => {
      const playerId = '3d6badd4-633c-4f99-8fe5-573feb459a0d';
      const games = [game];
      dynamoDB.scan().promise.mockResolvedValueOnce({ Items: games });
      const result = await service.getGameHistory(playerId);

      expect(result).toEqual(games);
    });
  });
});
