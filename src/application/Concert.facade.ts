import { ReservationTicket } from "../domain/ReservationTicket.domain";
import { Concert } from "../domain/Concert.domain";
import { ConcertUsecase } from "./useCase/interface/Concert.usecase.interface";

export class ConcertFacade {
  constructor(private readonly concertUsecase: ConcertUsecase) {}

  getAllConcertList(): Promise<Concert[]> {
    return this.concertUsecase.findAll();
  }

  getAvailableDateList(concertId: number): Promise<Concert[]> {
    return this.concertUsecase.findConcertById(concertId);
  }

  getAvailableSeatCount(
    concertId: number,
    performanceId: number,
  ): Promise<number> {
    return this.concertUsecase.findAvailableSeatCount(concertId, performanceId);
  }

  reservation(
    reservationTicket: ReservationTicket,
  ): Promise<ReservationTicket> {
    return this.concertUsecase.reservation(reservationTicket);
  }
}
