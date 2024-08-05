import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserService } from "../../src/domain/service/User.service";
import { QueueService } from "../../src/domain/service/Queue.service";

import { AuthErrorCodeEnum } from "../../src/enum/AuthErrorCode.enum";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly queueService: QueueService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const accessToken = request.headers["x-access-token"];
    if (!accessToken) {
      throw new Error(AuthErrorCodeEnum.ACCESS_TOKEN_누락.message);
    }

    const uuid = this.jwtService.verify(accessToken);
    const user = await this.userService.findByUuid(uuid);
    if (!user) {
      return false;
    }

    const activeUser = await this.queueService.findActiveUserByToken(uuid);
    if (!activeUser) {
      throw new Error(AuthErrorCodeEnum.대기열_등록_요청.message);
    }

    request.user = user;

    return true;
  }
}
