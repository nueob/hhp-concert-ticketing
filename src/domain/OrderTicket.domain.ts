import { OrderStepEnum } from "../enum/OrderStep.enum";

export class OrderTicket {
  private readonly _id: number;
  private readonly _reservationTicketId: number;
  private readonly _step: OrderStepEnum;
  private readonly _concertName: string;
  private readonly _seatNo: number;
  private readonly _price: number;
  private readonly _createdAt: Date;

  constructor(
    id?: number,
    reservationTicketId?: number,
    step?: OrderStepEnum,
    concertName?: string,
    seatNo?: number,
    price?: number,
    createdAt?: Date,
  ) {
    this._id = id;
    this._reservationTicketId = reservationTicketId;
    this._step = step;
    this._concertName = concertName;
    this._seatNo = seatNo;
    this._price = price;
    this._createdAt = createdAt;
  }

  get id(): number {
    return this._id;
  }

  get reservationTicketId(): number {
    return this._reservationTicketId;
  }

  get step(): OrderStepEnum {
    return this._step;
  }

  get concertName(): string {
    return this._concertName;
  }

  get seatNo(): number {
    return this._seatNo;
  }

  get price(): number {
    return this._price;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
