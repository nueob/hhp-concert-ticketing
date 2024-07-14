import { Test, TestingModule } from "@nestjs/testing";
import { ReservationTicket } from "../../../../domain/ReservationTicket.domain";
import { OrderService } from "../../../../domain/service/Order.service";
import { OrderRepositoryInterface } from "../../../../domain/repository/Order.repository.interface";
import { OrderErrorCodeEnum } from "../../../../enum/OrderErrorCode.enum";
import { OrderTicket } from "../../../../domain/OrderTicket.domain";

describe("OrderService unit test", () => {
  let orderService: OrderService;
  let orderRepositoryInterface: OrderRepositoryInterface;

  beforeAll(async () => {
    jest.useFakeTimers();
    jest.setSystemTime();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: "OrderRepositoryInterface",
          useValue: {
            findReservationById: jest.fn(),
            isFinishedReservation: jest.fn(),
            createOrderTicket: jest.fn(),
          },
        },
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    orderRepositoryInterface = module.get<OrderRepositoryInterface>(
      "OrderRepositoryInterface",
    );
  });

  describe("findReservationById: 예약 정보를 불러온다.", () => {
    test("정상 요청", async () => {
      //given
      const reservationTicketId = 1;
      const reservationTicket = new ReservationTicket(reservationTicketId);
      jest
        .spyOn(orderRepositoryInterface, "findReservationById")
        .mockResolvedValue(reservationTicket);
      //when
      const response =
        await orderService.findReservationById(reservationTicketId);
      //then
      expect(response).toEqual(reservationTicket);
      expect(orderRepositoryInterface.findReservationById).toHaveBeenCalled();
    });
    test("예약 정보가 없을 경우 에러를 반환한다.", async () => {
      //given
      const reservationTicketId = 1;
      jest
        .spyOn(orderRepositoryInterface, "findReservationById")
        .mockResolvedValue(null);
      //when
      //then
      await expect(
        orderService.findReservationById(reservationTicketId),
      ).rejects.toThrow(
        new Error(OrderErrorCodeEnum.존재하지_않는_예약.message),
      );
    });
  });

  describe("isFinishedReservation: 예약을 확정한다.", () => {
    test("정상 요청", async () => {
      //given
      const reservationTicketId = 1;
      //when
      await orderService.isFinishedReservation(reservationTicketId);
      //then
      expect(orderRepositoryInterface.isFinishedReservation).toHaveBeenCalled();
    });
  });

  describe("createOrderTicket: 결제를 정보를 생성한다.", () => {
    test("정상 요청", async () => {
      //given
      const orderTicket = new OrderTicket();
      jest
        .spyOn(orderRepositoryInterface, "createOrderTicket")
        .mockResolvedValue(orderTicket);
      //when
      const response = await orderService.createOrderTicket(orderTicket);
      //then
      expect(response).toEqual(orderTicket);
      expect(orderRepositoryInterface.createOrderTicket).toHaveBeenCalled();
    });
  });
});
