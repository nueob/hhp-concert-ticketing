import { PointTransactionTypeEnum } from "../enum/PointTransactionType.enum";
import { UserRepositoryInterface } from "../domain/repository/User.repository.interface";
import { User } from "../domain/User.domain";

export class UserRepositoryImpl implements UserRepositoryInterface {
  findByUuid(uuid: string): Promise<User> {
    return Promise.resolve(new User());
  }
  usePoint(uuid: string, amount: number): Promise<void> {
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
