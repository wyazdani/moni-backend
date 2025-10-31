import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  // Actual message text
  @Prop({ required: true })
  text: string;

  // Nested user object (GiftedChat style) 'assistant' for assistant
  @Prop({ type: Object, required: true })
  user: {
    _id: ObjectId | 'assistant';
  };
}

export const MessageSchema = SchemaFactory.createForClass(Message);
