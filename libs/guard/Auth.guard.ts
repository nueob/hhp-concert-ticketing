import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { UserService } from "../../src/domain/service/User.service";
import { AuthErrorCodeEnum } from "../../src/enum/AuthErrorCode.enum";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const accessToken = request.headers["x-access-token"];
    if (!accessToken) {
      throw new Error(AuthErrorCodeEnum.ACCESS_TOKEN_누락.message);
    }

    const uuid = this.jwtService.verify(accessToken);
    const user = await this.userService.findByUuid(uuid);
    if (!user || !user.waitingQueue || !user.isActive()) {
      return false;
    }

    request.user = user;

    return true;
  }
}
