import { LoggerService } from "@nestjs/common";

import * as winston from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";

export class WinstonLogger {
  private readonly _logger: LoggerService;

  constructor() {
    this._logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level}] - ${message}`;
        }),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.colorize(),
        }),
        new DailyRotateFile({
          dirname: "logs",
          filename: "application-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
        }),
      ],
    });
  }

  get logger(): LoggerService {
    return this._logger;
  }
}
