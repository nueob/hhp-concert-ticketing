import { Concert } from "../domain/Concert.domain";
import { Performance } from "../domain/Performance.domain";
import { ConcertRepositoryInterface } from "../domain/repository/Concert.repository.interface";
import { ReservationTicket } from "../domain/ReservationTicket.domain";

export class ConcertRepositoryImpl implements ConcertRepositoryInterface {
  findAll(): Promise<Concert[]> {
    return Promise.resolve([new Concert()]);
  }
  findById(concertId: number): Promise<Concert> {
    return Promise.resolve(new Concert());
  }
  findBySeatId(seatId: number): Promise<Concert> {
    return Promise.resolve(new Concert());
  }
  findPerformanceBySeatId(performanceId: number): Promise<Performance> {
    return Promise.resolve(new Performance());
  }
  saveReservationTicket(
    reservationTicket: ReservationTicket,
  ): Promise<ReservationTicket> {
    return Promise.resolve(new ReservationTicket());
  }
}
