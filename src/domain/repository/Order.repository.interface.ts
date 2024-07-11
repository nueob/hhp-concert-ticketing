import { OrderTicket } from "../OrderTicket";
import { ReservationTicket } from "../ReservationTicket.domain";

export interface OrderRepositoryInterface {
  findReservationById(reservationTicketId: number): Promise<ReservationTicket>;
  isFinishedReservation(reservationTicketId: number): Promise<void>;
  createOrderTicket(orderTicket: OrderTicket): Promise<OrderTicket>;
}
