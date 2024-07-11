import { ReservationTicket } from "./ReservationTicket.domain";

export class Seat {
  private readonly _id: number;
  private readonly _performanceId: number;
  private readonly _seatNo: number;
  private readonly _price: number;
  private readonly _reservationTicket: ReservationTicket;

  constructor(
    id: number,
    performanceId: number,
    seatNo: number,
    price: number,
    reservationTicket?: ReservationTicket,
  ) {
    this._id = id;
    this._performanceId = performanceId;
    this._seatNo = seatNo;
    this._price = price;
    this._reservationTicket = reservationTicket;
  }

  public isReserved(): boolean {
    return this._reservationTicket?.isFinish;
  }

  get id(): number {
    return this._id;
  }

  get performanceId(): number {
    return this._performanceId;
  }

  get seatNo(): number {
    return this._seatNo;
  }

  get price(): number {
    return this._price;
  }
}
