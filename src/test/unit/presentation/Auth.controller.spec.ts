import { AuthFacade } from "../../../application/Auth.facade";
import { AuthController } from "../../../presentation/Auth.controller";
import { CreateApiKeyRequestDTO } from "../../../presentation/dto/req/CreateApiKey.req.dto";
import { CreateApiKeyResponseDTO } from "../../../presentation/dto/res/CreateApiKey.res.dto";

describe("AuthController Unit Test", () => {
  let authController: AuthController;
  let authFacade: AuthFacade;

  beforeAll(() => {
    authFacade = new AuthFacade();
    authFacade.createToken = jest.fn();

    authController = new AuthController(authFacade);
  });

  test("createApiKey: api key를 발급한다.", async () => {
    //given
    const createApiKeyRequestDTO = new CreateApiKeyRequestDTO();
    //when
    const response = await authController.createApiKey(createApiKeyRequestDTO);
    //then
    expect(response).toBeInstanceOf(CreateApiKeyResponseDTO);
    expect(authFacade.createToken).toHaveBeenCalled();
  });
});
