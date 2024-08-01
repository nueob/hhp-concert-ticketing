import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "../presentation/Auth.controller";
import { AuthFacade } from "../application/Auth.facade";
import { UserService } from "../domain/service/User.service";
import { UserRepositoryImpl } from "../infrastructure/User.repository.impl";
import { EntityModule } from "./Entity.module";
import { QueueService } from "@root/domain/service/Queue.service";
import { WaitingQueueRepositoryImpl } from "@root/infrastructure/WaitingQueue.repository.impl";
import { RedisClient } from "@root/infrastructure/redis/Redis.client";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";

@Module({
  imports: [
    EntityModule,
    JwtModule.register({
      secret: "belee",
      signOptions: { expiresIn: "60m" },
    }),
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
  controllers: [AuthController],
  providers: [
    RedisClient,
    AuthFacade,
    UserService,
    QueueService,
    {
      provide: "UserRepositoryInterface",
      useClass: UserRepositoryImpl,
    },
    {
      provide: "WaitingQueueRepositoryInterface",
      useValue: WaitingQueueRepositoryImpl,
    },
  ],
  exports: [JwtModule, UserService, QueueService],
})
export class AuthModule {}
