import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AuthController } from "../presentation/Auth.controller";
import { AuthFacade } from "../application/Auth.facade";
import { UserService } from "../domain/service/User.service";
import { UserRepositoryImpl } from "../infrastructure/User.repository.impl";
import { EntityModule } from "./Entity.module";

@Module({
  imports: [EntityModule],
  controllers: [AuthController],
  providers: [
    AuthFacade,
    JwtService,
    UserService,
    {
      provide: "UserRepositoryInterface",
      useValue: UserRepositoryImpl,
    },
  ],
  exports: [JwtService, UserService],
})
export class AuthModule {}
