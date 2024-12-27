import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiAiService {
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(this.configService.get<string>('GEMINI_API_KEY'));
  }

  async generateQuestions(country: string): Promise<any[]> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate 10 Family Feud style questions and answers specific to ${country}. Format the response as a JSON array of objects, each containing a 'question' field and an 'answers' field (which is an array of objects with 'text' and 'points' fields).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return JSON.parse(text);
  }
}

