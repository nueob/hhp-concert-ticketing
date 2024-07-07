import { ReservationTicket } from "../domain/ReservationTicket.domain";
import { Concert } from "../domain/Concert.domain";

export class ConcertFacade {
  async getAllConcertList(): Promise<Concert[]> {
    return Promise.resolve([new Concert()]);
  }

  async getAvailableDateList(concertId: number): Promise<Concert[]> {
    return Promise.resolve([new Concert()]);
  }

  async getAvailableSeatCount(
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
