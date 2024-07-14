import { Test, TestingModule } from "@nestjs/testing";
import { ExecutionContext } from "@nestjs/common";
import { ConcertController } from "../../../presentation/Concert.controller";
import { ConcertFacade } from "../../../application/Concert.facade";
import { FindReservationAvailableDateResponseDTO } from "../../../presentation/dto/res/FindReservationAvailableDate.res.dto";
import { FindReservationAvailableSeatResponseDTO } from "../../../presentation/dto/res/FindReservationAvailableSeat.res.dto";
import { Concert } from "../../../domain/Concert.domain";
import { FindAllConcertListResponseDTO } from "../../../presentation/dto/res/FindAllConcertList.dto";
import { ReservationTicket } from "../../../domain/ReservationTicket.domain";
import { ReservationConcertRequestDTO } from "../../../presentation/dto/req/ReservationConcert.req.dto";
import { ReservationConcertResponseDTO } from "../../../presentation/dto/res/ReservationConcert.res.dto";
import { User } from "../../../domain/User.domain";
import { AuthGuard } from "../../../../libs/guard/Auth.guard";

describe("ConcertController Unit Test", () => {
  let concertController: ConcertController;
  let concertFacade: ConcertFacade;

  beforeAll(async () => {
    jest.useFakeTimers();
    jest.setSystemTime();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertController],
      providers: [
        {
          provide: ConcertFacade,
          useValue: {
            getAllConcertList: jest
              .fn()
              .mockResolvedValue(Promise.resolve([new Concert()])),
            getAvailableDateList: jest
              .fn()
              .mockResolvedValue(Promise.resolve([new Concert()])),
            getAvailableSeat: jest
              .fn()
              .mockResolvedValue(Promise.resolve([{}])),
            reservation: jest
              .fn()
              .mockResolvedValue(
                new ReservationTicket(null, "0001", 1, false, new Date()),
              ),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn((context: ExecutionContext) => true),
      })
      .compile();

    concertController = module.get<ConcertController>(ConcertController);
    concertFacade = module.get<ConcertFacade>(ConcertFacade);
  });

  test("findAll: 전체 콘서트를 조회한다.", async () => {
    //given
    //when
    const response = await concertController.findAll();
    //then
    expect(response).toBeInstanceOf(Array);
    response.forEach((res) =>
      expect(res).toBeInstanceOf(FindAllConcertListResponseDTO),
    );
    expect(concertFacade.getAllConcertList).toHaveBeenCalled();
  });

  test("findReservationAvailableDate: 예약 가능한 날짜를 조회한다.", async () => {
    //given
    const concertId = 1;
    //when
    const response =
      await concertController.findReservationAvailableDate(concertId);
    //then
    expect(response).toBeInstanceOf(FindReservationAvailableDateResponseDTO);
    expect(concertFacade.getAvailableDateList).toHaveBeenCalled();
  });

  test("findReservationAvailableSeat: 예약 가능한 좌석정보를 조회한다.", async () => {
    //given
    const concertId = 1;
    const concertTicketingInfoId = 1;
    //when
    const response = await concertController.findReservationAvailableSeat(
      concertId,
      concertTicketingInfoId,
    );
    //then
    expect(response).toBeInstanceOf(Array);
    response.forEach((res) =>
      expect(res).toBeInstanceOf(FindReservationAvailableSeatResponseDTO),
    );
    expect(concertFacade.getAvailableSeat).toHaveBeenCalled();
  });

  test("reservation: 좌석을 예약한다.", async () => {
    //given
    const seatId = 1;
    const user = new User("0001");
    //when
    const response = await concertController.reservation(
      new ReservationConcertRequestDTO(seatId),
      user,
    );
    //then
    expect(response).toStrictEqual(
      new ReservationConcertResponseDTO(
        new ReservationTicket(null, "0001", 1, false, new Date()),
      ),
    );
    expect(concertFacade.reservation).toHaveBeenCalled();
  });
});
