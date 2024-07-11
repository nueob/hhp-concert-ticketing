import { ReservationTicket } from "../ReservationTicket.domain";

export interface OrderRepositoryInterface {
  findReservationById(reservationTicketId: number): Promise<ReservationTicket>;
}
