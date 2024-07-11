import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { ErrorCodeEnum } from "@root/enum/ErrorCode.enum";

export function ApiErrorResponse(errorCodeList: ErrorCodeEnum[]) {
  return applyDecorators(
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      content: {
        "application/json": {
          examples: errorCodeList.reduce((acc, exception, index) => {
            acc[index] = {
              summary: exception.message,
              value: exception.message,
            };

            return acc;
          }, {}),
        },
      },
    }),
  );
}
