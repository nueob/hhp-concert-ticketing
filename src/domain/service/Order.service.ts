import { Injectable } from "@nestjs/common";
import { ReservationTicket } from "../ReservationTicket.domain";
import { OrderRepositoryInterface } from "../interface/Order.repository.interface";

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepositoryInterface) {}

  findReservationById(reservationTicketId: number): Promise<ReservationTicket> {
    return this.orderRepository.findReservationById(reservationTicketId);
  }
}
