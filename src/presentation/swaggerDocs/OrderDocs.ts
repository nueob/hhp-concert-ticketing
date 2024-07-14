import { applyDecorators } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ApiErrorResponse } from "../../../libs/decorator/ApiErrorResponse";
import { OrderErrorCodeEnum } from "../../enum/OrderErrorCode.enum";

export function OrderDocs() {
  return applyDecorators(
    ApiOperation({
      summary: "결제 API",
      description: "예약 티켓 번호를 통해 결제를 할 수 있습니다.",
    }),
  );
}

export function OrderErrorResponse() {
  return ApiErrorResponse([
    OrderErrorCodeEnum.결제_가능한_시간_초과,
    OrderErrorCodeEnum.존재하지_않는_예약,
  ]);
}
