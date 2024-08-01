import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";

import { ConcertController } from "../presentation/Concert.controller";

import { ConcertFacade } from "../application/Concert.facade";

import { UserService } from "../domain/service/User.service";
import { ConcertService } from "../domain/service/Concert.service";

import { UserRepositoryImpl } from "../infrastructure/User.repository.impl";
import { ConcertRepositoryImpl } from "../infrastructure/Concert.repository.impl";
import { RedisClient } from "../infrastructure/redis/Redis.client";

import { EntityModule } from "./Entity.module";
import { AuthModule } from "./Auth.module";

@Module({
  imports: [
    EntityModule,
    AuthModule,
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
  controllers: [ConcertController],
  providers: [
    RedisClient,
    ConcertFacade,
    ConcertService,
    UserService,
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
export class ConcertModule {}
