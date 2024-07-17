import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../../domain/service/User.service";
import { User } from "../../../domain/User.domain";
import { UserFacade } from "../../../application/User.facade";

describe("UserFacade unit test", () => {
  let userFacade: UserFacade;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFacade,
        {
          provide: UserService,
          useValue: {
            findByUuid: jest.fn(),
            updatePoint: jest.fn(),
            insertPointHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    userFacade = module.get<UserFacade>(UserFacade);
    userService = module.get<UserService>(UserService);
  });

  describe("checkUserActivation: 활성화 유저인지 반환한다.", () => {
    test("정상 요청, 활성화 유저일 경우 true를 반환한다.", async () => {
      //given
      const uuid = "00001";
      const user = new User(uuid);
      user.isActive = jest.fn().mockReturnValue(true);

      jest
        .spyOn(userService, "findByUuid")
        .mockReturnValue(Promise.resolve(user));
      //when
      const response = await userFacade.checkUserActivation(uuid);
      //then
      expect(response).toBeTruthy();
      expect(userService.findByUuid).toHaveBeenCalled();
    });
    test("정상 요청, 활성화 유저가 아닐 경우 false를 반환한다.", async () => {
      //given
      const uuid = "00001";
      const user = new User(uuid);
      user.isActive = jest.fn().mockReturnValue(false);

      jest
        .spyOn(userService, "findByUuid")
        .mockReturnValue(Promise.resolve(user));
      //when
      const response = await userFacade.checkUserActivation(uuid);
      //then
      expect(response).toBeFalsy();
      expect(userService.findByUuid).toHaveBeenCalled();
    });
  });

  describe("findPointByUuid: 포인트를 조회한다.", () => {
    test("정상 요청", async () => {
      //given
      const uuid = "00001";
      const point = 1000;

      jest
        .spyOn(userService, "findByUuid")
        .mockReturnValue(Promise.resolve(new User(uuid, point)));
      //when
      const response = await userFacade.findPointByUuid(uuid);
      //then
      expect(response).toEqual(point);
      expect(userService.findByUuid).toHaveBeenCalled();
    });
  });

  describe("chargePointByUuid: 포인트를 충전한다.", () => {
    test("정상 요청", async () => {
      //given
      const uuid = "00001";
      const point = 1000;
      const amount = 1000;

      jest
        .spyOn(userService, "findByUuid")
        .mockReturnValue(Promise.resolve(new User(uuid, point)));
      //when
      const response = await userFacade.chargePointByUuid(uuid, amount);
      //then
      expect(response).toEqual(point + amount);
      expect(userService.updatePoint).toHaveBeenCalled();
      expect(userService.insertPointHistory).toHaveBeenCalled();
    });
  });
});
