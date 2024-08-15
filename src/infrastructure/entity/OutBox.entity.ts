import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";
import { TinyIntTransformer } from "./transformer/TinyInt.transformer";

@Entity("out_box", { schema: "concert" })
export class OutBoxEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  topic: string;

  @Column()
  message: string;

  @Column("tinyint", {
    transformer: new TinyIntTransformer(),
  })
  is_finish: boolean;

  @CreateDateColumn()
  created_at: Date;
}
