import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ChargeUserPointRequestDTO {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  amount: number;
}
