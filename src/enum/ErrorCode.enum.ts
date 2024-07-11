import { HttpStatus } from "@nestjs/common";

export class ErrorCodeEnum {
  private readonly _message: string;
  private readonly _httpCode: HttpStatus;

  constructor(message: string, httpCode: HttpStatus) {
    this._message = message;
    this._httpCode = httpCode;
  }

  get message(): string {
    return this._message;
  }

  get httpCode(): HttpStatus {
    return this._httpCode;
  }
}
