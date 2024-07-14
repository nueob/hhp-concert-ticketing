import { applyDecorators } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ApiErrorResponse } from "../../decorator/ApiErrorResponse";
import { UserErrorCodeEnum } from "../../enum/UserErrorCode.enum";

export function AuthDocs() {
  return applyDecorators(
    ApiOperation({
      summary: "사용자 token API",
      description: "사용자 uuid를 통해 access token을 발급받을 수 있습니다.",
    }),
  );
}

export function AuthErrorResponse() {
  return ApiErrorResponse([
    UserErrorCodeEnum.존재하지_않는_유저,
    UserErrorCodeEnum.이미_발급받은_토큰,
  ]);
}
