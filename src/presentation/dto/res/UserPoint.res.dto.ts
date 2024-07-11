export class UserPointResponseDTO {
  private readonly _point: number;

  constructor(point?: number) {
    this._point = point;
  }

  get point(): number {
    return this._point;
  }
}
