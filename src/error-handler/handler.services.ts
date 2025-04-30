import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";

@Catch()
export class ErrorHandler implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let code = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object') {
        message = exceptionResponse['message'] || exception.message;
        code = exceptionResponse['code'];
      } else {
        message = exception.message;
      }
      
      // Handle array messages
      if (Array.isArray(message)) {
        message = message[0];
      }
    } else {
      // For non-HTTP exceptions, you might want to log them
      console.error('Unhandled exception:', exception);
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}