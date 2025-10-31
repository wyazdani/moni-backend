// jwt-ws.guard.ts
import { CanActivate, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtWsGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(context: any): boolean {
    const client = context.switchToWs().getClient();
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.replace('Bearer ', '');
      console.log('token',token)
    if (!token) {
      client.emit('error','No token provided.');
      return false
    }

    try {
      const user = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      client.user = user; // ✅ Attach user to socket for further use
      return true;
    } catch (err) {
      client.emit('error','Invalid or expired token.');
      return false
    }
  }
}
