import { AuthUseCase } from "../../../../application/useCase/interface/Auth.usecase.interface";

export class AuthUseCaseStub implements AuthUseCase {
  createToken(uuid: string): Promise<string> {
    return Promise.resolve(`${uuid}_accessToken`);
  }
}
