import { PointTransactionTypeEnum } from "src/enum/PointTransactionType.enum";
import { User } from "../User.domain";

export class UserService {
  findByUuid(uuid: string): Promise<User | undefined> {
    return;
  }
  chargePoint(uuid: string, amount: number): Promise<void> {
    return;
  }
  insertPointHistory(
    uuid: string,
    amount: number,
    transactionType: PointTransactionTypeEnum,
  ): Promise<void> {
    return;
  }
}
