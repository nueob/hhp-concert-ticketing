export class FindReservationAvailableSeatResponseDTO {
  private readonly _availableForReservationCount: number;

  constructor(availableForReservationCount: number) {
    this._availableForReservationCount = availableForReservationCount;
  }

  get availableForReservationCount(): number {
    return this._availableForReservationCount;
  }
}
