import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Role } from '../enums/role.enum';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ type: Object, required: true })
  user: {
    _id: ObjectId;
  };

  @Prop({ enum: Role, required: true })
  role: Role;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
