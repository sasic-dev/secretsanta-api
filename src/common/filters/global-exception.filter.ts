import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ResponseDto } from '../dto/response.dto';

@Catch()
export class GlobalExceptionFilter<T extends { message: string; response: { message: string; error: string } }> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? (exception as HttpException).getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const errorResponse = exception?.response || { message: 'Internal Server Error', error: 'Unknown Error' };
    console.log(exception);
    response.status(status).json(new ResponseDto(false, 'Request Failed', null, errorResponse));
  }
}
