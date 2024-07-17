import { PointTransactionTypeEnum } from "../../enum/PointTransactionType.enum";
import { User } from "../User.domain";

export interface UserRepositoryInterface {
  findByUuid(uuid: string): Promise<User>;
  createWaitingQueue(uuid: string): Promise<User>;
  updatePoint(uuid: string, amount: number): Promise<void>;
  insertPointHistory(
    uuid: string,
    amount: number,
    transactionType: PointTransactionTypeEnum,
  ): Promise<void>;
}
