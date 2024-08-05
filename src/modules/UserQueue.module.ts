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
  ],
  providers: [
    RedisClient,
    UserQueueScheduler,
    SchedulerFacade,
    QueueService,
    {
      provide: "WaitingQueueRepositoryInterface",
      useClass: WaitingQueueRepositoryImpl,
    },
  ],
})
export class UserQueueModule {}
