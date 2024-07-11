import { Inject, Injectable } from "@nestjs/common";
import { OrderRepositoryInterface } from "../repository/Order.repository.interface";
import { ReservationTicket } from "../ReservationTicket.domain";
import { OrderErrorCodeEnum } from "../../enum/OrderErrorCode.enum";
import { OrderTicket } from "../OrderTicket";

@Injectable()
export class OrderService {
  constructor(
    @Inject("OrderRepositoryInterface")
    private readonly orderRepositoryInterface: OrderRepositoryInterface,
  ) {}

  async findReservationById(
    reservationTicketId: number,
  ): Promise<ReservationTicket> {
    const reservationTicket =
      await this.orderRepositoryInterface.findReservationById(
        reservationTicketId,
      );
    if (!reservationTicket) {
      throw new Error(OrderErrorCodeEnum.존재하지_않는_예약.message);
    }

    return reservationTicket;
  }

  isFinishedReservation(reservationTicketId: number): Promise<void> {
    return this.orderRepositoryInterface.isFinishedReservation(
      reservationTicketId,
    );
  }

  createOrderTicket(orderTicket: OrderTicket): Promise<OrderTicket> {
    return this.orderRepositoryInterface.createOrderTicket(orderTicket);
  }
}
