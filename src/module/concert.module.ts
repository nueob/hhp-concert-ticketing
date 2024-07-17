import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";

import { AuthController } from "../presentation/Auth.controller";
import { UserController } from "../presentation/User.controller";
import { ConcertController } from "../presentation/Concert.controller";
import { OrderController } from "../presentation/Order.controller";
import { AuthFacade } from "../application/Auth.facade";
import { ConcertFacade } from "../application/Concert.facade";
import { OrderFacade } from "../application/Order.facade";
import { UserFacade } from "../application/User.facade";
import { ConcertService } from "../domain/service/Concert.service";
import { OrderService } from "../domain/service/Order.service";
import { UserService } from "../domain/service/User.service";
import { ConcertRepositoryImpl } from "../infrastructure/Concert.repository.impl";
import { OrderRepositoryImpl } from "../infrastructure/Order.repository.impl";
import { UserRepositoryImpl } from "../infrastructure/User.repository.impl";
import { ScheduleModule } from "@nestjs/schedule";
import { UserQueueScheduler } from "../presentation/UserQueue.scheduler";
import { SchedulerFacade } from "../application/Scheduler.facade";
import { QueueService } from "../domain/service/Queue.service";
import { WaitingQueueRepositoryImpl } from "../infrastructure/WaitingQueue.repository.impl";
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
    ScheduleModule.forRoot(),
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
  controllers: [
    AuthController,
    UserController,
    ConcertController,
    OrderController,
    UserController,
  ],
  providers: [
    UserQueueScheduler,
    AuthFacade,
    ConcertFacade,
    OrderFacade,
    UserFacade,
    SchedulerFacade,
    JwtService,
    ConcertService,
    OrderService,
    UserService,
    QueueService,
    {
      provide: "ConcertRepositoryInterface",
      useClass: ConcertRepositoryImpl,
    },
    {
      provide: "OrderRepositoryInterface",
      useClass: OrderRepositoryImpl,
    },
    {
      provide: "UserRepositoryInterface",
      useClass: UserRepositoryImpl,
    },
    {
      provide: "WaitingQueueRepositoryInterface",
      useClass: WaitingQueueRepositoryImpl,
    },
  ],
})
export class ConcertModule {}
