import { ReservationTicket } from "../../../domain/ReservationTicket.domain";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ReservationConcertRequestDTO {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  performanceId: number;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  seatId: number;

  constructor(performanceId: number, searId: number) {
    this.performanceId = performanceId;
    this.seatId = searId;
  }

  public toDomain(userUuid) {
    return new ReservationTicket(
      null,
      userUuid,
      this.performanceId,
      this.seatId,
      false,
      new Date(),
    );
  }
}
