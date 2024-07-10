import { HttpStatus } from "@nestjs/common";

export class ConcertErrorCodeEnum {
  static readonly 존재하지_않는_콘서트 = new ConcertErrorCodeEnum(
    "존재하지 않는 콘서트 입니다.",
    HttpStatus.BAD_REQUEST,
  );
  static readonly 존재하지_않는_콘서트_정보 = new ConcertErrorCodeEnum(
    "존재하지 않는 콘서트 정보 입니다.",
    HttpStatus.BAD_REQUEST,
  );
  static readonly 예약_가능한_시간이_지남 = new ConcertErrorCodeEnum(
    "예약 가능한 시간이 지났습니다.",
    HttpStatus.BAD_REQUEST,
  );
  static readonly 신청_가능한_인원_초과 = new ConcertErrorCodeEnum(
    "신청 가능한 인원이 초과되었습니다.",
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
