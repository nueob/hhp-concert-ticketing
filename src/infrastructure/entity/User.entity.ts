import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  VersionColumn,
} from "typeorm";
import { UserPointLogEntity } from "./UserPointLog.entity";
import { ReservationTicketEntity } from "./ReservationTicket.entity";

@Entity("user", { schema: "concert" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  point: number;

  @VersionColumn()
  version: number;

  @OneToMany(() => UserPointLogEntity, (m) => m.user, {
    createForeignKeyConstraints: false,
  })
  userPointLogList?: UserPointLogEntity[];

  @OneToMany(() => ReservationTicketEntity, (m) => m.user, {
    createForeignKeyConstraints: false,
  })
  reservationTicketList: ReservationTicketEntity[];
}
