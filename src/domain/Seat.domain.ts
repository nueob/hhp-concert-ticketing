import { Performance } from "./Performance.domain";

export class Seat {
  private readonly _id: number;
  private readonly _performanceId: number;
  private readonly _seatNo: number;
  private readonly _price: number;
  private _isReserved: boolean;
  private readonly _performance: Performance;

  constructor(
    id: number,
    performanceId: number,
    seatNo: number,
    price: number,
    isReserved: boolean,
    performance?: Performance,
  ) {
    this._id = id;
    this._performanceId = performanceId;
    this._seatNo = seatNo;
    this._price = price;
    this._isReserved = isReserved;
    this._performance = performance;
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

  get isReserved(): boolean {
    return this._isReserved;
  }

  set isReserved(value) {
    this._isReserved = value;
  }

  get performance(): Performance {
    return this._performance;
  }
}
