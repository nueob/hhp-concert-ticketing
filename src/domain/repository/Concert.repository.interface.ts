import { Concert } from "../Concert.domain";
import { Performance } from "../Performance.domain";
import { ReservationTicket } from "../ReservationTicket.domain";

export interface ConcertRepositoryInterface {
  findAll(): Promise<Concert[]>;
  findById(concertId: number): Promise<Concert>;
  findBySeatId(seatId: number): Promise<Concert>;
  findPerformanceBySeatId(performanceId: number): Promise<Performance>;
  saveReservationTicket(
    reservationTicket: ReservationTicket,
  ): Promise<ReservationTicket>;
}
