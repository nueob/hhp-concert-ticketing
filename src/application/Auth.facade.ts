import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../domain/service/User.service";
import { UserErrorCodeEnum } from "../enum/UserErrorCode.enum";

@Injectable()
export class AuthFacade {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async createToken(uuid: string): Promise<string> {
    const user = await this.userService.findByUuid(uuid);
    if (user.isWaiting() || user.isActive()) {
      throw new Error(UserErrorCodeEnum.이미_발급받은_토큰.message);
    }

    await this.userService.createWaitingQueue(uuid);

    const accessToken = this.jwtService.sign({ uuid });

    return accessToken;
  }
}
