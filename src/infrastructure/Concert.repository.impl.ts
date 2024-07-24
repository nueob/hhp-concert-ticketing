import { EntityManager, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Concert } from "../domain/Concert.domain";
import { Performance } from "../domain/Performance.domain";
import { ReservationTicket } from "../domain/ReservationTicket.domain";
import { Seat } from "../domain/Seat.domain";

import { ConcertRepositoryInterface } from "../domain/repository/Concert.repository.interface";

import { ConcertMapper } from "../mapper/Concert.mapper";

import { ConcertEntity } from "./entity/Concert.entity";
import { PerformanceEntity } from "./entity/Performance.entity";
import { ReservationTicketEntity } from "./entity/ReservationTicket.entity";
import { SeatEntity } from "./entity/Seat.entity";

@Injectable()
export class ConcertRepositoryImpl implements ConcertRepositoryInterface {
  constructor(
    @InjectRepository(ConcertEntity)
    private readonly concertRepository: Repository<ConcertEntity>,
    @InjectRepository(PerformanceEntity)
    private readonly performanceRepository: Repository<PerformanceEntity>,
    @InjectRepository(ReservationTicketEntity)
    private readonly reservationTicketRepository: Repository<ReservationTicketEntity>,
    @InjectRepository(SeatEntity)
    private readonly seatRepository: Repository<SeatEntity>,
  ) {}

  async findAll(): Promise<Concert[]> {
    const concertList = await this.concertRepository.find({
      relations: { performanceList: true },
    });

    return concertList.map((concert) =>
      ConcertMapper.mapToConcertDomain(concert),
    );
  }

  async findById(concertId: number): Promise<Concert> {
    return ConcertMapper.mapToConcertDomain(
      await this.concertRepository.findOne({
        relations: { performanceList: { seatList: true } },
        where: { id: concertId },
      }),
    );
  }

  async findBySeatId(seatId: number): Promise<Concert> {
    return ConcertMapper.mapToConcertDomain(
      await this.concertRepository.findOne({
        relations: { performanceList: { seatList: true } },
        where: { performanceList: { seatList: { id: seatId } } },
      }),
    );
  }

  async findPerformanceBySeatId(performanceId: number): Promise<Performance> {
    return ConcertMapper.mapToPerformanceDomain(
      await this.performanceRepository.findOne({
        relations: { seatList: true },
        where: { id: performanceId },
      }),
    );
  }

  async findSeatById(seatId: number): Promise<Seat> {
    return ConcertMapper.mapToSeatDomain(
      await this.seatRepository.findOne({
        relations: { performance: true },
        where: { id: seatId },
        lock: { mode: "pessimistic_read" },
      }),
    );
  }

  async updateSeat(seat: Seat): Promise<Seat> {
    const seatEntity = this.seatRepository.create(
      ConcertMapper.mapToSeatEntity(seat),
    );

    return ConcertMapper.mapToSeatDomain(
      await this.seatRepository.save(seatEntity),
    );
  }

  async saveReservationTicket(
    reservationTicket: ReservationTicket,
    transactionalEntityManager: EntityManager,
  ): Promise<ReservationTicket> {
    const reservationTicketEntity = this.reservationTicketRepository.create(
      ConcertMapper.mapToReservationEntity(reservationTicket),
    );
    if (transactionalEntityManager) {
      return ConcertMapper.mapToReservationTicketDomain(
        await transactionalEntityManager
          .getRepository(ReservationTicketEntity)
          .save(reservationTicketEntity),
      );
    }
    return ConcertMapper.mapToReservationTicketDomain(
      await this.reservationTicketRepository.save(reservationTicketEntity),
    );
  }
}
