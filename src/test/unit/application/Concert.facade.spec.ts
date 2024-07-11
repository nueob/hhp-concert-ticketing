import { Test, TestingModule } from "@nestjs/testing";
import { Concert } from "../../../domain/Concert.domain";
import { Performance } from "../../../domain/Performance.domain";
import { ReservationTicket } from "../../../domain/ReservationTicket.domain";
import { ConcertService } from "../../../domain/service/Concert.service";
import { ConcertErrorCodeEnum } from "../../../enum/ConcertErrorCode.enum";
import { ConcertFacade } from "../../../application/Concert.facade";
import { Seat } from "../../../domain/Seat.domain";

describe("ConcertFacade unit test", () => {
  let concertFacade: ConcertFacade;
  let concertService: ConcertService;

  beforeAll(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-07-04 18:00:00"));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertFacade,
        {
          provide: ConcertService,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findByPerformanceId: jest.fn(),
          },
        },
      ],
    }).compile();

    concertFacade = module.get<ConcertFacade>(ConcertFacade);
    concertService = module.get<ConcertService>(ConcertService);
  });

  describe("getAllConcertList: 모든 콘서트 정보를 반환한다.", () => {
    test("정상요청", async () => {
      //given
      const mockConcert = new Concert(1, "테스트 콘서트", [
        new Performance(
          1,
          10,
          new Date("2024-07-01 12:00:00"),
          new Date("2024-06-25 12:00:00"),
          new Date("2024-06-28 12:00:00"),
          [new Seat(1, 1, 1, 1000)],
        ),
      ]);
      concertService.findAll = jest.fn().mockResolvedValue([mockConcert]);
      //when
      const response = await concertFacade.getAllConcertList();
      //then
      expect(response).toStrictEqual([mockConcert]);
      expect(concertService.findAll).toHaveBeenCalled();
    });
  });

  describe("getAvailableDateList: 콘서트 정보를 반환한다.", () => {
    test("정상요청", async () => {
      //given
      const concertId = 1;
      const mockConcert = new Concert(1, "테스트 콘서트", [
        new Performance(
          1,
          10,
          new Date("2024-07-01 12:00:00"),
          new Date("2024-06-25 12:00:00"),
          new Date("2024-06-28 12:00:00"),
          [new Seat(1, 1, 1, 1000)],
        ),
      ]);
      concertService.findById = jest.fn().mockResolvedValue(mockConcert);
      //when
      const response = await concertFacade.getAvailableDateList(concertId);
      //then
      expect(response).toStrictEqual(mockConcert);
      expect(concertService.findById).toHaveBeenCalled();
    });
  });

  describe("getAvailableSeat: 콘서트 예약 가능한 좌석 정보를 반환한다.", () => {
    test("정상 요청", async () => {
      //given
      const concertId = 1;
      const performanceId = 1;
      const mockSeat = new Seat(1, 1, 1, 1000);
      const mockConcert = new Concert(1, "테스트 콘서트", [
        new Performance(
          1,
          10,
          new Date("2024-07-01 12:00:00"),
          new Date("2024-06-25 12:00:00"),
          new Date("2024-06-28 12:00:00"),
          [new Seat(1, 1, 1, 1000)],
        ),
      ]);
      concertService.findById = jest.fn().mockResolvedValue(mockConcert);
      //when
      const response = await concertFacade.getAvailableSeat(
        concertId,
        performanceId,
      );
      //then
      expect(response).toStrictEqual([mockSeat]);
      expect(concertService.findById).toHaveBeenCalled();
    });
    test("비 정상요청, 콘서트 정보가 없을 경우 에러를 던진다.", async () => {
      //given
      const concertId = 1;
      const performanceId = 1;

      concertService.findById = jest.fn().mockResolvedValue({});
      //when
      //then
      await expect(
        concertFacade.getAvailableSeat(concertId, performanceId),
      ).rejects.toThrow(
        new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트_정보.message),
      );
    });
  });

  describe("reservation: 콘서트를 예약한다.", () => {
    test("정상 요청", async () => {
      //given
      const reservationTicket = new ReservationTicket(
        1,
        1,
        1,
        false,
        new Date(),
      );
      const performance = new Performance(
        1,
        10,
        new Date("2024-07-01 12:00:00"),
        new Date("2024-06-25 12:00:00"),
        new Date("2024-06-28 12:00:00"),
        [new Seat(1, 1, 1, 1000)],
      );

      concertService.findPerformanceBySeatId = jest
        .fn()
        .mockResolvedValue(performance);
      performance.isTicketAvailableDate = jest.fn().mockReturnValue(true);
      performance.getAvailableSeat = jest
        .fn()
        .mockReturnValue(Array.from({ length: 10 }));
      concertService.reservation = jest
        .fn()
        .mockResolvedValue(reservationTicket);
      //when
      const response = await concertFacade.reservation(reservationTicket);
      //then
      expect(response).toStrictEqual(reservationTicket);
    });
    test("예약 가능한 시간이 지났을 경우 에러를 던진다.", async () => {
      // given
      const reservationTicket = new ReservationTicket(
        1,
        1,
        1,
        false,
        new Date(),
      );
      const performance = new Performance(
        1,
        10,
        new Date("2024-07-01 12:00:00"),
        new Date("2024-06-25 12:00:00"),
        new Date("2024-06-28 12:00:00"),
        [new Seat(1, 1, 1, 1000)],
      );

      concertService.findPerformanceBySeatId = jest
        .fn()
        .mockResolvedValue(performance);
      performance.isTicketAvailableDate = jest.fn().mockReturnValue(false);
      concertService.reservation = jest
        .fn()
        .mockResolvedValue(reservationTicket);
      //when
      //then
      await expect(
        concertFacade.reservation(reservationTicket),
      ).rejects.toThrow(
        new Error(ConcertErrorCodeEnum.예약_가능한_시간이_지남.message),
      );
    });
    test("신청 가능한 인원이 초과되었을 경우 에러를 던진다.", async () => {
      // given
      const reservationTicket = new ReservationTicket(
        1,
        1,
        1,
        false,
        new Date(),
      );
      const performance = new Performance(
        1,
        10,
        new Date("2024-07-01 12:00:00"),
        new Date("2024-06-25 12:00:00"),
        new Date("2024-06-28 12:00:00"),
        [new Seat(1, 1, 1, 1000)],
      );

      concertService.findPerformanceBySeatId = jest
        .fn()
        .mockResolvedValue(performance);
      performance.isTicketAvailableDate = jest.fn().mockReturnValue(true);
      performance.getAvailableSeat = jest.fn().mockReturnValue([]);
      concertService.reservation = jest
        .fn()
        .mockResolvedValue(reservationTicket);
      //when
      //then
      await expect(
        concertFacade.reservation(reservationTicket),
      ).rejects.toThrow(
        new Error(ConcertErrorCodeEnum.신청_가능한_인원_초과.message),
      );
    });
  });
});
