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

  get id(): number {
    return this._id;
  }

  get ticketingStartAt(): Date {
    return this._ticketingStartAt;
  }

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

  get name(): string {
    return this._name;
  }

  get performanceList(): PerformanceDTO[] {
    return this._performanceList;
  }
}
