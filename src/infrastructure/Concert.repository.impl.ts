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

import { RedisClient } from "./redis/Redis.client";

@Injectable()
export class ConcertRepositoryImpl implements ConcertRepositoryInterface {
  private readonly cacheTTL = 60 * 60;

  constructor(
    @InjectRepository(ConcertEntity)
    private readonly concertRepository: Repository<ConcertEntity>,
    @InjectRepository(PerformanceEntity)
    private readonly performanceRepository: Repository<PerformanceEntity>,
    @InjectRepository(ReservationTicketEntity)
    private readonly reservationTicketRepository: Repository<ReservationTicketEntity>,
    @InjectRepository(SeatEntity)
    private readonly seatRepository: Repository<SeatEntity>,
    private readonly redisClient: RedisClient,
  ) {}

  async findAll(): Promise<Concert[]> {
    const key = "concert:all";
    const cachedAllConcert = await this.redisClient.get(key);
    if (cachedAllConcert) {
      return cachedAllConcert;
    }

    const concertList = await this.concertRepository.find({
      relations: { performanceList: true },
    });
    const results = concertList?.map((concert) =>
      ConcertMapper.mapToConcertDomain(concert),
    );

    await this.redisClient.set(key, results, this.cacheTTL);

    return results;
  }

  async findById(concertId: number): Promise<Concert> {
    const key = `concert:${concertId}`;
    const cachedConcert = await this.redisClient.get(key);
    if (cachedConcert) {
      return cachedConcert;
    }

    const results = ConcertMapper.mapToConcertDomain(
      await this.concertRepository.findOne({
        relations: { performanceList: { seatList: true } },
        where: { id: concertId },
      }),
    );

    await this.redisClient.set(key, results, this.cacheTTL);

    return results;
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
        relations: { seatList: { reservationTicket: true } },
        where: { id: performanceId },
      }),
    );
  }

  async findSeatById(
    seatId: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<Seat> {
    if (transactionalEntityManager) {
      return ConcertMapper.mapToSeatDomain(
        await transactionalEntityManager.getRepository(SeatEntity).findOne({
          relations: { performance: true },
          where: { id: seatId },
          lock: { mode: "pessimistic_read" },
        }),
      );
    }

    return ConcertMapper.mapToSeatDomain(
      await this.seatRepository.findOne({
        relations: { performance: true },
        where: { id: seatId },
      }),
    );
  }

  async updateSeat(
    seat: Seat,
    transactionalEntityManager?: EntityManager,
  ): Promise<Seat> {
    if (transactionalEntityManager) {
      const seatEntity = transactionalEntityManager
        .getRepository(SeatEntity)
        .create(ConcertMapper.mapToSeatEntity(seat));

      return ConcertMapper.mapToSeatDomain(
        await transactionalEntityManager
          .getRepository(SeatEntity)
          .save(seatEntity),
      );
    }

    const seatEntity = this.seatRepository.create(
      ConcertMapper.mapToSeatEntity(seat),
    );

    return ConcertMapper.mapToSeatDomain(
      await this.seatRepository.save(seatEntity),
    );
  }

  async saveReservationTicket(
    reservationTicket: ReservationTicket,
    transactionalEntityManager?: EntityManager,
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
