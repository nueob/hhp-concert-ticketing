import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";

import { UserService } from "../domain/service/User.service";
import { PointTransactionTypeEnum } from "../enum/PointTransactionType.enum";
import { UserErrorCodeEnum } from "../enum/UserErrorCode.enum";

@Injectable()
export class UserFacade {
  constructor(
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    try {
      const [userAfterSave] = await Promise.all([
        this.userService.updatePoint(uuid, point, user.version, manager),
        this.userService.insertPointHistory(
          uuid,
          point,
          PointTransactionTypeEnum.충전,
          manager,
        ),
      ]);
      if (user.version + 1 !== userAfterSave.version) {
        throw new Error(UserErrorCodeEnum.동시성_이슈.message);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }

    return point;
  }
}
