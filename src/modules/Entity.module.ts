import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ConcertEntity } from "../infrastructure/entity/Concert.entity";
import { OrderTicketEntity } from "../infrastructure/entity/OrderTicket.entity";
import { ReservationTicketEntity } from "../infrastructure/entity/ReservationTicket.entity";
import { SeatEntity } from "../infrastructure/entity/Seat.entity";
import { UserEntity } from "../infrastructure/entity/User.entity";
import { UserPointLogEntity } from "../infrastructure/entity/UserPointLog.entity";
import { PerformanceEntity } from "../infrastructure/entity/Performance.entity";
import { OutBoxEntity } from "../infrastructure/entity/OutBox.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConcertEntity,
      OrderTicketEntity,
      PerformanceEntity,
      ReservationTicketEntity,
      SeatEntity,
      UserEntity,
      UserPointLogEntity,
      OutBoxEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class EntityModule {}
