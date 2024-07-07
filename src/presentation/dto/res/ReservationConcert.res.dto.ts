import { ReservationTicket } from "../../../domain/ReservationTicket.domain";

export class ReservationConcertResponseDTO {
  private readonly _reservationTicketId: number;

  constructor(reservationTicket: ReservationTicket) {
    this._reservationTicketId = reservationTicket.id;
  }

  get reservationTicketId(): number {
    return this._reservationTicketId;
  }
}
