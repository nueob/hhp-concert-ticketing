import { Injectable } from "@nestjs/common";
import { UserUseCase } from "./useCase/interface/User.usecase.interface";

@Injectable()
export class UserFacade {
  constructor(private readonly userUseCase: UserUseCase) {}

  async findPointByUuid(uuid: string): Promise<number> {
    return this.userUseCase.findPointByUuid(uuid);
  }

  async chargePointByUuid(uuid: string, amount: number): Promise<number> {
    return this.userUseCase.chargePointByUuid(uuid, amount);
  }
}
