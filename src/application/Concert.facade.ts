import { Injectable } from "@nestjs/common";
import { Concert } from "../domain/Concert.domain";
import { ConcertService } from "../domain/service/Concert.service";
import { ConcertErrorCodeEnum } from "../enum/ConcertErrorCode.enum";
import { ReservationTicket } from "../domain/ReservationTicket.domain";
import { Seat } from "@root/domain/Seat.domain";

@Injectable()
export class ConcertFacade {
  constructor(private readonly concertService: ConcertService) {}

  getAllConcertList(): Promise<Concert[]> {
    return this.concertService.findAll();
  }

  getAvailableDateList(concertId: number): Promise<Concert> {
    return this.concertService.findById(concertId);
  }

  async getAvailableSeat(
    concertId: number,
    performanceId: number,
  ): Promise<Seat[]> {
    const concert = await this.concertService.findById(concertId);
    const performance = concert.performanceList?.find(
      (performance) => performance.id === performanceId,
    );
    if (!performance) {
      throw new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트_정보.message);
    }

    return performance.getAvailableSeat();
  }

  async reservation(
    reservationTicket: ReservationTicket,
  ): Promise<ReservationTicket> {
    const performance = await this.concertService.findPerformanceBySeatId(
      reservationTicket.seatId,
    );

    if (!performance.isTicketAvailableDate()) {
      throw new Error(ConcertErrorCodeEnum.예약_가능한_시간이_지남.message);
    }
    if (performance.getAvailableSeat().length === 0) {
      throw new Error(ConcertErrorCodeEnum.신청_가능한_인원_초과.message);
    }

    return this.concertService.reservation(reservationTicket);
  }
}
