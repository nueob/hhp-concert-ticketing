import { HttpStatus } from "@nestjs/common";

export class OrderErrorCodeEnum {
  static readonly 이미_결제된_티켓 = new OrderErrorCodeEnum(
    "이미 결제된 예약 건 입니다.",
    HttpStatus.BAD_REQUEST,
  );
  static readonly 만료된_티켓 = new OrderErrorCodeEnum(
    "만료된 예약 건 입니다.",
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
