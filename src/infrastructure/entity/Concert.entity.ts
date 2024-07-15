import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PerformanceEntity } from "./Performance.entity";

@Entity("concert", { schema: "concert" })
export class ConcertEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  name: string;

  @OneToMany(() => PerformanceEntity, (m) => m.concert, {
    createForeignKeyConstraints: false,
  })
  performanceList?: PerformanceEntity[];
}
