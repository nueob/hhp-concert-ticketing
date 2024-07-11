import { Seat } from "./Seat.domain";

export class Performance {
  private readonly _id: number;
  private readonly _maximumCapacity: number;
  private readonly _startAt: Date;
  private readonly _ticketingStartAt: Date;
  private readonly _ticketingEndAt: Date;
  private readonly _seatList: Seat[];

  constructor(
    id?: number,
    maximumCapacity?: number,
    startAt?: Date,
    ticketingStartAt?: Date,
    ticketingEndAt?: Date,
    seatList?: Seat[],
  ) {
    this._id = id;
    this._maximumCapacity = maximumCapacity;
    this._startAt = startAt;
    this._ticketingStartAt = ticketingStartAt;
    this._ticketingEndAt = ticketingEndAt;
    this._seatList = seatList;
  }

  public getAvailableSeat(): Seat[] {
    return this._seatList.filter((seat) => !seat.isReserved());
  }

  public isTicketAvailableDate(): boolean {
    const currentDate = new Date();

    return (
      this._ticketingStartAt <= currentDate &&
      currentDate < this._ticketingEndAt
    );
  }

  get id(): number {
    return this._id;
  }

  get maximumCapacity(): number {
    return this._maximumCapacity;
  }

  get startAt(): Date {
    return this._startAt;
  }

  get ticketingStartAt(): Date {
    return this._ticketingStartAt;
  }

  get ticketingEndAt(): Date {
    return this._ticketingEndAt;
  }

  get seatList(): Seat[] {
    return this._seatList;
  }
}
