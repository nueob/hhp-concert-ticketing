import { Module } from "@nestjs/common";

import { EntityModule } from "./Entity.module";
import { OrderController } from "../presentation/Order.controller";
import { OrderService } from "../domain/service/Order.service";
import { OrderRepositoryImpl } from "../infrastructure/Order.repository.impl";
import { OrderFacade } from "@root/application/Order.facade";
import { ConcertService } from "@root/domain/service/Concert.service";
import { UserService } from "@root/domain/service/User.service";
import { ConcertRepositoryImpl } from "@root/infrastructure/Concert.repository.impl";
import { UserRepositoryImpl } from "@root/infrastructure/User.repository.impl";
import { AuthModule } from "./Auth.module";

@Module({
  imports: [EntityModule, AuthModule],
  controllers: [OrderController],
  providers: [
    OrderFacade,
    OrderService,
    ConcertService,
    UserService,
    {
      provide: "OrderRepositoryInterface",
      useValue: OrderRepositoryImpl,
    },
    {
      provide: "ConcertRepositoryInterface",
      useValue: ConcertRepositoryImpl,
    },
    {
      provide: "UserRepositoryInterface",
      useValue: UserRepositoryImpl,
    },
  ],
})
export class OrderModule {}
