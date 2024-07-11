export class ReservationTicket {
  private readonly _id: number;
  private readonly _userUuid: number;
  private readonly _seatId: number;
  private readonly _isFinish: boolean;
  private readonly _createdAt: Date;

  constructor(
    id?: number,
    userUuid?: number,
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

  get id(): number {
    return this._id;
  }

  get userUuid(): number {
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
