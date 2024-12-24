import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game {
  @Prop({ required: true, default: 'created' })
  status: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  hostId: string;

  @Prop({ required: true })
  question: [object];
}

export const GameSchema = SchemaFactory.createForClass(Game);