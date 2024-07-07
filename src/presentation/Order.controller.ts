import { Controller, HttpCode, HttpStatus, Param, Put } from "@nestjs/common";
import { OrderFacade } from "../application/Order.facade";

@Controller("/order")
export class OrderController {
  constructor(private readonly orderFacade: OrderFacade) {}

  @Put("/:reservationTicketId")
  @HttpCode(HttpStatus.OK)
  async pay(@Param("reservationTicketId") reservationTicketId: number) {
    this.orderFacade.pay(reservationTicketId);
  }
}
