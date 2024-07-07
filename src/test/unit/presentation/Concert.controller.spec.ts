import { ConcertController } from "../../../presentation/Concert.controller";
import { ConcertFacade } from "../../../application/Concert.facade";
import { FindReservationAvailableDateResponseDTO } from "../../../presentation/dto/res/FindReservationAvailableDate.res.dto";
import { FindReservationAvailableSeatResponseDTO } from "../../../presentation/dto/res/FindReservationAvailableSeat.res.dto";
import { Concert } from "../../../domain/Concert.domain";
import { FindAllConcertListResponseDTO } from "../../../presentation/dto/res/FindAllConcertList.dto";
import { ReservationTicket } from "../../../domain/ReservationTicket.domain";
import { ReservationConcertRequestDTO } from "../../../presentation/dto/req/ReservationConcert.req.dto";
import { ReservationConcertResponseDTO } from "../../../presentation/dto/res/ReservationConcert.res.dto";

describe("ConcertController Unit Test", () => {
  let concertController: ConcertController;
  let concertFacade: ConcertFacade;

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime();

    concertFacade = new ConcertFacade();
    concertFacade.getAllConcertList = jest
      .fn()
      .mockResolvedValue(Promise.resolve([new Concert()]));
    concertFacade.getAvailableDateList = jest
      .fn()
      .mockResolvedValue(Promise.resolve([new Concert()]));
    concertFacade.getAvailableSeatCount = jest
      .fn()
      .mockResolvedValue(Promise.resolve(1));
    concertFacade.reservation = jest
      .fn()
      .mockResolvedValue(
        new ReservationTicket(null, 1, 1, 1, false, new Date()),
      );
    concertController = new ConcertController(concertFacade);
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
    expect(response).toBeInstanceOf(Array);
    response.forEach((res) =>
      expect(res).toBeInstanceOf(FindReservationAvailableDateResponseDTO),
    );
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
    expect(response).toStrictEqual(
      new FindReservationAvailableSeatResponseDTO(1),
    );
    expect(concertFacade.getAvailableSeatCount).toHaveBeenCalled();
  });

  test("reservation: 좌석을 예약한다.", async () => {
    //given
    const performanceId = 1;
    const seatId = 1;
    //when
    const response = await concertController.reservation(
      new ReservationConcertRequestDTO(performanceId, seatId),
    );
    //then
    expect(response).toStrictEqual(
      new ReservationConcertResponseDTO(
        new ReservationTicket(null, 1, 1, 1, false, new Date()),
      ),
    );
    expect(concertFacade.reservation).toHaveBeenCalled();
  });
});
