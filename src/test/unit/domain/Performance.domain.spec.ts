import { Seat } from "../../../domain/Seat.domain";
import { Performance } from "../../../domain/Performance.domain";
import { ReservationTicket } from "../../../domain/ReservationTicket.domain";

describe("Performance domain unit", () => {
  describe("getAvailableSeat: 예약 가능한 좌석을 반환한다.", () => {
    test("정상 요청", () => {
      //given
      const seat = new Seat(
        1,
        1,
        1,
        1000,
        new ReservationTicket(1, 1, 1, false, new Date()),
      );
      seat.isReserved = jest.fn().mockReturnValue(false);

      const availableSeatList = [seat];
      const performance = new Performance(
        1,
        1,
        new Date(),
        new Date(),
        new Date(),
        [...availableSeatList],
      );
      //when
      const response = performance.getAvailableSeat();
      //then
      expect(response).toStrictEqual(availableSeatList);
    });
  });
  describe("isTicketAvailableDate: 예약 가능한 공연인지 반환한다.", () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2024-07-12 00:00:00"));
    });

    test("예약 가능한 공연이면 true를 반환한다.", () => {
      //given
      const performance = new Performance(
        1,
        1,
        new Date(),
        new Date("2024-07-10 00:00:00"),
        new Date("2024-07-15 00:00:00"),
      );
      //when
      const response = performance.isTicketAvailableDate();
      //then
      expect(response).toBeTruthy();
    });
    test("예약 가능한 공연이면 false를 반환한다.", () => {
      //given
      const performance = new Performance(
        1,
        1,
        new Date(),
        new Date("2024-07-13 00:00:00"),
        new Date("2024-07-15 00:00:00"),
      );
      //when
      const response = performance.isTicketAvailableDate();
      //then
      expect(response).toBeFalsy();
    });
  });
});
