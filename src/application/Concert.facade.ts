import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";

import { ConcertService } from "../domain/service/Concert.service";
import { UserService } from "../domain/service/User.service";

import { Concert } from "../domain/Concert.domain";
import { ReservationTicket } from "../domain/ReservationTicket.domain";
import { Seat } from "../domain/Seat.domain";

import { ConcertErrorCodeEnum } from "../enum/ConcertErrorCode.enum";
import { PointTransactionTypeEnum } from "../enum/PointTransactionType.enum";

@Injectable()
export class ConcertFacade {
  constructor(
    private readonly concertService: ConcertService,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

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
    const [seat, user] = await Promise.all([
      this.concertService.findSeatById(reservationTicket.seatId),
      this.userService.findByUuid(reservationTicket.userUuid),
    ]);
    // 공연 상태 확인
    if (!seat.performance.isTicketAvailableDate()) {
      throw new Error(ConcertErrorCodeEnum.예약_가능한_시간이_지남.message);
    }
    // 사용자 잔액 확인
    if (seat.price > user.point) {
      throw new Error(ConcertErrorCodeEnum.잔액부족.message);
    }

    const amount = user.point - seat.price;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    try {
      const activedSeat = await this.concertService.activeSeat(seat);
      // seat insert 때 version 1 -> seat 상태 값 바꾸면서 version 2
      if (activedSeat.version > 2) {
        throw new Error(ConcertErrorCodeEnum.이미_예약된_좌석.message);
      }

      const [ticket] = await Promise.all([
        this.concertService.reservation(reservationTicket, manager),
        this.concertService.activeSeat(seat),
        this.userService.updatePoint(
          reservationTicket.userUuid,
          amount,
          manager,
        ),
        this.userService.insertPointHistory(
          reservationTicket.userUuid,
          user.point,
          PointTransactionTypeEnum.사용,
          manager,
        ),
      ]);

      return ticket;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
