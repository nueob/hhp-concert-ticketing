import { Concert } from "../Concert.domain";
import { ReservationTicket } from "../ReservationTicket.domain";

export interface ConcertRepositoryInterface {
  findAll(): Promise<Concert[]>;
  findById(concertId: number): Promise<Concert[]>;
  findByPerformanceId(performanceId: number): Promise<Concert>;
  saveReservationTicket(
    reservationTicket: ReservationTicket,
  ): Promise<ReservationTicket>;
}
