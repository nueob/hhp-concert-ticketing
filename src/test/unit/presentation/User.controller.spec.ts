import { UserService } from "@root/domain/service/User.service";
import { UserFacade } from "../../../application/User.facade";
import { UserPointResponseDTO } from "../../../presentation/dto/res/UserPoint.res.dto";
import { UserController } from "../../../presentation/User.controller";

describe("UserController unit test", () => {
  let userController: UserController;
  let userFacade: UserFacade;
  let userService: UserService;

  beforeAll(() => {
    userFacade = new UserFacade(userService);
    userFacade.checkUserActivation = jest.fn().mockReturnValue(true);
    userFacade.findPointByUuid = jest.fn();
    userFacade.chargePointByUuid = jest.fn();

    userController = new UserController(userFacade);
  });

  test("checkUserActivation: 활성화 유저 인지 조회한다.", async () => {
    //given
    const uuid = "000001";
    //when
    const response = await userController.checkUserActivation(uuid);
    //then
    expect(response).toBeTruthy();
    expect(userFacade.checkUserActivation).toHaveBeenCalled();
  });

  test("findUserPoint: 유저의 포인트를 조회한다.", async () => {
    //given
    const uuid = "000001";
    //when
    const response = await userController.findUserPoint(uuid);
    //then
    expect(response).toBeInstanceOf(UserPointResponseDTO);
    expect(userFacade.findPointByUuid).toHaveBeenCalled();
  });

  test("chargeUserPoint: 유저의 포인트를 충전한다", async () => {
    //given
    const uuid = "000001";
    const amount = 10000;
    //when
    const response = await userController.chargeUserPoint(uuid, { amount });
    //then
    expect(response).toBeInstanceOf(UserPointResponseDTO);
    expect(userFacade.chargePointByUuid).toHaveBeenCalled();
  });
});
