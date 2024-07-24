import { Inject, Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

import { ConcertErrorCodeEnum } from "../../enum/ConcertErrorCode.enum";

import { ConcertRepositoryInterface } from "../repository/Concert.repository.interface";

import { Concert } from "../Concert.domain";
import { ReservationTicket } from "../ReservationTicket.domain";
import { Seat } from "../Seat.domain";

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
    const concert = await this.concertRepositoryInterface.findById(concertId);
    if (!concert) {
      throw new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트.message);
    }

    return concert;
  }

  async findBySeatId(seatId: number): Promise<Concert> {
    const concert = await this.concertRepositoryInterface.findBySeatId(seatId);
    if (!concert) {
      throw new Error(ConcertErrorCodeEnum.존재하지_않는_콘서트.message);
    }

    return concert;
  }

  async findSeatById(
    seatId: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<Seat> {
    const seat = await this.concertRepositoryInterface.findSeatById(
      seatId,
      transactionalEntityManager,
    );
    if (!seat) {
      throw new Error(ConcertErrorCodeEnum.존재하지_않는_좌석_정보.message);
    }

    return seat;
  }

  activeSeat(
    seat: Seat,
    transactionalEntityManager?: EntityManager,
  ): Promise<Seat> {
    seat.isReserved = true;

    return this.concertRepositoryInterface.updateSeat(
      seat,
      transactionalEntityManager,
    );
  }

  reservation(
    reservationTicket: ReservationTicket,
    transactionalEntityManager?: EntityManager,
  ): Promise<ReservationTicket> {
    return this.concertRepositoryInterface.saveReservationTicket(
      reservationTicket,
      transactionalEntityManager,
    );
  }
}
