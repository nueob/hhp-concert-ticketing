import { Test, TestingModule } from "@nestjs/testing";
import { Concert } from "../../../domain/Concert.domain";
import { Performance } from "../../../domain/Performance.domain";
import { ReservationTicket } from "../../../domain/ReservationTicket.domain";
import { ConcertService } from "../../../domain/service/Concert.service";
import { Seat } from "../../../domain/Seat.domain";
import { OrderFacade } from "../../../application/Order.facade";
import { OrderService } from "../../../domain/service/Order.service";
import { UserService } from "../../../domain/service/User.service";
import { User } from "../../../domain/User.domain";
import { OrderErrorCodeEnum } from "../../../enum/OrderErrorCode.enum";

describe("OrderFacade unit test", () => {
  let orderFacade: OrderFacade;
  let orderService: OrderService;
  let concertService: ConcertService;
  let userService: UserService;

  beforeAll(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-07-04 18:00:00"));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderFacade,
        {
          provide: OrderService,
          useValue: {
            findReservationById: jest.fn(),
            createOrderTicket: jest.fn(),
            isFinishedReservation: jest.fn(),
          },
        },
        {
          provide: ConcertService,
          useValue: {
            findBySeatId: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByUuid: jest.fn(),
            usePoint: jest.fn(),
            insertPointHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    orderFacade = module.get<OrderFacade>(OrderFacade);
    orderService = module.get<OrderService>(OrderService);
    concertService = module.get<ConcertService>(ConcertService);
    userService = module.get<UserService>(UserService);
  });

  describe("pay: 콘서트 예약 티켓을 결제한다.", () => {
    test("정상요청", async () => {
      //given
      const uuid = "0001";
      const reservationTicketId = 1;
      const seatId = 1;

      const resetvationTicket = new ReservationTicket(1, null, seatId);
      resetvationTicket.validTicket = jest.fn().mockReturnValue(true);

      jest
        .spyOn(userService, "findByUuid")
        .mockResolvedValue(new User(uuid, 1000));

      jest
        .spyOn(orderService, "findReservationById")
        .mockResolvedValue(resetvationTicket);

      const concert = new Concert(null, null, [
        new Performance(null, null, null, null, null, [
          new Seat(seatId, null, null, 500),
        ]),
      ]);

      jest.spyOn(concertService, "findBySeatId").mockResolvedValue(concert);
      //when
      await orderFacade.pay(uuid, reservationTicketId);
      //then
      expect(orderService.createOrderTicket).toHaveBeenCalled();
      expect(orderService.isFinishedReservation).toHaveBeenCalled();
      expect(userService.usePoint).toHaveBeenCalled();
      expect(userService.insertPointHistory).toHaveBeenCalled();
    });
    test("결제 가능한 시간이 초과 했을 경우 에러를 던진다", async () => {
      //given
      const uuid = "0001";
      const reservationTicketId = 1;
      const seatId = 1;

      const resetvationTicket = new ReservationTicket(1, null, seatId);
      resetvationTicket.validTicket = jest.fn().mockReturnValue(false);

      jest
        .spyOn(userService, "findByUuid")
        .mockResolvedValue(new User(uuid, 1000));

      jest
        .spyOn(orderService, "findReservationById")
        .mockResolvedValue(resetvationTicket);

      //when
      //then
      await expect(orderFacade.pay(uuid, reservationTicketId)).rejects.toThrow(
        new Error(OrderErrorCodeEnum.결제_가능한_시간_초과.message),
      );
    });
    test("잔액이 부족할 경우 에러를 던진다.", async () => {
      //given
      const uuid = "0001";
      const reservationTicketId = 1;
      const seatId = 1;

      const resetvationTicket = new ReservationTicket(1, null, seatId);
      resetvationTicket.validTicket = jest.fn().mockReturnValue(true);

      jest
        .spyOn(userService, "findByUuid")
        .mockResolvedValue(new User(uuid, 1000));

      jest
        .spyOn(orderService, "findReservationById")
        .mockResolvedValue(resetvationTicket);

      const concert = new Concert(null, null, [
        new Performance(null, null, null, null, null, [
          new Seat(seatId, null, null, 2000),
        ]),
      ]);

      jest.spyOn(concertService, "findBySeatId").mockResolvedValue(concert);
      //when
      //then
      await expect(orderFacade.pay(uuid, reservationTicketId)).rejects.toThrow(
        new Error(OrderErrorCodeEnum.잔액_부족.message),
      );
    });
  });
});
