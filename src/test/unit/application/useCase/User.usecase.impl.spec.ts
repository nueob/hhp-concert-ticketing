import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../../../domain/service/User.service";
import { UserErrorCodeEnum } from "../../../../enum/UserErrorCode.enum";
import { User } from "../../../../domain/User.domain";
import { UserUseCaseImpl } from "../../../../application/useCase/User.usecase.impl";

describe("UserUseCaseImpl unit test", () => {
  let userUseCaseImpl: UserUseCaseImpl;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserUseCaseImpl,
        {
          provide: UserService,
          useValue: {
            findByUuid: jest.fn(),
            chargePoint: jest.fn(),
            insertPointHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    userUseCaseImpl = module.get<UserUseCaseImpl>(UserUseCaseImpl);
    userService = module.get<UserService>(UserService);
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
      const response = await userUseCaseImpl.findPointByUuid(uuid);
      //then
      expect(response).toEqual(point);
      expect(userService.findByUuid).toHaveBeenCalled();
    });

    test("없는 유저일 경우 error를 던진다.", async () => {
      //given
      const uuid = "00001";

      jest.spyOn(userService, "findByUuid").mockReturnValue(null);
      //when
      //then
      await expect(userUseCaseImpl.findPointByUuid(uuid)).rejects.toThrow(
        new Error(UserErrorCodeEnum.존재하지_않는_유저.message),
      );
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
      const response = await userUseCaseImpl.chargePointByUuid(uuid, amount);
      //then
      expect(response).toEqual(point + amount);
      expect(userService.chargePoint).toHaveBeenCalled();
      expect(userService.insertPointHistory).toHaveBeenCalled();
    });

    test("없는 유저일 경우 error를 던진다.", async () => {
      //given
      const uuid = "00001";
      const amount = 1000;

      jest.spyOn(userService, "findByUuid").mockReturnValue(null);
      //when
      //then
      await expect(
        userUseCaseImpl.chargePointByUuid(uuid, amount),
      ).rejects.toThrow(
        new Error(UserErrorCodeEnum.존재하지_않는_유저.message),
      );
    });
  });
});
