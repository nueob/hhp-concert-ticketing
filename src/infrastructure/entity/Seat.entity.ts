import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  VersionColumn,
} from "typeorm";
import { ReservationTicketEntity } from "./ReservationTicket.entity";
import { PerformanceEntity } from "./Performance.entity";

@Entity("seat", { schema: "concert" })
export class SeatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  performance_id: number;

  @Column()
  seat_no: number;

  @Column()
  price: number;

  @Column()
  is_reserved: boolean;

  @VersionColumn()
  version: number;

  @OneToOne(() => ReservationTicketEntity, (m) => m.seat, {
    createForeignKeyConstraints: false,
  })
  reservationTicket?: ReservationTicketEntity;

  @ManyToOne(() => PerformanceEntity, (m) => m.seatList, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: "performance_id",
    referencedColumnName: "id",
  })
  performance?: PerformanceEntity;
}
