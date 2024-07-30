import { Module } from "@nestjs/common";

import { UserService } from "../domain/service/User.service";
import { UserRepositoryImpl } from "../infrastructure/User.repository.impl";
import { ConcertController } from "@root/presentation/Concert.controller";
import { ConcertFacade } from "@root/application/Concert.facade";
import { ConcertService } from "@root/domain/service/Concert.service";
import { ConcertRepositoryImpl } from "@root/infrastructure/Concert.repository.impl";
import { EntityModule } from "./Entity.module";
import { AuthModule } from "./Auth.module";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [CacheModule, EntityModule, AuthModule],
  controllers: [ConcertController],
  providers: [
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
