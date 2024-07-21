import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { UserEntity } from "./User.entity";
import { SeatEntity } from "./Seat.entity";
import { OrderTicketEntity } from "./OrderTicket.entity";
import { TinyIntTransformer } from "./transformer/TinyInt.transformer";

@Entity("reservation_ticket", { schema: "concert" })
export class ReservationTicketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("uuid")
  user_uuid: string;

  @Column()
  seat_id: number;

  @Column("tinyint", {
    transformer: new TinyIntTransformer(),
  })
  is_finish: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => UserEntity, (m) => m.reservationTicketList, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "user_uuid", referencedColumnName: "uuid" })
  user?: UserEntity;

  @OneToOne(() => SeatEntity, (m) => m.reservationTicket, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: "seat_id",
    referencedColumnName: "id",
  })
  seat?: SeatEntity;

  @OneToOne(() => OrderTicketEntity, (m) => m.reservationTicket, {
    createForeignKeyConstraints: false,
  })
  orderTicket?: OrderTicketEntity;
}
