import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "../presentation/Auth.controller";
import { AuthFacade } from "../application/Auth.facade";
import { UserService } from "../domain/service/User.service";
import { UserRepositoryImpl } from "../infrastructure/User.repository.impl";
import { EntityModule } from "./Entity.module";

@Module({
  imports: [
    EntityModule,
    JwtModule.register({
      secret: "belee",
      signOptions: { expiresIn: "60m" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthFacade,
    UserService,
    {
      provide: "UserRepositoryInterface",
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [JwtModule, UserService],
})
export class AuthModule {}
