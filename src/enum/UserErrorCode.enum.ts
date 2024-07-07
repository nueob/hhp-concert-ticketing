import { HttpStatus } from "@nestjs/common";

export class UserErrorCodeEnum {
  static readonly 존재하지_않는_유저 = new UserErrorCodeEnum(
    "존재하지 않는 유저 입니다.",
    HttpStatus.BAD_REQUEST,
  );

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
