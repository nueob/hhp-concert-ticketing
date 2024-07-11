import { ReservationTicket } from "../../../domain/ReservationTicket.domain";

describe("Reservation Ticket unit", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01 00:10:00"));
  });

  describe("validTicket: 유효한 티켓인지 검사한다.", () => {
    test("5분이 지나지 않은 유효한 티켓일 경우, true를 반환한다.", () => {
      //given
      const reservationTicket = new ReservationTicket(
        null,
        null,
        null,
        null,
        new Date("2024-01-01 00:07:00"),
      );
      //when
      const response = reservationTicket.validTicket();
      //then
      expect(response).toBeTruthy();
    });
    test("5분이 지난 유효하지 않은 티켓일 경우, false를 반환한다.", () => {
      //given
      const reservationTicket = new ReservationTicket(
        null,
        null,
        null,
        null,
        new Date("2024-01-01 00:04:00"),
      );
      //when
      const response = reservationTicket.validTicket();
      //then
      expect(response).toBeFalsy();
    });
  });
});
