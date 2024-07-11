import { PointTransactionTypeEnum } from "@root/enum/PointTransactionType.enum";
import { User } from "../User.domain";

export interface UserRepositoryInterface {
  findByUuid(uuid: string): Promise<User>;
  chargePoint(uuid: string, amount: number): Promise<void>;
  insertPointHistory(
    uuid: string,
    amount: number,
    transactionType: PointTransactionTypeEnum,
  ): Promise<void>;
}