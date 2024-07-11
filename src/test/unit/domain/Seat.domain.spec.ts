import { ReservationTicket } from "../../../domain/ReservationTicket.domain";
import { Seat } from "../../../domain/Seat.domain";

describe("Seat domain unit", () => {
  describe("isReserved: 예약된 좌석인 지 반환한다.", () => {
    test("예약된 좌석일 경우, true를 반환한다", () => {
      //given
      const seat = new Seat(
        1,
        1,
        1,
        1000,
        new ReservationTicket(1, 1, 1, true, new Date()),
      );
      //when
      const response = seat.isReserved();
      //then
      expect(response).toBeTruthy();
    });
    test("예약되지 않은 좌석일 경우, false를 반환한다", () => {
      //given
      const seat = new Seat(
        1,
        1,
        1,
        1000,
        new ReservationTicket(1, 1, 1, false, new Date()),
      );
      //when
      const response = seat.isReserved();
      //then
      expect(response).toBeFalsy();
    });
  });
});
