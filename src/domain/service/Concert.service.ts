import { Concert } from "../Concert.domain";
import { ConcertRepositoryInterface } from "../interface/Concert.repository.interface";
import { ReservationTicket } from "../ReservationTicket.domain";

export class ConcertService {
  constructor(
    private readonly concertRepositoryInterface: ConcertRepositoryInterface,
  ) {}

  findAll(): Promise<Concert[]> {
    return this.concertRepositoryInterface.findAll();
  }

  findById(concertId: number): Promise<Concert[]> {
    return this.concertRepositoryInterface.findById(concertId);
  }

  findByPerformanceId(performanceId: number): Promise<Concert> {
    return this.concertRepositoryInterface.findByPerformanceId(performanceId);
  }

  reservation(
    reservationTicket: ReservationTicket,
  ): Promise<ReservationTicket> {
    return this.concertRepositoryInterface.saveReservationTicket(
      reservationTicket,
    );
  }
}
