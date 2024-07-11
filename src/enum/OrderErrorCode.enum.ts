import { HttpStatus } from "@nestjs/common";

export class OrderErrorCodeEnum {
  static readonly 존재하지_않는_예약 = new OrderErrorCodeEnum(
    "존재하지 않는 예약 입니다.",
    HttpStatus.BAD_REQUEST,
  );
  static readonly 결제_가능한_시간_초과 = new OrderErrorCodeEnum(
    "결제 가능한 시간이 지났습니다.",
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
