import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../domain/service/User.service";

@Injectable()
export class AuthFacade {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async createToken(uuid: string): Promise<string> {
    await this.userService.findByUuid(uuid);

    const accessToken = this.jwtService.sign({ uuid });

    return accessToken;
  }
}
