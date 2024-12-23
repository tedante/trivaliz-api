import { Injectable } from '@nestjs/common';
import { Question } from './question.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class QuestionService {
  constructor(@InjectModel(Question.name) private questionModel: Model<Question>) { }

  async findAll(): Promise<Question[]> {
    return this.questionModel.find().exec();
  }

  async create(question: Question): Promise<Question> {
    const createdQuestion = new this.questionModel(question);
    return createdQuestion.save();
  }

  async findOneById(id: string): Promise<Question> {
    return await this.questionModel.findById(id).exec();
  }

  async updateOneById(id: string, question: Question): Promise<Question> {
    return this.questionModel.findByIdAndUpdate(id, question)
  }
}
