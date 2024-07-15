import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { UserEntity } from "./User.entity";
import { PointTransactionTypeEnum } from "../../enum/PointTransactionType.enum";
import { PointTransactionTypeTransformer } from "libs/transformer/PointTransactionType.transformer";

@Entity("user_point_log", { schema: "concert" })
export class UserPointLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("uuid")
  user_uuid: string;

  @Column()
  amount: number;

  @Column("varchar", {
    transformer: new PointTransactionTypeTransformer(),
  })
  transactionType: PointTransactionTypeEnum;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => UserEntity, (m) => m.userPointLogList, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "user_uuid", referencedColumnName: "uuid" })
  user?: UserEntity;
}
