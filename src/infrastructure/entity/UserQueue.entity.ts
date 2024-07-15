import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "./User.entity";
import { WaitingQueueStatusEnum } from "../../enum/WaitingQueueStatus.enum";
import { WaitingQueueStatusTransformer } from "../../../libs/transformer/WaitingQueueStatus.transformer";

@Entity("user_queue", { schema: "concert" })
export class UserQueueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("uuid")
  user_uuid: string;

  @Column("varchar", {
    transformer: new WaitingQueueStatusTransformer(),
  })
  status: WaitingQueueStatusEnum;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => UserEntity, (m) => m.userQueueList, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "user_uuid", referencedColumnName: "uuid" })
  user?: UserEntity;
}
