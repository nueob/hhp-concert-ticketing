import { ApiProperty } from "@nestjs/swagger";
import { Concert } from "../../../domain/Concert.domain";
import { Performance } from "../../../domain/Performance.domain";

class PerformanceDTO {
  private readonly _id: number;
  private readonly _ticketingStartAt: Date;
  private readonly _ticketingEndAt: Date;

  constructor(performance: Performance) {
    this._id = performance.id;
    this._ticketingStartAt = performance.ticketingStartAt;
    this._ticketingEndAt = performance.ticketingEndAt;
  }

  @ApiProperty()
  get id(): number {
    return this._id;
  }

  @ApiProperty()
  get ticketingStartAt(): Date {
    return this._ticketingStartAt;
  }

  @ApiProperty()
  get ticketingEndAt(): Date {
    return this._ticketingEndAt;
  }
}

export class FindReservationAvailableDateResponseDTO {
  private readonly _name: string;
  private readonly _performanceList: PerformanceDTO[];

  constructor(concert?: Concert) {
    this._name = concert?.name;
    this._performanceList = concert?.performanceList?.map(
      (performance) => new PerformanceDTO(performance),
    );
  }

  @ApiProperty()
  get name(): string {
    return this._name;
  }

  @ApiProperty({ type: [PerformanceDTO] })
  get performanceList(): PerformanceDTO[] {
    return this._performanceList;
  }
}
