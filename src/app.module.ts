import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_FILTER } from "@nestjs/core";

import { ScheduleModule } from "@nestjs/schedule";
import { UserQueueScheduler } from "./presentation/UserQueue.scheduler";
import { AuthModule } from "./modules/Auth.module";
import { ConcertModule } from "./modules/Concert.module";
import { EntityModule } from "./modules/Entity.module";
import { OrderModule } from "./modules/Order.module";
import { UserModule } from "./modules/User.module";
import { UserQueueModule } from "./modules/UserQueue.module";

import { GlobalExceptionFilter } from "libs/filter/GlobalException.filter";

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
      synchronize: true,
    }),
  ],
  providers: [
    UserQueueScheduler,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
