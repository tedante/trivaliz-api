import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class GeminiService {
  constructor() {}

  async generateQuestion(prompt: string): Promise<any> {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    })

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text().trim();
    // remove from the responseText ```json and ```
    const response = (responseText.substring(7, responseText.length - 3));
    
    return JSON.parse(response)
  }
}
