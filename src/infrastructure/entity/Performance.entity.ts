import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { ConcertEntity } from "./Concert.entity";
import { SeatEntity } from "./Seat.entity";

@Entity("performance", { schema: "concert" })
export class PerformanceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  concert_id: number;

  @Column()
  maximum_capacity: number;

  @Column()
  start_at: Date;

  @Column()
  ticketing_start_at: Date;

  @Column()
  ticketing_end_at: Date;

  @ManyToOne(() => ConcertEntity, (m) => m.performanceList, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: "concert_id",
    referencedColumnName: "id",
  })
  concert?: ConcertEntity;

  @OneToMany(() => SeatEntity, (m) => m.performance, {
    createForeignKeyConstraints: false,
  })
  seatList?: SeatEntity[];
}
