import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { UsersModule } from 'src/users/users.module';
import { MessagesGateway } from './messages.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
    UsersModule,
    JwtModule
  ],
  controllers: [MessagesController],
  providers: [MessagesService,MessagesGateway],
})
export class MessagesModule {}
