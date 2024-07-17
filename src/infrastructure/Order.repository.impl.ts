import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderTicket } from "../domain/OrderTicket.domain";
import { OrderRepositoryInterface } from "../domain/repository/Order.repository.interface";
import { ReservationTicket } from "../domain/ReservationTicket.domain";
import { OrderTicketEntity } from "./entity/OrderTicket.entity";
import { ReservationTicketEntity } from "./entity/ReservationTicket.entity";
import { ConcertMapper } from "@root/mapper/Concert.mapper";
import { OrderTicketMapper } from "@root/mapper/OrderTicket.mapper";

@Injectable()
export class OrderRepositoryImpl implements OrderRepositoryInterface {
  constructor(
    @InjectRepository(OrderTicketEntity)
    private readonly orderTicketRepository: Repository<OrderTicketEntity>,
    @InjectRepository(ReservationTicketEntity)
    private readonly reservationTicketRepository: Repository<ReservationTicketEntity>,
  ) {}

  async findReservationById(
    reservationTicketId: number,
  ): Promise<ReservationTicket> {
    return ConcertMapper.mapToReservationTicketDomain(
      await this.reservationTicketRepository.findOne({
        relations: { seat: true },
        where: { id: reservationTicketId },
      }),
    );
  }

  async isFinishedReservation(reservationTicketId: number): Promise<void> {
    const reservationTicketEntity = new ReservationTicketEntity();
    reservationTicketEntity.is_finish = true;

    await this.reservationTicketRepository.update(
      reservationTicketId,
      reservationTicketEntity,
    );

    return;
  }

  async createOrderTicket(orderTicket: OrderTicket): Promise<OrderTicket> {
    const orderTicketEntity = this.orderTicketRepository.create(
      OrderTicketMapper.mapToOrderTicketEntity(orderTicket),
    );

    return OrderTicketMapper.mapToOrderTicketDomain(
      await this.orderTicketRepository.save(orderTicketEntity),
    );
  }
}
