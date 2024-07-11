import { OrderUseCase } from "./useCase/interface/Order.usecase.interface";

export class OrderFacade {
  constructor(private readonly orderUseCase: OrderUseCase) {}

  async pay(reservationTicketId: number): Promise<void> {
    await this.orderUseCase.order(reservationTicketId);
  }
}
