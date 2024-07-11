import { Inject, Injectable } from "@nestjs/common";
import { ConcertErrorCodeEnum } from "../../enum/ConcertErrorCode.enum";
import { Concert } from "../Concert.domain";
import { Performance } from "../Performance.domain";
import { ConcertRepositoryInterface } from "../repository/Concert.repository.interface";
import { ReservationTicket } from "../ReservationTicket.domain";

@Injectable()
export class ConcertService {
  constructor(
    @Inject("ConcertRepositoryInterface")
    private readonly concertRepositoryInterface: ConcertRepositoryInterface,
  ) {}

  findAll(): Promise<Concert[]> {
    return this.concertRepositoryInterface.findAll();
  }

  async findById(concertId: number): Promise<Concert> {
    const concertList =
      await this.concertRepositoryInterface.findById(concertId);
    if (!concertList) {
      throw new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트.message);
    }

    return concertList;
  }

  async findPerformanceBySeatId(seatId: number): Promise<Performance> {
    const performance =
      await this.concertRepositoryInterface.findPerformanceBySeatId(seatId);
    if (!performance) {
      throw new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트.message);
    }

    return performance;
  }

  reservation(
    reservationTicket: ReservationTicket,
  ): Promise<ReservationTicket> {
    return this.concertRepositoryInterface.saveReservationTicket(
      reservationTicket,
    );
  }
}
