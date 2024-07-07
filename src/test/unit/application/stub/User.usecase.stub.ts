import { UserUseCase } from "../../../../application/useCase/interface/User.usecase.interface";

export class UserUseCaseStub implements UserUseCase {
  findPointByUuid(uuid: string): Promise<number> {
    return Promise.resolve(1000);
  }
  chargePointByUuid(uuid: string, amount: number): Promise<number> {
    return Promise.resolve(2000);
  }
}
