import { Controller, HttpCode, HttpStatus, Param, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrderFacade } from "../application/Order.facade";
import { OrderDocs, OrderErrorResponse } from "./swaggerDocs/OrderDocs";
import { UserAuth } from "../decorator/UserAuth";

@ApiTags("결제 API")
@Controller("/order")
export class OrderController {
  constructor(private readonly orderFacade: OrderFacade) {}

  @UserAuth()
  @Put("/:reservationTicketId")
  @HttpCode(HttpStatus.OK)
  @OrderDocs()
  @OrderErrorResponse()
  async pay(@Param("reservationTicketId") reservationTicketId: number) {
    this.orderFacade.pay(reservationTicketId);
  }
}
