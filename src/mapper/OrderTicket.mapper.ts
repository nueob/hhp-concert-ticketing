import { OrderTicket } from "@root/domain/OrderTicket.domain";
import { OrderTicketEntity } from "@root/infrastructure/entity/OrderTicket.entity";

export class OrderTicketMapper {
  static mapToOrderTicketDomain(entity: OrderTicketEntity): OrderTicket {
    if (!entity) return;

    return new OrderTicket(
      entity.id,
      entity.reservation_ticket_id,
      entity.step,
      entity.concert_name,
      entity.seat_no,
      entity.price,
      entity.created_at,
    );
  }

  static mapToOrderTicketEntity(domain: OrderTicket): OrderTicketEntity {
    if (!domain) return;

    const orderTicketEntity = new OrderTicketEntity();
    orderTicketEntity.id = domain.id;
    orderTicketEntity.reservation_ticket_id = domain.reservationTicketId;
    orderTicketEntity.step = domain.step;
    orderTicketEntity.concert_name = domain.concertName;
    orderTicketEntity.seat_no = domain.seatNo;
    orderTicketEntity.price = domain.price;
    orderTicketEntity.created_at = domain.createdAt;

    return orderTicketEntity;
  }
}
