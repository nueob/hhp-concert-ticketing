import { Test, TestingModule } from "@nestjs/testing";
import { ConcertService } from "../../../../domain/service/Concert.service";
import { ConcertRepositoryInterface } from "../../../../domain/repository/Concert.repository.interface";
import { Concert } from "../../../../domain/Concert.domain";
import { Performance } from "../../../../domain/Performance.domain";
import { ConcertErrorCodeEnum } from "../../../../enum/ConcertErrorCode.enum";
import { ReservationTicket } from "../../../../domain/ReservationTicket.domain";

describe("ConcertService unit test", () => {
  let concertService: ConcertService;
  let concertRepositoryInterface: ConcertRepositoryInterface;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertService,
        {
          provide: "ConcertRepositoryInterface",
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findPerformanceBySeatId: jest.fn(),
            saveReservationTicket: jest.fn(),
          },
        },
      ],
    }).compile();

    concertService = module.get<ConcertService>(ConcertService);
    concertRepositoryInterface = module.get<ConcertRepositoryInterface>(
      "ConcertRepositoryInterface",
    );
  });

  describe("findAll: 모든 콘서트를 반환한다.", () => {
    test("정상 요청", async () => {
      //given
      const concert = new Concert();
      jest
        .spyOn(concertRepositoryInterface, "findAll")
        .mockResolvedValue([concert]);
      //when
      const response = await concertService.findAll();
      //then
      expect(response).toEqual([concert]);
      expect(concertRepositoryInterface.findAll).toHaveBeenCalled();
    });
  });

  describe("findById: 특정 콘서트를 반환한다.", () => {
    test("정상 요청", async () => {
      //given
      const concertId = 1;
      const concert = new Concert();
      jest
        .spyOn(concertRepositoryInterface, "findById")
        .mockResolvedValue(concert);
      //when
      const response = await concertService.findById(concertId);
      //then
      expect(response).toStrictEqual(concert);
      expect(concertRepositoryInterface.findById).toHaveBeenCalled();
    });
  });

  describe("findPerformanceBySeatId: 좌석 정보를 이용하여 특정 공연을 반환한다.", () => {
    test("정상 요청", async () => {
      //given
      const seatId = 1;
      const performance = new Performance();
      jest
        .spyOn(concertRepositoryInterface, "findPerformanceBySeatId")
        .mockResolvedValue(performance);
      //when
      const response = await concertService.findPerformanceBySeatId(seatId);
      //then
      expect(response).toStrictEqual(performance);
      expect(
        concertRepositoryInterface.findPerformanceBySeatId,
      ).toHaveBeenCalled();
    });
    test("공연이 없을 경우 에러를 던진다.", async () => {
      //given
      const seatId = 1;
      jest
        .spyOn(concertRepositoryInterface, "findPerformanceBySeatId")
        .mockResolvedValue(null);
      //when
      //then
      await expect(
        concertService.findPerformanceBySeatId(seatId),
      ).rejects.toThrow(
        new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트.message),
      );
      expect(
        concertRepositoryInterface.findPerformanceBySeatId,
      ).toHaveBeenCalled();
    });
  });

  describe("reservation: 콘서트를 예약한다.", () => {
    test("정상 요청", async () => {
      //given
      const reservationTicket = new ReservationTicket();
      jest
        .spyOn(concertRepositoryInterface, "saveReservationTicket")
        .mockResolvedValue(reservationTicket);
      //when
      const response = await concertService.reservation(reservationTicket);
      //then
      expect(response).toStrictEqual(reservationTicket);
      expect(
        concertRepositoryInterface.saveReservationTicket,
      ).toHaveBeenCalled();
    });
  });
});
