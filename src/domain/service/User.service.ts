import { Inject, Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";

import { PointTransactionTypeEnum } from "../../enum/PointTransactionType.enum";
import { UserErrorCodeEnum } from "../../enum/UserErrorCode.enum";

import { User } from "../User.domain";
import { UserRepositoryInterface } from "../repository/User.repository.interface";

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

  createWaitingQueue(uuid: string): Promise<User> {
    return this.userRepositoryInterface.createWaitingQueue(uuid);
  }

  updatePoint(
    uuid: string,
    amount: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<User> {
    return this.userRepositoryInterface.updatePoint(
      uuid,
      amount,
      transactionalEntityManager,
    );
  }

  insertPointHistory(
    uuid: string,
    amount: number,
    transactionType: PointTransactionTypeEnum,
    transactionalEntityManager?: EntityManager,
  ): Promise<void> {
    return this.userRepositoryInterface.insertPointHistory(
      uuid,
      amount,
      transactionType,
      transactionalEntityManager,
    );
  }
}
