import { Test, TestingModule } from "@nestjs/testing";
import { Concert } from "../../../domain/Concert.domain";
import { Performance } from "../../../domain/Performance.domain";
import { ReservationTicket } from "../../../domain/ReservationTicket.domain";
import { ConcertService } from "../../../domain/service/Concert.service";
import { ConcertErrorCodeEnum } from "../../../enum/ConcertErrorCode.enum";
import { ConcertFacade } from "../../../application/Concert.facade";
import { Seat } from "../../../domain/Seat.domain";
import { OrderFacade } from "../../../application/Order.facade";
import { OrderService } from "../../../domain/service/Order.service";
import { UserService } from "../../../domain/service/User.service";

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
            findAll: jest.fn(),
            findById: jest.fn(),
            findByPerformanceId: jest.fn(),
          },
        },
      ],
    }).compile();

    orderFacade = module.get<OrderFacade>(OrderFacade);
    orderService = module.get<OrderService>(OrderService);
    concertService = module.get<ConcertService>(ConcertService);
  });

  describe("pay: 콘서트 예약 티켓을 결제한다.", () => {
    test("정상요청", async () => {
      //given
      const reservationTicketId = 1;
      const seatId = 1;
      const resetvationTicket = new ReservationTicket(1, null, seatId);
      resetvationTicket.validTicket = jest.fn().mockReturnValue(true);

      jest
        .spyOn(orderService, "findReservationById")
        .mockResolvedValue(resetvationTicket);

      const concert = new Concert(null, null, [
        new Performance(null, null, null, null, null, [
          new Seat(seatId, null, null, null),
        ]),
      ]);

      jest.spyOn(concertService, "findBySeatId").mockResolvedValue(concert);
      //when
      await orderFacade.pay(reservationTicketId);
      //then
      expect(orderService.createOrderTicket).toHaveBeenCalled();
      expect(orderService.isFinishedReservation).toHaveBeenCalled();
    });
  });
});
