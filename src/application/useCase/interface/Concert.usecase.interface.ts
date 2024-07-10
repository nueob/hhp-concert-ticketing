import { Concert } from "src/domain/Concert.domain";
import { ReservationTicket } from "src/domain/ReservationTicket.domain";

export interface ConcertUsecase {
  findAll(): Promise<Concert[]>;
  findConcertById(concertId: number): Promise<Concert[]>;
  findAvailableSeatCount(
    concertId: number,
    performanceId: number,
  ): Promise<number>;
  reservation(reservationTicket: ReservationTicket): Promise<ReservationTicket>;
}
