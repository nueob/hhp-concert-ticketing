import { Injectable } from "@nestjs/common";
import { AuthUseCase } from "./interface/Auth.usecase.interface";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../domain/service/User.service";
import { UserErrorCodeEnum } from "../../enum/UserErrorCode.enum";

@Injectable()
export class AuthUseCaseImpl implements AuthUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async createToken(uuid: string): Promise<string> {
    const user = await this.userService.findByUuid(uuid);
    if (!user) {
      throw new Error(UserErrorCodeEnum.존재하지_않는_유저.message);
    }

    const accessToken = this.jwtService.sign({ uuid });

    return accessToken;
  }
}
