import {
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { OrderDocs, OrderErrorResponse } from "./swaggerDocs/OrderDocs";

import { OrderFacade } from "../application/Order.facade";
import { User } from "../domain/User.domain";

import { UserAuth } from "../../libs/decorator/UserAuth";
import { ReqUser } from "../../libs/decorator/ReqUser";

@ApiTags("결제 API")
@Controller("/order")
export class OrderController {
  constructor(private readonly orderFacade: OrderFacade) {}

  private readonly logger = new Logger(OrderController.name);

  @UserAuth()
  @Put("/:reservationTicketId")
  @HttpCode(HttpStatus.OK)
  @OrderDocs()
  @OrderErrorResponse()
  async pay(
    @Param("reservationTicketId") reservationTicketId: number,
    @ReqUser() user: User,
  ) {
    this.logger.debug(
      "주문 결제 : " + JSON.stringify({ reservationTicketId, user }),
    );

    this.orderFacade.pay(user.uuid, reservationTicketId);
  }
}
