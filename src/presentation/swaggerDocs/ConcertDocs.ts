import { applyDecorators } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ApiErrorResponse } from "../../decorator/ApiErrorResponse";
import { ConcertErrorCodeEnum } from "../../enum/ConcertErrorCode.enum";

export function FindAllDocs() {
  return applyDecorators(
    ApiOperation({
      summary: "콘서트 조회 API",
      description: "모든 콘서트를 조회할 수 있습니다.",
    }),
  );
}

export function FindReservationAvailableDateDocs() {
  return applyDecorators(
    ApiOperation({
      summary: "특정 콘서트 예약 가능한 날짜 조회 API",
      description: "특정 콘서트의 예약 가능한 날짜를 조회할 수 있습니다.",
    }),
  );
}

export function FindReservationAvailableDateErrorReponse() {
  return ApiErrorResponse([ConcertErrorCodeEnum.존재하지_않는_콘서트]);
}

export function FindReservationAvailableSeatDocs() {
  return applyDecorators(
    ApiOperation({
      summary: "특정 콘서트 예약 가능한 좌석 조회 API",
      description: "특정 콘서트의 예약 가능한 좌석을 조회할 수 있습니다.",
    }),
  );
}

export function FindReservationAvailableSeatErrorReponse() {
  return ApiErrorResponse([
    ConcertErrorCodeEnum.존재하지_않는_콘서트,
    ConcertErrorCodeEnum.존재하지_않는_콘서트_정보,
  ]);
}

export function ReservationDocs() {
  return applyDecorators(
    ApiOperation({
      summary: "콘서트 예약 API",
      description: "좌석 정보를 통해 콘서트를 예약할 수 있습니다.",
    }),
  );
}

export function ReservationErrorResponse() {
  return ApiErrorResponse([
    ConcertErrorCodeEnum.존재하지_않는_콘서트,
    ConcertErrorCodeEnum.예약_가능한_시간이_지남,
    ConcertErrorCodeEnum.신청_가능한_인원_초과,
  ]);
}
