import { Injectable } from "@nestjs/common";
import { UserService } from "../domain/service/User.service";
import { PointTransactionTypeEnum } from "../enum/PointTransactionType.enum";

@Injectable()
export class UserFacade {
  constructor(private readonly userService: UserService) {}

  async checkUserActivation(uuid: string): Promise<boolean> {
    const user = await this.userService.findByUuid(uuid);

    return user.isActive();
  }

  async findPointByUuid(uuid: string): Promise<number> {
    const user = await this.userService.findByUuid(uuid);

    return user.point;
  }

  async chargePointByUuid(uuid: string, amount: number): Promise<number> {
    const user = await this.userService.findByUuid(uuid);
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
