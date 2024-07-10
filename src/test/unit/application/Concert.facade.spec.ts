import { ConcertFacade } from "../../../application/Concert.facade";
import { ConcertUsecase } from "../../../application/useCase/interface/Concert.usecase.interface";
import { ConcertUseCaseStub } from "./stub/Concert.usecase.stub";
import { Concert } from "../../../domain/Concert.domain";
import { ReservationTicket } from "../../../domain/ReservationTicket.domain";

describe("ConcertFacade Application unit test", () => {
  let concertFacade: ConcertFacade;
  let concertUsecase: ConcertUsecase;

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime();

    concertUsecase = new ConcertUseCaseStub();
    concertFacade = new ConcertFacade(concertUsecase);
  });

  test("getAllConcertList: 전체 콘서트를 반환한다.", async () => {
    //given
    //when
    const response = await concertFacade.getAllConcertList();
    //then
    expect(response).toBeInstanceOf(Array);
    response.forEach((res) => expect(res).toBeInstanceOf(Concert));
  });

  test("getAvailableDateList: 예약 가능한 날짜 리스트를 반환한다.", async () => {
    //given
    const concertId = 1;
    //when
    const response = await concertFacade.getAvailableDateList(concertId);
    //then
    expect(response).toBeInstanceOf(Array);
    response.forEach((res) => expect(res).toBeInstanceOf(Concert));
  });

  test("getAvailableSeatCount: 예약 가능한 좌석 수를 반환한다.", async () => {
    //given
    const concertId = 1;
    const performanceId = 1;
    //when
    const response = await concertFacade.getAvailableSeatCount(
      concertId,
      performanceId,
    );
    //then
    expect(response).toBe(1);
  });

  test("reservation: 좌석을 예약한다.", async () => {
    //given
    const reservationTicket = new ReservationTicket(
      1,
      1,
      1,
      1,
      false,
      new Date(),
    );
    //when
    const response = await concertFacade.reservation(reservationTicket);
    //then
    expect(response).toStrictEqual(reservationTicket);
  });
});
