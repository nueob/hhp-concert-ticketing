import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ScheduleModule } from "@nestjs/schedule";
import { UserQueueScheduler } from "./presentation/UserQueue.scheduler";
import { AuthModule } from "./modules/Auth.module";
import { ConcertModule } from "./modules/Concert.module";
import { EntityModule } from "./modules/Entity.module";
import { OrderModule } from "./modules/Order.module";
import { UserModule } from "./modules/User.module";
import { UserQueueModule } from "./modules/UserQueue.module";

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
  providers: [UserQueueScheduler],
})
export class AppModule {}
