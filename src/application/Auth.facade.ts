import { Injectable } from "@nestjs/common";
import { AuthUseCase } from "./useCase/interface/Auth.usecase.interface";

@Injectable()
export class AuthFacade {
  constructor(private readonly authUseCase: AuthUseCase) {}

  createToken(uuid: string): Promise<string> {
    return this.authUseCase.createToken(uuid);
  }
}
