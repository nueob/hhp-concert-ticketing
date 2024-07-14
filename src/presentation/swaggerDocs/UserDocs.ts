import { applyDecorators } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ApiErrorResponse } from "../../../libs/decorator/ApiErrorResponse";
import { UserErrorCodeEnum } from "../../enum/UserErrorCode.enum";

export function FindUserPointDocs() {
  return applyDecorators(
    ApiOperation({
      summary: "포인트 조회 API",
      description: "사용자 uuid를 통해 포인트를 조회할 수 있습니다.",
    }),
  );
}

export function FindUserPointErrorResponse() {
  return ApiErrorResponse([UserErrorCodeEnum.존재하지_않는_유저]);
}

export function ChargeUserPointDocs() {
  return applyDecorators(
    ApiOperation({
      summary: "포인트 충전 API",
      description: "사용자 uuid를 통해 포인트를 충전할 수 있습니다.",
    }),
  );
}

export function ChargeUserPointErrorResponse() {
  return ApiErrorResponse([UserErrorCodeEnum.존재하지_않는_유저]);
}
