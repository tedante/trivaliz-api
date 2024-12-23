import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
  @Prop({ required: true })
  questionText: string;

  @Prop({ required: true })
  answers: string;

  @Prop({ required: true })
  gameId: string;

  @Prop({ required: true })
  order: number;
}