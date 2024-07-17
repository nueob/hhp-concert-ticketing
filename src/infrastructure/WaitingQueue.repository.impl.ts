import { Injectable } from "@nestjs/common";
import { WaitingQueueRepositoryInterface } from "../domain/repository/WaitingQueue.repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { UserQueueEntity } from "./entity/UserQueue.entity";
import { In, LessThan, Repository } from "typeorm";
import { WaitingQueue } from "@root/domain/WaitingQueue.domain";
import { WaitingQueueMapper } from "@root/mapper/WaitingQueue.mapper";
import { WaitingQueueStatusEnum } from "@root/enum/WaitingQueueStatus.enum";

@Injectable()
export class WaitingQueueRepositoryImpl
  implements WaitingQueueRepositoryInterface
{
  constructor(
    @InjectRepository(UserQueueEntity)
    private readonly userQueueRepository: Repository<UserQueueEntity>,
  ) {}

  async findAfterTime(time: Date): Promise<WaitingQueue[]> {
    const tokenList = await this.userQueueRepository.find({
      where: {
        created_at: LessThan(time),
      },
    });

    return tokenList.map((token) => {
      return WaitingQueueMapper.mapToWaitingQueueDomain(token);
    });
  }

  async findByLimitCount(count: number): Promise<WaitingQueue[]> {
    const tokenList = await this.userQueueRepository.find({
      order: {
        created_at: "DESC",
      },
      take: count,
    });

    return tokenList.map((token) => {
      return WaitingQueueMapper.mapToWaitingQueueDomain(token);
    });
  }

  async expireOldTokens(ids: number[]): Promise<void> {
    const userQueueEntity = new UserQueueEntity();
    userQueueEntity.status = WaitingQueueStatusEnum.만료;

    await this.userQueueRepository.update({ id: In(ids) }, userQueueEntity);

    return;
  }

  async activatePendingTokens(ids: number[]): Promise<void> {
    const userQueueEntity = new UserQueueEntity();
    userQueueEntity.status = WaitingQueueStatusEnum.활성화;

    await this.userQueueRepository.update({ id: In(ids) }, userQueueEntity);

    return;
  }
}
