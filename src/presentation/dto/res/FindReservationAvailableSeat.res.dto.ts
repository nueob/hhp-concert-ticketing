import { Seat } from "../../../domain/Seat.domain";

export class FindReservationAvailableSeatResponseDTO {
  private readonly _id: number;
  private readonly _seatNo: number;
  private readonly _price: number;

  constructor(seat: Seat) {
    this._id = seat.id;
    this._seatNo = seat.seatNo;
    this._price = seat.price;
  }

  get id(): number {
    return this._id;
  }

  get seatNo(): number {
    return this._seatNo;
  }

  get price(): number {
    return this._price;
  }
}
