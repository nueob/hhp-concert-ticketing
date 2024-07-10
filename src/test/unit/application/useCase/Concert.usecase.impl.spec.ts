import { Test, TestingModule } from "@nestjs/testing";
import { ConcertUseCaseImpl } from "../../../../application/useCase/Concert.usecase.impl";
import { Concert } from "../../../../domain/Concert.domain";
import { Performance } from "../../../../domain/Performance.domain";
import { ReservationTicket } from "../../../../domain/ReservationTicket.domain";
import { ConcertService } from "../../../../domain/service/Concert.service";
import { ConcertErrorCodeEnum } from "../../../../enum/ConcertErrorCode.enum";

describe("ConcertUseCaseImpl unit test", () => {
  let concertUseCaseImpl: ConcertUseCaseImpl;
  let concertService: ConcertService;

  beforeAll(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-07-04 18:00:00"));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertUseCaseImpl,
        {
          provide: ConcertService,
          useValue: {
            findAll: jest
              .fn()
              .mockResolvedValue([
                new Concert(
                  1,
                  "테스트 콘서트",
                  new Performance(
                    1,
                    10,
                    new Date("2024-07-11 18:00:00"),
                    new Date("2024-07-01 18:00:00"),
                    new Date("2024-07-05 18:00:00"),
                    [
                      new ReservationTicket(1, 1, 1, 1, true, new Date()),
                      new ReservationTicket(1, 1, 1, 2, true, new Date()),
                      new ReservationTicket(1, 1, 1, 3, true, new Date()),
                      new ReservationTicket(1, 1, 1, 4, true, new Date()),
                      new ReservationTicket(1, 1, 1, 5, true, new Date()),
                      new ReservationTicket(1, 1, 1, 6, false, new Date()),
                      new ReservationTicket(1, 1, 1, 7, false, new Date()),
                      new ReservationTicket(1, 1, 1, 8, false, new Date()),
                    ],
                  ),
                ),
              ]),
            findById: jest.fn((concertId) => {
              return new Map([
                [
                  1,
                  [
                    new Concert(
                      1,
                      "테스트 콘서트",
                      new Performance(
                        1,
                        10,
                        new Date("2024-07-11 18:00:00"),
                        new Date("2024-07-01 18:00:00"),
                        new Date("2024-07-05 18:00:00"),
                        [
                          new ReservationTicket(1, 1, 1, 1, true, new Date()),
                          new ReservationTicket(1, 1, 1, 2, true, new Date()),
                          new ReservationTicket(1, 1, 1, 3, true, new Date()),
                          new ReservationTicket(1, 1, 1, 4, true, new Date()),
                          new ReservationTicket(1, 1, 1, 5, true, new Date()),
                          new ReservationTicket(1, 1, 1, 6, false, new Date()),
                          new ReservationTicket(1, 1, 1, 7, false, new Date()),
                          new ReservationTicket(1, 1, 1, 8, false, new Date()),
                        ],
                      ),
                    ),
                  ],
                ],
              ]).get(concertId);
            }),
            findByPerformanceId: jest.fn(),
          },
        },
      ],
    }).compile();

    concertUseCaseImpl = module.get<ConcertUseCaseImpl>(ConcertUseCaseImpl);
    concertService = module.get<ConcertService>(ConcertService);
  });

  describe("findAll: 모든 콘서트 정보를 반환한다.", () => {
    test("정상요청", async () => {
      //given
      //when
      const response = await concertUseCaseImpl.findAll();
      //then
      expect(response).toStrictEqual([
        new Concert(
          1,
          "테스트 콘서트",
          new Performance(
            1,
            10,
            new Date("2024-07-11 18:00:00"),
            new Date("2024-07-01 18:00:00"),
            new Date("2024-07-05 18:00:00"),
            [
              new ReservationTicket(1, 1, 1, 1, true, new Date()),
              new ReservationTicket(1, 1, 1, 2, true, new Date()),
              new ReservationTicket(1, 1, 1, 3, true, new Date()),
              new ReservationTicket(1, 1, 1, 4, true, new Date()),
              new ReservationTicket(1, 1, 1, 5, true, new Date()),
              new ReservationTicket(1, 1, 1, 6, false, new Date()),
              new ReservationTicket(1, 1, 1, 7, false, new Date()),
              new ReservationTicket(1, 1, 1, 8, false, new Date()),
            ],
          ),
        ),
      ]);
      expect(concertService.findAll).toHaveBeenCalled();
    });
  });

  describe("findConcertById: 콘서트 정보를 반환한다.", () => {
    test("정상요청", async () => {
      //given
      const concertId = 1;
      //when
      const response = await concertUseCaseImpl.findConcertById(concertId);
      //then
      expect(response).toStrictEqual([
        new Concert(
          1,
          "테스트 콘서트",
          new Performance(
            1,
            10,
            new Date("2024-07-11 18:00:00"),
            new Date("2024-07-01 18:00:00"),
            new Date("2024-07-05 18:00:00"),
            [
              new ReservationTicket(1, 1, 1, 1, true, new Date()),
              new ReservationTicket(1, 1, 1, 2, true, new Date()),
              new ReservationTicket(1, 1, 1, 3, true, new Date()),
              new ReservationTicket(1, 1, 1, 4, true, new Date()),
              new ReservationTicket(1, 1, 1, 5, true, new Date()),
              new ReservationTicket(1, 1, 1, 6, false, new Date()),
              new ReservationTicket(1, 1, 1, 7, false, new Date()),
              new ReservationTicket(1, 1, 1, 8, false, new Date()),
            ],
          ),
        ),
      ]);
      expect(concertService.findById).toHaveBeenCalled();
    });
  });

  describe("findAvailableSeatCount: 콘서트 예약 가능한 좌석 정보를 반환한다.", () => {
    test("정상 요청", async () => {
      //given
      const concertId = 1;
      const performanceId = 1;
      //when
      const response = await concertUseCaseImpl.findAvailableSeatCount(
        concertId,
        performanceId,
      );
      //then
      expect(response).toBe(2);
      expect(concertService.findById).toHaveBeenCalled();
    });
    test("비 정상요청, 콘서트가 없을 경우 에러를 던진다.", async () => {
      //given
      const concertId = 2;
      const performanceId = 1;
      //when
      //then
      await expect(
        concertUseCaseImpl.findAvailableSeatCount(concertId, performanceId),
      ).rejects.toThrow(
        new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트.message),
      );
    });
    test("비 정상요청, 콘서트 정보가 없을 경우 에러를 던진다.", async () => {
      //given
      const concertId = 1;
      const performanceId = 2;
      //when
      //then
      await expect(
        concertUseCaseImpl.findAvailableSeatCount(concertId, performanceId),
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
        1,
        false,
        new Date(),
      );

      const concert = new Concert(
        1,
        "테스트 콘서트",
        new Performance(
          1,
          10,
          new Date("2024-07-11 18:00:00"),
          new Date("2024-07-01 18:00:00"),
          new Date("2024-07-05 18:00:00"),
          [new ReservationTicket(1, 1, 1, 1, true, new Date())],
        ),
      );

      concertService.findByPerformanceId = jest.fn().mockResolvedValue(concert);
      concert.performance.isTicketAvailableDate = jest
        .fn()
        .mockReturnValue(true);
      concert.performance.getAvailableSeatCount = jest.fn().mockReturnValue(1);
      concertService.reservation = jest
        .fn()
        .mockResolvedValue(reservationTicket);
      //when
      const response = await concertUseCaseImpl.reservation(reservationTicket);
      //then
      expect(response).toStrictEqual(reservationTicket);
    });
    test("존재하지 않는 콘서트일 경우 에러를 던진다.", async () => {
      // given
      const reservationTicket = new ReservationTicket(
        1,
        1,
        1,
        1,
        false,
        new Date(),
      );
      concertService.findByPerformanceId = jest.fn().mockResolvedValue(null);
      //when
      //then
      await expect(
        concertUseCaseImpl.reservation(reservationTicket),
      ).rejects.toThrow(
        new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트.message),
      );
    });
    test("예약 가능한 시간이 지났을 경우 에러를 던진다.", async () => {
      // given
      const reservationTicket = new ReservationTicket(
        1,
        1,
        1,
        1,
        false,
        new Date(),
      );
      const concert = new Concert(
        1,
        "테스트 콘서트",
        new Performance(
          1,
          10,
          new Date("2024-07-11 18:00:00"),
          new Date("2024-07-01 18:00:00"),
          new Date("2024-07-05 18:00:00"),
          [new ReservationTicket(1, 1, 1, 1, true, new Date())],
        ),
      );

      concertService.findByPerformanceId = jest.fn().mockResolvedValue(concert);
      concert.performance.isTicketAvailableDate = jest
        .fn()
        .mockReturnValue(false);
      concertService.reservation = jest
        .fn()
        .mockResolvedValue(reservationTicket);
      await expect(
        concertUseCaseImpl.reservation(reservationTicket),
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
        1,
        false,
        new Date(),
      );
      const concert = new Concert(
        1,
        "테스트 콘서트",
        new Performance(
          1,
          1,
          new Date("2024-07-11 18:00:00"),
          new Date("2024-07-01 18:00:00"),
          new Date("2024-07-05 18:00:00"),
          [new ReservationTicket(1, 1, 1, 1, true, new Date())],
        ),
      );

      concertService.findByPerformanceId = jest.fn().mockResolvedValue(concert);
      concert.performance.isTicketAvailableDate = jest
        .fn()
        .mockReturnValue(true);
      concert.performance.getAvailableSeatCount = jest.fn().mockReturnValue(0);
      concertService.reservation = jest
        .fn()
        .mockResolvedValue(reservationTicket);
      //when
      //then
      await expect(
        concertUseCaseImpl.reservation(reservationTicket),
      ).rejects.toThrow(
        new Error(ConcertErrorCodeEnum.신청_가능한_인원_초과.message),
      );
    });
  });
});
