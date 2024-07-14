import { Test, TestingModule } from "@nestjs/testing";
import { Concert } from "../../../domain/Concert.domain";
import { Performance } from "../../../domain/Performance.domain";
import { ReservationTicket } from "../../../domain/ReservationTicket.domain";
import { ConcertService } from "../../../domain/service/Concert.service";
import { ConcertErrorCodeEnum } from "../../../enum/ConcertErrorCode.enum";
import { ConcertFacade } from "../../../application/Concert.facade";
import { Seat } from "../../../domain/Seat.domain";
import { ConcertRepositoryInterface } from "../../../domain/repository/Concert.repository.interface";
import { UserService } from "../../../domain/service/User.service";
import { UserRepositoryInterface } from "../../../domain/repository/User.repository.interface";
import { User } from "../../../domain/User.domain";

describe("ConcertFacade integration test", () => {
  let concertFacade: ConcertFacade;
  let concertRepositoryInterface: ConcertRepositoryInterface;
  let userRepositoryInterface: UserRepositoryInterface;

  beforeAll(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-07-04 18:00:00"));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertFacade,
        ConcertService,
        UserService,
        {
          provide: "ConcertRepositoryInterface",
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findPerformanceBySeatId: jest.fn(),
            saveReservationTicket: jest.fn(),
          },
        },
        {
          provide: "UserRepositoryInterface",
          useValue: {
            findByUuid: jest.fn(),
          },
        },
      ],
    }).compile();

    concertFacade = module.get<ConcertFacade>(ConcertFacade);
    concertRepositoryInterface = module.get<ConcertRepositoryInterface>(
      "ConcertRepositoryInterface",
    );
    userRepositoryInterface = module.get<UserRepositoryInterface>(
      "UserRepositoryInterface",
    );
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
      concertRepositoryInterface.findAll = jest
        .fn()
        .mockResolvedValue([mockConcert]);
      //when
      const response = await concertFacade.getAllConcertList();
      //then
      expect(response).toStrictEqual([mockConcert]);
      expect(concertRepositoryInterface.findAll).toHaveBeenCalled();
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
      concertRepositoryInterface.findById = jest
        .fn()
        .mockResolvedValue(mockConcert);
      //when
      const response = await concertFacade.getAvailableDateList(concertId);
      //then
      expect(response).toStrictEqual(mockConcert);
      expect(concertRepositoryInterface.findById).toHaveBeenCalled();
    });
    test("콘서트가 없는 경우 error를 반환한다.", async () => {
      //given
      const concertId = 1;
      concertRepositoryInterface.findById = jest.fn().mockResolvedValue(null);
      //when
      //then
      await expect(
        concertFacade.getAvailableDateList(concertId),
      ).rejects.toThrow(
        new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트.message),
      );
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
      concertRepositoryInterface.findById = jest
        .fn()
        .mockResolvedValue(mockConcert);
      //when
      const response = await concertFacade.getAvailableSeat(
        concertId,
        performanceId,
      );
      //then
      expect(response).toStrictEqual([mockSeat]);
      expect(concertRepositoryInterface.findById).toHaveBeenCalled();
    });
    test("비 정상요청, 콘서트가 없을 경우 에러를 던진다.", async () => {
      //given
      const concertId = 1;
      const performanceId = 1;

      concertRepositoryInterface.findById = jest.fn().mockResolvedValue(null);
      //when
      //then
      await expect(
        concertFacade.getAvailableSeat(concertId, performanceId),
      ).rejects.toThrow(
        new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트.message),
      );
    });
    test("비 정상요청, 콘서트 정보가 없을 경우 에러를 던진다.", async () => {
      //given
      const concertId = 1;
      const performanceId = 1;

      concertRepositoryInterface.findById = jest
        .fn()
        .mockResolvedValue({ performanceList: null });
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
      const user = new User();
      user.isActive = jest.fn().mockReturnValue(true);

      const reservationTicket = new ReservationTicket(
        1,
        "0001",
        1,
        false,
        new Date(),
      );
      const performance = new Performance(
        1,
        10,
        new Date("2024-07-01 12:00:00"),
        new Date("2024-06-25 12:00:00"),
        new Date("2024-08-09 12:00:00"),
        [new Seat(1, 1, 1, 1000)],
      );

      userRepositoryInterface.findByUuid = jest.fn().mockResolvedValue(user);
      concertRepositoryInterface.findPerformanceBySeatId = jest
        .fn()
        .mockResolvedValue(performance);
      concertRepositoryInterface.saveReservationTicket = jest
        .fn()
        .mockResolvedValue(reservationTicket);
      //when
      const response = await concertFacade.reservation(reservationTicket);
      //then
      expect(response).toStrictEqual(reservationTicket);
      expect(
        concertRepositoryInterface.findPerformanceBySeatId,
      ).toHaveBeenCalled();
      expect(
        concertRepositoryInterface.saveReservationTicket,
      ).toHaveBeenCalled();
    });
    test("사용자 대기열이 활성화가 아닐 경우 에러를 던진다.", async () => {
      //given
      const user = new User();
      user.isActive = jest.fn().mockReturnValue(false);

      const reservationTicket = new ReservationTicket(
        1,
        "0001",
        1,
        false,
        new Date(),
      );

      userRepositoryInterface.findByUuid = jest.fn().mockResolvedValue(user);
      //when
      //then
      await expect(
        concertFacade.reservation(reservationTicket),
      ).rejects.toThrow(
        new Error(ConcertErrorCodeEnum.예약할수_없는_상태.message),
      );
    });
    test("예약 가능한 시간이 지났을 경우 에러를 던진다.", async () => {
      // given
      const user = new User();
      user.isActive = jest.fn().mockReturnValue(true);

      const reservationTicket = new ReservationTicket(
        1,
        "0001",
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

      userRepositoryInterface.findByUuid = jest.fn().mockResolvedValue(user);
      concertRepositoryInterface.findPerformanceBySeatId = jest
        .fn()
        .mockResolvedValue(performance);
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
      const user = new User();
      user.isActive = jest.fn().mockReturnValue(true);

      const reservationTicket = new ReservationTicket(
        1,
        "0001",
        1,
        false,
        new Date(),
      );
      const performance = new Performance(
        1,
        1,
        new Date("2024-07-01 12:00:00"),
        new Date("2024-06-25 12:00:00"),
        new Date("2024-09-01 12:00:00"),
        [
          new Seat(
            1,
            1,
            1,
            1000,
            new ReservationTicket(1, "0001", 1, true, new Date()),
          ),
        ],
      );

      userRepositoryInterface.findByUuid = jest.fn().mockResolvedValue(user);
      concertRepositoryInterface.findPerformanceBySeatId = jest
        .fn()
        .mockResolvedValue(performance);
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
