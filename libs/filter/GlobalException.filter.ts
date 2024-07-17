import { ExceptionFilter, Catch, ArgumentsHost, Logger } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const data = {
      statusCode: 500,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(request.url + " " + exception);
    this.logger.error(exception.stack);

    response.status(500).json(data);
  }
}
