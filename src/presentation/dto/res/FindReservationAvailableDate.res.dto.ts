import { Concert } from "@root/domain/Concert.domain";

export class FindReservationAvailableDateResponseDTO {
  private readonly _performanceId: number;
  private readonly _name: string;
  private readonly _ticketingStartAt: Date;
  private readonly _ticketingEndAt: Date;

  constructor(concert?: Concert) {
    this._performanceId = concert?.performance?.id;
    this._name = concert?.name;
    this._ticketingStartAt = concert?.performance?.ticketingStartAt;
    this._ticketingEndAt = concert?.performance?.ticketingEndAt;
  }

  get performanceId(): number {
    return this._performanceId;
  }

  get name(): string {
    return this._name;
  }

  get ticketingStartAt(): Date {
    return this._ticketingStartAt;
  }

  get ticketingEndAt(): Date {
    return this._ticketingEndAt;
  }
}
