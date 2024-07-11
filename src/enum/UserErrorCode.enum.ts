import { HttpStatus } from "@nestjs/common";
import { ErrorCodeEnum } from "./ErrorCode.enum";

export class UserErrorCodeEnum extends ErrorCodeEnum {
  static readonly 존재하지_않는_유저 = new UserErrorCodeEnum(
    "존재하지 않는 유저 입니다.",
    HttpStatus.BAD_REQUEST,
  );

  constructor(message: string, httpCode: HttpStatus) {
    super(message, httpCode);
  }
}
