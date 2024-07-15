import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { ReservationTicketEntity } from "./ReservationTicket.entity";
import { TinyIntTransformer } from "../../../libs/transformer/TinyInt.transformer";
import { OrderTicketStepTransformer } from "../../../libs/transformer/OrderTicketStep.transformer";
import { OrderStepEnum } from "@root/enum/OrderStep.enum";

@Entity("order_ticket", { schema: "concert" })
export class OrderTicketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reservation_ticket_id: number;

  @Column("int", {
    transformer: new OrderTicketStepTransformer(),
  })
  step: OrderStepEnum;

  @Column("tinyint", {
    transformer: new TinyIntTransformer(),
  })
  is_finish: boolean;

  @Column({ length: 45 })
  concert_name: string;

  @Column()
  seat_no: number;

  @Column()
  price: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => ReservationTicketEntity, (m) => m.orderTicket, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: "reservation_ticket_id",
    referencedColumnName: "id",
  })
  reservationTicket: ReservationTicketEntity;
}
