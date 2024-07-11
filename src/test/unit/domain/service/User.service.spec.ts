import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../../../domain/service/User.service";
import { User } from "../../../../domain/User.domain";
import { UserRepositoryInterface } from "../../../../domain/repository/User.repository.interface";
import { UserErrorCodeEnum } from "../../../../enum/UserErrorCode.enum";
import { PointTransactionTypeEnum } from "../../../../enum/PointTransactionType.enum";

describe("UserService unit test", () => {
  let userService: UserService;
  let userRepositoryInterface: UserRepositoryInterface;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: "UserRepositoryInterface",
          useValue: {
            findByUuid: jest.fn(),
            chargePoint: jest.fn(),
            insertPointHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepositoryInterface = module.get<UserRepositoryInterface>(
      "UserRepositoryInterface",
    );
  });

  describe("findByUuid: 유저를 찾는다.", () => {
    test("정상 요청", async () => {
      //given
      const uuid = "00001";
      const point = 1000;
      const user = new User(uuid, point);

      jest
        .spyOn(userRepositoryInterface, "findByUuid")
        .mockReturnValue(Promise.resolve(user));
      //when
      const response = await userService.findByUuid(uuid);
      //then
      expect(response).toEqual(user);
      expect(userRepositoryInterface.findByUuid).toHaveBeenCalled();
    });

    test("없는 유저일 경우 error를 던진다.", async () => {
      //given
      const uuid = "00001";

      jest.spyOn(userRepositoryInterface, "findByUuid").mockReturnValue(null);
      //when
      //then
      await expect(userService.findByUuid(uuid)).rejects.toThrow(
        new Error(UserErrorCodeEnum.존재하지_않는_유저.message),
      );
    });
  });

  describe("chargePointByUuid: 포인트를 충전한다.", () => {
    test("정상 요청", async () => {
      //given
      const uuid = "00001";
      const amount = 1000;
      //when
      await userService.chargePoint(uuid, amount);
      //then
      expect(userRepositoryInterface.chargePoint).toHaveBeenCalled();
    });
  });

  describe("insertPointHistory: 포인트를 히스토리를 저장한다.", () => {
    test("정상 요청", async () => {
      //given
      const uuid = "00001";
      const amount = 1000;
      const transactionType = PointTransactionTypeEnum.사용;
      //when
      await userService.insertPointHistory(uuid, amount, transactionType);
      //then
      expect(userRepositoryInterface.insertPointHistory).toHaveBeenCalled();
    });
  });
});
