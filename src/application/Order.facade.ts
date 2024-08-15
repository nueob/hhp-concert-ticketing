import { Inject, Injectable } from "@nestjs/common";

import { OrderService } from "../domain/service/Order.service";
import { OrderErrorCodeEnum } from "../enum/OrderErrorCode.enum";
import { OrderTicket } from "../domain/OrderTicket.domain";
import { ConcertService } from "../domain/service/Concert.service";
import { OrderStepEnum } from "../enum/OrderStep.enum";
import { UserService } from "../domain/service/User.service";
import { PointTransactionTypeEnum } from "../enum/PointTransactionType.enum";
import { QueueService } from "../domain/service/Queue.service";
import { PayDoneEventPublisher } from "../domain/event/PayDone.event-publisher";
import { PayDoneEvent } from "../domain/event/PayDone.event";

@Injectable()
export class OrderFacade {
  constructor(
    private readonly orderService: OrderService,
    private readonly concertService: ConcertService,
    private readonly userService: UserService,
    private readonly queueService: QueueService,
    @Inject("PayDoneEventPublisher")
    private readonly payDoneEventPublisher: PayDoneEventPublisher,
  ) {}

  async pay(uuid: string, reservationTicketId: number): Promise<void> {
    const [user, reservationTicket] = await Promise.all([
      this.userService.findByUuid(uuid),
      this.orderService.findReservationById(reservationTicketId),
    ]);
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

    if (seat.price > user.point) {
      throw new Error(OrderErrorCodeEnum.잔액_부족.message);
    }

    const amount = user.point - seat.price;
    const orderTicket = new OrderTicket(
      null,
      reservationTicketId,
      OrderStepEnum.결제전,
      concert.name,
      seat.seatNo,
      seat.price,
      new Date(),
    );

    const [createdOrderTicket] = await Promise.all([
      this.orderService.createOrderTicket(orderTicket),
      this.orderService.isFinishedReservation(reservationTicketId),
      this.userService.updatePoint(uuid, amount),
      this.userService.insertPointHistory(
        uuid,
        seat.price,
        PointTransactionTypeEnum.사용,
      ),
      this.queueService.expireActiveTokenByUuid(uuid),
    ]);

    this.payDoneEventPublisher.triggerEvent(
      new PayDoneEvent(createdOrderTicket.id, uuid, amount),
    );
  }
}
