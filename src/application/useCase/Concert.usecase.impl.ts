import { Concert } from "../../domain/Concert.domain";
import { ConcertUsecase } from "./interface/Concert.usecase.interface";
import { ConcertService } from "../../domain/service/Concert.service";
import { ConcertErrorCodeEnum } from "../../enum/ConcertErrorCode.enum";
import { Injectable } from "@nestjs/common";
import { ReservationTicket } from "../../domain/ReservationTicket.domain";

@Injectable()
export class ConcertUseCaseImpl implements ConcertUsecase {
  constructor(private readonly concertService: ConcertService) {}

  findAll(): Promise<Concert[]> {
    return this.concertService.findAll();
  }

  findConcertById(concertId: number): Promise<Concert[]> {
    return this.concertService.findById(concertId);
  }

  async findAvailableSeatCount(
    concertId: number,
    performanceId: number,
  ): Promise<number> {
    const concertList = await this.concertService.findById(concertId);
    if (!concertList || !concertList.length) {
      throw new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트.message);
    }

    const { performance } =
      concertList.find((concert) => concert.performance.id === performanceId) ||
      {};
    if (!performance) {
      throw new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트_정보.message);
    }

    return performance.getAvailableSeatCount();
  }

  async reservation(
    reservationTicket: ReservationTicket,
  ): Promise<ReservationTicket> {
    const concert = await this.concertService.findByPerformanceId(
      reservationTicket.performanceId,
    );
    if (!concert) {
      throw new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트.message);
    }
    if (!concert.performance.isTicketAvailableDate()) {
      throw new Error(ConcertErrorCodeEnum.예약_가능한_시간이_지남.message);
    }
    if (concert.performance.getAvailableSeatCount() === 0) {
      throw new Error(ConcertErrorCodeEnum.신청_가능한_인원_초과.message);
    }

    return this.concertService.reservation(reservationTicket);
  }
}
