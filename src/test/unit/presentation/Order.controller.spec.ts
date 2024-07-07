import { OrderFacade } from "../../../application/Order.facade";
import { OrderController } from "../../../presentation/Order.controller";

describe("OrderController unit test", () => {
  let orderController: OrderController;
  let orderFacade: OrderFacade;

  beforeAll(() => {
    orderFacade = new OrderFacade();
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
