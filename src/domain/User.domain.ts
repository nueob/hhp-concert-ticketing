export class User {
  private readonly _uuid: string;
  private readonly _point: number;
  private readonly _refreshToken: string;
  private readonly _expiredDate: Date;

  constructor(
    uuid?: string,
    point?: number,
    refreshToken?: string,
    expiredDate?: Date,
  ) {
    this._uuid = uuid;
    this._point = point;
    this._refreshToken = refreshToken;
    this._expiredDate = expiredDate;
  }

  get uuid(): string {
    return this._uuid;
  }

  get point(): number {
    return this._point;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  get expiredDate(): Date {
    return this._expiredDate;
  }
}
