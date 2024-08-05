import { Module } from "@nestjs/common";

import { UserController } from "../presentation/User.controller";
import { UserFacade } from "../application/User.facade";
import { UserService } from "../domain/service/User.service";
import { UserRepositoryImpl } from "../infrastructure/User.repository.impl";
import { EntityModule } from "./Entity.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { RedisClient } from "@root/infrastructure/redis/Redis.client";
import { QueueService } from "@root/domain/service/Queue.service";
import { WaitingQueueRepositoryImpl } from "@root/infrastructure/WaitingQueue.repository.impl";

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
  controllers: [UserController],
  providers: [
    RedisClient,
    UserFacade,
    UserService,
    QueueService,
    {
      provide: "UserRepositoryInterface",
      useValue: UserRepositoryImpl,
    },
    {
      provide: "WaitingQueueRepositoryInterface",
      useValue: WaitingQueueRepositoryImpl,
    },
  ],
})
export class UserModule {}
