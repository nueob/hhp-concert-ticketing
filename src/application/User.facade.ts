import { DataSource } from "typeorm";
import { Injectable } from "@nestjs/common";

import { UserService } from "../domain/service/User.service";
import { PointTransactionTypeEnum } from "../enum/PointTransactionType.enum";
import { UserErrorCodeEnum } from "../enum/UserErrorCode.enum";
import { QueueService } from "@root/domain/service/Queue.service";

@Injectable()
export class UserFacade {
  constructor(
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    private readonly queueService: QueueService,
  ) {}

  async findRank(uuid: string): Promise<number> {
    /**
     * 1. 대기열에 등록되어 있는 지 확인 -> 등록 되어 있다면 순위 "반환"
     * 2. 대기열 등록
     * 3. 대기열 순위 반환
     */
    const waitingRank = await this.queueService.findWaitingRankByToken(uuid);
    if (waitingRank > 0) {
      return waitingRank;
    }

    await this.queueService.setWaitingRankByToken(uuid);

    return this.queueService.findWaitingRankByToken(uuid);
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
