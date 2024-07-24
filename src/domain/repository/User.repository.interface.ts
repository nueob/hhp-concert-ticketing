import { EntityManager } from "typeorm";

import { PointTransactionTypeEnum } from "../../enum/PointTransactionType.enum";

import { User } from "../User.domain";

export interface UserRepositoryInterface {
  findByUuid(
    uuid: string,
    transactionalEntityManager?: EntityManager,
  ): Promise<User>;
  createWaitingQueue(uuid: string): Promise<User>;
  updatePoint(
    uuid: string,
    point: number,
    version: number,
    transactionalEntityManager: EntityManager,
  ): Promise<User>;
  insertPointHistory(
    uuid: string,
    amount: number,
    transactionType: PointTransactionTypeEnum,
    transactionalEntityManager?: EntityManager,
  ): Promise<void>;
}
