import { Injectable } from "@nestjs/common";
import { OrderService } from "../domain/service/Order.service";
import { OrderErrorCodeEnum } from "../enum/OrderErrorCode.enum";
import { OrderTicket } from "../domain/OrderTicket.domain";
import { ConcertService } from "../domain/service/Concert.service";
import { OrderStepEnum } from "../enum/OrderStep.enum";
import { UserService } from "../domain/service/User.service";

@Injectable()
export class OrderFacade {
  constructor(
    private readonly orderService: OrderService,
    private readonly concertService: ConcertService,
    private readonly userService: UserService,
  ) {}

  async pay(reservationTicketId: number): Promise<void> {
    const reservationTicket =
      await this.orderService.findReservationById(reservationTicketId);
    if (!reservationTicket.validTicket()) {
      throw new Error(OrderErrorCodeEnum.결제_가능한_시간_초과.message);
    }

    const concert = await this.concertService.findBySeatId(
      reservationTicket.seatId,
    );
    const [performance] = concert.performanceList;
    const seat = performance.seatList.find(
      ({ id }) => id === reservationTicket.seatId,
    );
    const orderTicket = new OrderTicket(
      null,
      reservationTicketId,
      OrderStepEnum.결제전,
      concert.name,
      seat.seatNo,
      seat.price,
      new Date(),
    );

    await Promise.all([
      this.orderService.createOrderTicket(orderTicket),
      this.orderService.isFinishedReservation(reservationTicketId),
      // this.userService.usePoint()
    ]);
  }
}
