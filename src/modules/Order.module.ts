import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ClientsModule, Transport } from "@nestjs/microservices";

import { EntityModule } from "./Entity.module";
import { AuthModule } from "./Auth.module";

import { OrderController } from "../presentation/Order.controller";

import { OrderFacade } from "../application/Order.facade";
import { ConcertService } from "../domain/service/Concert.service";
import { UserService } from "../domain/service/User.service";
import { QueueService } from "../domain/service/Queue.service";
import { OrderService } from "../domain/service/Order.service";

import { OutBoxService } from "@root/domain/service/OutBox.service";

import { OrderRepositoryImpl } from "../infrastructure/Order.repository.impl";
import { ConcertRepositoryImpl } from "../infrastructure/Concert.repository.impl";
import { UserRepositoryImpl } from "../infrastructure/User.repository.impl";
import { OutBoxRepositoryImpl } from "@root/infrastructure/OutBox.repository.impl";

import { PayDoneEventPublisherImpl } from "../infrastructure/event/PayDone.event-publisher-impl";
import { WaitingQueueRepositoryImpl } from "@root/infrastructure/WaitingQueue.repository.impl";
import { PayDoneMessageSenderImpl } from "@root/infrastructure/kafka/PayDone.message-sender.impl";
import { RedisClient } from "@root/infrastructure/redis/Redis.client";

@Module({
  imports: [
    EntityModule,
    AuthModule,
    CqrsModule,
    ClientsModule.register([
      {
        name: "KAFKA_SERVICE",
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "nestjs-kafka-client",
            brokers: ["localhost:9092"], // Kafka 브로커 주소
          },
          consumer: {
            groupId: "nestjs-group-server",
          },
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderFacade,
    OrderService,
    ConcertService,
    UserService,
    QueueService,
    RedisClient,
    OutBoxService,
    {
      provide: "PayDoneEventPublisher",
      useClass: PayDoneEventPublisherImpl,
    },
    {
      provide: "OrderRepositoryInterface",
      useClass: OrderRepositoryImpl,
    },
    {
      provide: "ConcertRepositoryInterface",
      useClass: ConcertRepositoryImpl,
    },
    {
      provide: "UserRepositoryInterface",
      useClass: UserRepositoryImpl,
    },
    {
      provide: "WaitingQueueRepositoryInterface",
      useClass: WaitingQueueRepositoryImpl,
    },
    {
      provide: "PayDoneMessageSender",
      useClass: PayDoneMessageSenderImpl,
    },
    {
      provide: "OutBoxRepositoryInterface",
      useClass: OutBoxRepositoryImpl,
    },
  ],
})
export class OrderModule {}
