import { Module } from "@nestjs/common";

import { EntityModule } from "./Entity.module";
import { OrderController } from "../presentation/Order.controller";
import { OrderService } from "../domain/service/Order.service";
import { OrderRepositoryImpl } from "../infrastructure/Order.repository.impl";
import { OrderFacade } from "@root/application/Order.facade";

@Module({
  imports: [EntityModule],
  controllers: [OrderController],
  providers: [
    OrderFacade,
    OrderService,
    {
      provide: "OrderRepositoryInterface",
      useValue: OrderRepositoryImpl,
    },
  ],
})
export class OrderModule {}
