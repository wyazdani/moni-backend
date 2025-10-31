import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    if (exception.code === 11000) {
      response.status(409).json({
        statusCode: 409,
        message: `${Object.keys(exception.keyValue)[0]} already exists`,
        error: 'Conflict',
      });
    } else if (exception?.status) {
      response.status(exception.status).json(exception.response);
    } else {
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
    console.log(exception);
  }
}
