import { UserUseCase } from "./interface/User.usecase.interface";
import { Injectable } from "@nestjs/common";
import { UserService } from "../../domain/service/User.service";
import { PointTransactionTypeEnum } from "../../enum/PointTransactionType.enum";
import { UserErrorCodeEnum } from "../../enum/UserErrorCode.enum";

@Injectable()
export class UserUseCaseImpl implements UserUseCase {
  constructor(private readonly userService: UserService) {}

  async findPointByUuid(uuid: string): Promise<number> {
    const user = await this.userService.findByUuid(uuid);
    if (!user) {
      throw new Error(UserErrorCodeEnum.존재하지_않는_유저.message);
    }

    return user.point;
  }

  async chargePointByUuid(uuid: string, amount: number): Promise<number> {
    const user = await this.userService.findByUuid(uuid);
    if (!user) {
      throw new Error(UserErrorCodeEnum.존재하지_않는_유저.message);
    }

    const point = user.point + amount;

    await Promise.all([
      this.userService.chargePoint(uuid, point),
      this.userService.insertPointHistory(
        uuid,
        point,
        PointTransactionTypeEnum.충전,
      ),
    ]);

    return point;
  }
}
