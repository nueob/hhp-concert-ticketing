import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserQueueEntity } from "../infrastructure/entity/UserQueue.entity";
import { ConcertEntity } from "../infrastructure/entity/Concert.entity";
import { OrderTicketEntity } from "../infrastructure/entity/OrderTicket.entity";
import { ReservationTicketEntity } from "../infrastructure/entity/ReservationTicket.entity";
import { SeatEntity } from "../infrastructure/entity/Seat.entity";
import { UserEntity } from "../infrastructure/entity/User.entity";
import { UserPointLogEntity } from "../infrastructure/entity/UserPointLog.entity";
import { PerformanceEntity } from "../infrastructure/entity/Performance.entity";

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
      UserQueueEntity,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class EntityModule {}
