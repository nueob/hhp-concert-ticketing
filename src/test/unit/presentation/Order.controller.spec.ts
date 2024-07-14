import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext } from "@nestjs/common";

import { OrderFacade } from "../../../application/Order.facade";
import { OrderController } from "../../../presentation/Order.controller";
import { AuthGuard } from "../../../../libs/guard/Auth.guard";
import { User } from "../../../domain/User.domain";

describe("OrderController unit test", () => {
  let orderController: OrderController;
  let orderFacade: OrderFacade;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderFacade,
          useValue: {
            pay: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => true),
      })
      .compile();

    orderController = module.get<OrderController>(OrderController);
    orderFacade = module.get<OrderFacade>(OrderFacade);
  });

  test("order: 결제를 한다.", async () => {
    //given
    const user = new User();
    const reservationTicketId = 1;
    //when
    await orderController.pay(reservationTicketId, user);
    //then
    expect(orderFacade.pay).toHaveBeenCalled();
  });
});
