import { ReservationTicket } from "../../domain/ReservationTicket.domain";
import { Performance } from "../../domain/Performance.domain";

describe("Performance doamin unit test", () => {
  test("getAvailableSeatCount: 예약 가능한 좌석 수를 반환한다.", () => {
    //given
    const maximumCapacity = 10;
    const reservationTicketList = [
      new ReservationTicket(1, 1, 1, 1, true, new Date("2024-07-03 12:00:00")),
      new ReservationTicket(1, 1, 1, 1, true, new Date("2024-07-03 12:00:00")),
      new ReservationTicket(1, 1, 1, 1, false, new Date("2024-07-03 12:00:00")),
    ];

    const performance = new Performance(
      1,
      maximumCapacity,
      new Date("2024-07-14 12:00:00"),
      new Date("2024-07-01 00:00:00"),
      new Date("2024-07-05 00:00:00"),
      reservationTicketList,
    );
    //when
    const response = performance.getAvailableSeatCount();
    //then
    expect(response).toBe(maximumCapacity - reservationTicketList.length);
  });
});
