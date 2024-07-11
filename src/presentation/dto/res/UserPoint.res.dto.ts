import { ApiProperty } from "@nestjs/swagger";

export class UserPointResponseDTO {
  private readonly _point: number;

  constructor(point: number) {
    this._point = point;
  }

  @ApiProperty()
  get point(): number {
    return this._point;
  }
}
