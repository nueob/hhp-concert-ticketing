import { OrderService } from "../../../domain/service/Order.service";
import { OrderFacade } from "../../../application/Order.facade";
import { OrderController } from "../../../presentation/Order.controller";
import { ConcertService } from "../../../domain/service/Concert.service";
import { UserService } from "../../../domain/service/User.service";

describe("OrderController unit test", () => {
  let orderController: OrderController;
  let orderFacade: OrderFacade;
  let orderService: OrderService;
  let concertService: ConcertService;
  let userService: UserService;

  beforeAll(() => {
    orderFacade = new OrderFacade(orderService, concertService, userService);
    orderFacade.pay = jest.fn();

    orderController = new OrderController(orderFacade);
  });

  test("order: 결제를 한다.", async () => {
    //given
    const reservationTicketId = 1;
    //when
    await orderController.pay(reservationTicketId);
    //then
    expect(orderFacade.pay).toHaveBeenCalled();
  });
});
