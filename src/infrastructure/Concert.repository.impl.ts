import { Injectable } from "@nestjs/common";
import { Concert } from "../domain/Concert.domain";
import { Performance } from "../domain/Performance.domain";
import { ConcertRepositoryInterface } from "../domain/repository/Concert.repository.interface";
import { ReservationTicket } from "../domain/ReservationTicket.domain";
import { InjectRepository } from "@nestjs/typeorm";
import { ConcertEntity } from "./entity/Concert.entity";
import { Repository } from "typeorm";
import { ConcertMapper } from "@root/mapper/Concert.mapper";
import { PerformanceEntity } from "./entity/Performance.entity";
import { ReservationTicketEntity } from "./entity/ReservationTicket.entity";

@Injectable()
export class ConcertRepositoryImpl implements ConcertRepositoryInterface {
  constructor(
    @InjectRepository(ConcertEntity)
    private readonly concertRepository: Repository<ConcertEntity>,
    @InjectRepository(PerformanceEntity)
    private readonly performanceRepository: Repository<PerformanceEntity>,
    @InjectRepository(ReservationTicketEntity)
    private readonly reservationTicketRepository: Repository<ReservationTicketEntity>,
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

  async saveReservationTicket(
    reservationTicket: ReservationTicket,
  ): Promise<ReservationTicket> {
    const reservationTicketEntity = this.reservationTicketRepository.create(
      ConcertMapper.mapToReservationEntity(reservationTicket),
    );

    return ConcertMapper.mapToReservationTicketDomain(
      await this.reservationTicketRepository.save(reservationTicketEntity),
    );
  }
}
