import { Module } from "@nestjs/common";

import { EntityModule } from "./Entity.module";
import { SchedulerFacade } from "../application/Scheduler.facade";
import { QueueService } from "../domain/service/Queue.service";
import { WaitingQueueRepositoryImpl } from "../infrastructure/WaitingQueue.repository.impl";
import { UserQueueScheduler } from "../presentation/UserQueue.scheduler";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { RedisClient } from "@root/infrastructure/redis/Redis.client";
import { OutBoxService } from "@root/domain/service/OutBox.service";
import { OutBoxRepositoryImpl } from "@root/infrastructure/OutBox.repository.impl";
import { PayDoneMessageSenderImpl } from "@root/infrastructure/kafka/PayDone.message-sender.impl";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    EntityModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ".env",
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore as any,
        host: configService.get<string>("REDIS_HOST", "localhost"),
        port: configService.get<number>("REDIS_PORT", 6379),
        ttl: configService.get<number>("CACHE_TTL", 300),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: "PAY_DONE",
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ["localhost:9092"],
          },
        },
      },
    ]),
  ],
  providers: [
    RedisClient,
    UserQueueScheduler,
    SchedulerFacade,
    QueueService,
    OutBoxService,
    {
      provide: "WaitingQueueRepositoryInterface",
      useClass: WaitingQueueRepositoryImpl,
    },
    {
      provide: "OutBoxRepositoryInterface",
      useClass: OutBoxRepositoryImpl,
    },
    {
      provide: "PayDoneMessageSender",
      useClass: PayDoneMessageSenderImpl,
    },
  ],
})
export class UserQueueModule {}
