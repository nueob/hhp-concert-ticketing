import { Concert } from "../../../../domain/Concert.domain";
import { ConcertUsecase } from "../../../../application/useCase/interface/Concert.usecase.interface";
import { ReservationTicket } from "src/domain/ReservationTicket.domain";

export class ConcertUseCaseStub implements ConcertUsecase {
  findAll(): Promise<Concert[]> {
    return Promise.resolve([new Concert()]);
  }
  findConcertById(concertId: number): Promise<Concert[]> {
    return Promise.resolve([new Concert()]);
  }
  findAvailableSeatCount(
    concertId: number,
    performanceId: number,
  ): Promise<number> {
    return Promise.resolve(1);
  }
  reservation(
    reservationTicket: ReservationTicket,
  ): Promise<ReservationTicket> {
    return Promise.resolve(reservationTicket);
  }
}
