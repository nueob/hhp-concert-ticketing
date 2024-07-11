import { Inject, Injectable } from "@nestjs/common";
import { User } from "../User.domain";
import { UserRepositoryInterface } from "../repository/User.repository.interface";
import { UserErrorCodeEnum } from "../../enum/UserErrorCode.enum";

@Injectable()
export class UserService {
  constructor(
    @Inject("UserRepositoryInterface")
    private readonly userRepositoryInterface: UserRepositoryInterface,
  ) {}

  async findByUuid(uuid: string): Promise<User | undefined> {
    const user = await this.userRepositoryInterface.findByUuid(uuid);
    if (!user) {
      throw new Error(UserErrorCodeEnum.존재하지_않는_유저.message);
    }

    return user;
  }
}
