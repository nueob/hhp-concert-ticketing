import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";

import { ScheduleModule } from "@nestjs/schedule";
import { AuthModule } from "./modules/Auth.module";
import { ConcertModule } from "./modules/Concert.module";
import { EntityModule } from "./modules/Entity.module";
import { OrderModule } from "./modules/Order.module";
import { UserModule } from "./modules/User.module";
import { UserQueueModule } from "./modules/UserQueue.module";
import { UserQueueEntity } from "./infrastructure/entity/UserQueue.entity";
import { ConcertEntity } from "./infrastructure/entity/Concert.entity";
import { OrderTicketEntity } from "./infrastructure/entity/OrderTicket.entity";
import { ReservationTicketEntity } from "./infrastructure/entity/ReservationTicket.entity";
import { SeatEntity } from "./infrastructure/entity/Seat.entity";
import { UserEntity } from "./infrastructure/entity/User.entity";
import { UserPointLogEntity } from "./infrastructure/entity/UserPointLog.entity";
import { PerformanceEntity } from "./infrastructure/entity/Performance.entity";

import { GlobalExceptionFilter } from "../libs/filter/GlobalException.filter";
import { WinstonLogger } from "../libs/config/WinstonLogger";
import { TransformInterceptor } from "../libs/interceptor/Transform.interceptor";

@Module({
  imports: [
    AuthModule,
    ConcertModule,
    EntityModule,
    OrderModule,
    UserModule,
    UserQueueModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "user",
      password: "123",
      database: "concert",
      entities: [
        ConcertEntity,
        OrderTicketEntity,
        PerformanceEntity,
        ReservationTicketEntity,
        SeatEntity,
        UserEntity,
        UserPointLogEntity,
        UserQueueEntity,
      ],
    }),
  ],
  providers: [
    {
      provide: "LoggerService",
      useValue: new WinstonLogger().logger,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
