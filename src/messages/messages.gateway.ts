import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { JwtWsGuard } from './guards/jwt-ws.guard';
import { SignedUser } from 'src/common/types/signed-user';

export interface AuthenticatedSocket extends Socket {
  user?: SignedUser; // or type your user object here
}

@UseGuards(JwtWsGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private messagesService: MessagesService) {}

  @WebSocketServer()
  server: Server;

  // Triggered when a client connects
  handleConnection(@ConnectedSocket() client: Socket) {
    console.log('Client connected:', client.id);
  }

  // Triggered when a client disconnects
  handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const { _id } = client.user || {};
      await this.messagesService.streamResponse(_id || '', message, client);
    } catch (error) {
      client.emit('error', 'Failed to process message');
    } finally {
      client.emit(`message-response-completed`);
    }
  }
}
