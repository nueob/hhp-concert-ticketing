import { OrderService } from "src/domain/service/Order.service";
import { OrderUseCase } from "./interface/Order.usecase.interface";
import { OrderErrorCodeEnum } from "src/enum/OrderErrorCode.enum";
import { ConcertService } from "src/domain/service/Concert.service";
import { ConcertErrorCodeEnum } from "src/enum/ConcertErrorCode.enum";

export class OrderUseCaseImpl implements OrderUseCase {
  constructor(
    private readonly orderService: OrderService,
    private readonly concertService: ConcertService,
  ) {}

  async order(reservationTicketId: number): Promise<void> {
    const reservation =
      await this.orderService.findReservationById(reservationTicketId);
    if (!concert) {
      throw new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트.message);
    }
    if (reservation.isFinish) {
      throw new Error(OrderErrorCodeEnum.이미_결제된_티켓.message);
    }
    if (reservation.hasFiveMinutesPassed()) {
      throw new Error(OrderErrorCodeEnum.만료된_티켓.message);
    }
  }
}
