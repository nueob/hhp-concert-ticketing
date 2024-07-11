import { UserUseCase } from "../../../application/useCase/interface/User.usecase.interface";
import { UserFacade } from "../../../application/User.facade";
import { UserUseCaseStub } from "./stub/User.usecase.stub";

describe("UserFacade unit test", () => {
  let userFacade: UserFacade;
  let userUseCase: UserUseCase;

  beforeAll(() => {
    userUseCase = new UserUseCaseStub();
    userFacade = new UserFacade(userUseCase);
  });

  test("findPointByUuid: 포인트를 조회한다.", async () => {
    //given
    const uuid = "00001";
    //when
    const response = await userFacade.findPointByUuid(uuid);
    //then
    expect(response).toEqual(1000);
  });

  test("chargePointByUuid: 포인트를 충전한다.", async () => {
    //given
    const uuid = "00001";
    const amount = 1000;
    //when
    const response = await userFacade.chargePointByUuid(uuid, amount);
    //then
    expect(response).toEqual(2000);
  });
});
