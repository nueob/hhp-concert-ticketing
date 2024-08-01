import { HttpStatus } from "@nestjs/common";
import { ErrorCodeEnum } from "./ErrorCode.enum";

export class AuthErrorCodeEnum extends ErrorCodeEnum {
  static readonly ACCESS_TOKEN_누락 = new AuthErrorCodeEnum(
    "access token을 입력해주세요",
    HttpStatus.BAD_REQUEST,
  );
  static readonly 대기열_등록_요청 = new AuthErrorCodeEnum(
    "활성화 회원이 아닙니다. 대기열에 등록하세요.",
    HttpStatus.BAD_REQUEST,
  );

  constructor(message: string, httpCode: HttpStatus) {
    super(message, httpCode);
  }
}
