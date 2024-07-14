import { OrderTicket } from "../domain/OrderTicket.domain";
import { OrderRepositoryInterface } from "../domain/repository/Order.repository.interface";
import { ReservationTicket } from "../domain/ReservationTicket.domain";

export class OrderRepositoryImpl implements OrderRepositoryInterface {
  findReservationById(reservationTicketId: number): Promise<ReservationTicket> {
    return Promise.resolve(new ReservationTicket());
  }
  isFinishedReservation(reservationTicketId: number): Promise<void> {
    return;
  }
  createOrderTicket(orderTicket: OrderTicket): Promise<OrderTicket> {
    return Promise.resolve(new OrderTicket());
  }
}
