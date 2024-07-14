export class ReservationTicket {
  private readonly _id: number;
  private readonly _userUuid: string;
  private readonly _seatId: number;
  private readonly _isFinish: boolean;
  private readonly _createdAt: Date;

  constructor(
    id?: number,
    userUuid?: string,
    seatId?: number,
    isFinish?: boolean,
    createdAt?: Date,
  ) {
    this._id = id;
    this._userUuid = userUuid;
    this._seatId = seatId;
    this._isFinish = isFinish;
    this._createdAt = createdAt;
  }

  public validTicket(): boolean {
    const fiveMinutesLater = new Date(
      this._createdAt.getTime() + 5 * 60 * 1000,
    );

    return new Date() < fiveMinutesLater;
  }

  get id(): number {
    return this._id;
  }

  get userUuid(): string {
    return this._userUuid;
  }

  get seatId(): number {
    return this._seatId;
  }

  get isFinish(): boolean {
    return this._isFinish;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
