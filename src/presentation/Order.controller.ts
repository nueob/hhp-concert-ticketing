import { Controller, HttpCode, HttpStatus, Param, Put } from "@nestjs/common";
import { OrderFacade } from "../application/Order.facade";
import { ApiTags } from "@nestjs/swagger";
import { OrderDocs, OrderErrorResponse } from "./swaggerDocs/OrderDocs";

@ApiTags("결제 API")
@Controller("/order")
export class OrderController {
  constructor(private readonly orderFacade: OrderFacade) {}

  @Put("/:reservationTicketId")
  @HttpCode(HttpStatus.OK)
  @OrderDocs()
  @OrderErrorResponse()
  async pay(@Param("reservationTicketId") reservationTicketId: number) {
    this.orderFacade.pay(reservationTicketId);
  }
}
