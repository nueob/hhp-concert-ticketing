import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";

import { UserService } from "../domain/service/User.service";
import { PointTransactionTypeEnum } from "../enum/PointTransactionType.enum";

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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    try {
      const user = await this.userService.findByUuid(uuid, manager);
      const point = user.point + amount;

      await Promise.all([
        this.userService.updatePoint(uuid, point, manager),
        this.userService.insertPointHistory(
          uuid,
          point,
          PointTransactionTypeEnum.충전,
          manager,
        ),
      ]);

      await queryRunner.commitTransaction();

      return point;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
