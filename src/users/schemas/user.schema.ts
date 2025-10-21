import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Status } from '../enums/status.enum';
import mongoose, { Document } from 'mongoose';
import { Role } from '../enums/role.enum';

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_, ret: Record<string, any>) => {
      delete ret.__v;
      delete ret.password;
      delete ret.otp;
      delete ret.status;
      delete ret.role;
      return ret;
    },
  },
})
export class User extends Document<mongoose.ObjectId> {
  @Prop({
    required: true,
  })
  first_name: string;

  @Prop({
    required: true,
  })
  last_name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop()
  password?: string;

  @Prop({
    required: true,
  })
  country: string;

  @Prop({
    required: true,
  })
  state: string;

  @Prop({
    required: true,
    enum: Status,
    default: Status.Pending,
  })
  status?: Status;

  @Prop()
  where_did_hear?: string;

  @Prop({
    required: true,
    enum: Role,
    default: Role.User,
  })
  role: Role;

  @Prop()
  otp?: string;

  @Prop()
  profile_image?: string;

  @Prop()
  profile_image_public_id?: string;

  @Prop({
    default: true,
  })
  notification_enabled?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
