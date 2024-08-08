import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

import { EntityModule } from "./Entity.module";
import { AuthModule } from "./Auth.module";

import { OrderController } from "../presentation/Order.controller";

import { SavePaymentInfoCommand } from "../application/command/SavePaymentInfo.command";
import { SavePaymentInfoHandler } from "../application/command/SavePaymentInfo.handler";
import { OrderFacade } from "../application/Order.facade";
import { ConcertService } from "../domain/service/Concert.service";
import { UserService } from "../domain/service/User.service";

import { OrderService } from "../domain/service/Order.service";

import { OrderRepositoryImpl } from "../infrastructure/Order.repository.impl";
import { ConcertRepositoryImpl } from "../infrastructure/Concert.repository.impl";
import { UserRepositoryImpl } from "../infrastructure/User.repository.impl";

@Module({
  imports: [EntityModule, AuthModule, CqrsModule],
  controllers: [OrderController],
  providers: [
    SavePaymentInfoCommand,
    SavePaymentInfoHandler,
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
