import { EntityManager, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { PointTransactionTypeEnum } from "../enum/PointTransactionType.enum";

import { UserRepositoryInterface } from "../domain/repository/User.repository.interface";
import { User } from "../domain/User.domain";

import { UserEntity } from "./entity/User.entity";
import { UserPointLogEntity } from "./entity/UserPointLog.entity";

import { UserMapper } from "../mapper/User.mapper";

@Injectable()
export class UserRepositoryImpl implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserPointLogEntity)
    private readonly userPointLogRepository: Repository<UserPointLogEntity>,
  ) {}

  async findByUuid(
    uuid: string,
    transactionalEntityManager?: EntityManager,
  ): Promise<User> {
    if (transactionalEntityManager) {
      return UserMapper.mapToUserDomain(
        await transactionalEntityManager.getRepository(UserEntity).findOne({
          relations: { userQueueList: true },
          where: {
            uuid,
          },
          lock: { mode: "pessimistic_write" },
        }),
      );
    }

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

  async updatePoint(
    uuid: string,
    point: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<User> {
    const user = new UserEntity();
    user.uuid = uuid;
    user.point = point;

    if (transactionalEntityManager) {
      return UserMapper.mapToUserDomain(
        await transactionalEntityManager.getRepository(UserEntity).save(user),
      );
    }

    return UserMapper.mapToUserDomain(await this.userRepository.save(user));
  }

  async insertPointHistory(
    uuid: string,
    amount: number,
    transactionType: PointTransactionTypeEnum,
    transactionalEntityManager?: EntityManager,
  ): Promise<void> {
    const userPointLogEntity = new UserPointLogEntity();
    userPointLogEntity.user_uuid = uuid;
    userPointLogEntity.amount = amount;
    userPointLogEntity.transactionType = transactionType;
    if (transactionalEntityManager) {
      const userPointLog =
        this.userPointLogRepository.create(userPointLogEntity);
      await transactionalEntityManager.save(userPointLog);
      return;
    }

    if (transactionalEntityManager) {
      const userPointLog =
        this.userPointLogRepository.create(userPointLogEntity);

      await transactionalEntityManager.save(userPointLog);
      return;
    }

    await this.userPointLogRepository.save(
      this.userPointLogRepository.create(userPointLogEntity),
    );
  }
}
