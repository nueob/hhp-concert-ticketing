import { AuthUseCase } from "../../../application/useCase/interface/Auth.usecase.interface";
import { AuthFacade } from "../../../application/Auth.facade";
import { AuthUseCaseStub } from "./stub/Auth.usecase.stub";

describe("AuthFacade Application unit test", () => {
  let authFacade: AuthFacade;
  let authUseCase: AuthUseCase;

  beforeAll(() => {
    authUseCase = new AuthUseCaseStub();
    authFacade = new AuthFacade(authUseCase);
  });

  test("createToken: accessToken을 발급한다.", async () => {
    //given
    const uuid = "00001";
    //when
    const response = await authFacade.createToken(uuid);
    //then
    expect(response).toEqual(`${uuid}_accessToken`);
  });
});
