import { Concert } from "../domain/Concert.domain";
import { Performance } from "../domain/Performance.domain";
import { ReservationTicket } from "../domain/ReservationTicket.domain";
import { Seat } from "../domain/Seat.domain";
import { ConcertEntity } from "../infrastructure/entity/Concert.entity";
import { PerformanceEntity } from "../infrastructure/entity/Performance.entity";
import { ReservationTicketEntity } from "../infrastructure/entity/ReservationTicket.entity";
import { SeatEntity } from "../infrastructure/entity/Seat.entity";

export class ConcertMapper {
  static mapToConcertDomain(entity: ConcertEntity): Concert {
    if (!entity) return;

    return new Concert(
      entity.id,
      entity.name,
      entity.performanceList?.map((performane) =>
        this.mapToPerformanceDomain(performane),
      ),
    );
  }

  static mapToPerformanceDomain(entity: PerformanceEntity): Performance {
    if (!entity) return;

    return new Performance(
      entity.id,
      entity.maximum_capacity,
      entity.start_at,
      entity.ticketing_start_at,
      entity.ticketing_end_at,
      entity.seatList?.map((seat) => this.mapToSeatDomain(seat)),
    );
  }

  static mapToSeatDomain(entity: SeatEntity): Seat {
    if (!entity) return;

    return new Seat(
      entity.id,
      entity.performance_id,
      entity.seat_no,
      entity.price,
      entity.is_reserved,
      this.mapToPerformanceDomain(entity.performance),
    );
  }

  static mapToReservationTicketDomain(
    entity: ReservationTicketEntity,
  ): ReservationTicket {
    if (!entity) return;

    return new ReservationTicket(
      entity.id,
      entity.user_uuid,
      entity.seat_id,
      entity.is_finish,
      entity.created_at,
    );
  }

  static mapToSeatEntity(domain: Seat): SeatEntity {
    const seatEntity = new SeatEntity();
    seatEntity.id = domain.id;
    seatEntity.performance_id = domain.performanceId;
    seatEntity.seat_no = domain.seatNo;
    seatEntity.price = domain.price;
    seatEntity.is_reserved = domain.isReserved;

    return seatEntity;
  }

  static mapToReservationEntity(
    domain: ReservationTicket,
  ): ReservationTicketEntity {
    if (!domain) return;

    const reservationTicketEntity = new ReservationTicketEntity();
    reservationTicketEntity.id = domain.id;
    reservationTicketEntity.user_uuid = domain.userUuid;
    reservationTicketEntity.seat_id = domain.seatId;
    reservationTicketEntity.is_finish = domain.isFinish;
    reservationTicketEntity.created_at = domain.createdAt;

    return reservationTicketEntity;
  }
}
