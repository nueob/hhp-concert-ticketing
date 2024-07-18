import { Module } from "@nestjs/common";

import { UserController } from "../presentation/User.controller";
import { UserFacade } from "../application/User.facade";
import { UserService } from "../domain/service/User.service";
import { UserRepositoryImpl } from "../infrastructure/User.repository.impl";
import { EntityModule } from "./Entity.module";

@Module({
  imports: [EntityModule],
  controllers: [UserController],
  providers: [
    UserFacade,
    UserService,
    {
      provide: "UserRepositoryInterface",
      useValue: UserRepositoryImpl,
    },
  ],
})
export class UserModule {}
