import { PointTransactionTypeEnum } from "../enum/PointTransactionType.enum";
import { UserRepositoryInterface } from "../domain/repository/User.repository.interface";
import { User } from "../domain/User.domain";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/User.entity";
import { Or, Repository } from "typeorm";
import { UserPointLogEntity } from "./entity/UserPointLog.entity";
import { UserMapper } from "@root/mapper/User.mapper";
import { WaitingQueueStatusEnum } from "@root/enum/WaitingQueueStatus.enum";

@Injectable()
export class UserRepositoryImpl implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserPointLogEntity)
    private readonly userPointLogRepository: Repository<UserPointLogEntity>,
  ) {}

  async findByUuid(uuid: string): Promise<User> {
    return UserMapper.mapToUserDomain(
      await this.userRepository.findOne({
        relations: { userQueueList: true },
        where: {
          uuid,
        },
      }),
    );
  }

  createWaitingQueue(uuid: string) {
    return Promise.resolve(new User());
  }

  async updatePoint(uuid: string, point: number): Promise<void> {
    const userEntity = new UserEntity();
    userEntity.point = point;

    await this.userRepository.update(uuid, userEntity);

    return;
  }

  async insertPointHistory(
    uuid: string,
    amount: number,
    transactionType: PointTransactionTypeEnum,
  ): Promise<void> {
    const userPointLogEntity = new UserPointLogEntity();
    userPointLogEntity.user_uuid = uuid;
    userPointLogEntity.amount = amount;
    userPointLogEntity.transactionType = transactionType;

    await this.userPointLogRepository.save(
      this.userPointLogRepository.create(userPointLogEntity),
    );

    return;
  }
}
