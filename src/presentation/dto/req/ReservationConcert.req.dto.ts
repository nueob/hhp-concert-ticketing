import { ApiProperty } from "@nestjs/swagger";
import { ReservationTicket } from "../../../domain/ReservationTicket.domain";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ReservationConcertRequestDTO {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  seatId: number;

  constructor(seatId: number) {
    this.seatId = seatId;
  }

  public toDomain(userUuid) {
    return new ReservationTicket(
      null,
      userUuid,
      this.seatId,
      0,
      false,
      new Date(),
    );
  }
}
