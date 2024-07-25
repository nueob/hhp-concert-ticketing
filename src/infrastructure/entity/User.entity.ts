import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  VersionColumn,
} from "typeorm";
import { UserQueueEntity } from "./UserQueue.entity";
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

  @OneToMany(() => UserQueueEntity, (m) => m.user, {
    createForeignKeyConstraints: false,
  })
  userQueueList?: UserQueueEntity[];

  @OneToMany(() => UserPointLogEntity, (m) => m.user, {
    createForeignKeyConstraints: false,
  })
  userPointLogList?: UserPointLogEntity[];

  @OneToMany(() => ReservationTicketEntity, (m) => m.user, {
    createForeignKeyConstraints: false,
  })
  reservationTicketList: ReservationTicketEntity[];
}
