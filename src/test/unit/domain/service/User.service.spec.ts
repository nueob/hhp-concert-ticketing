import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../../../domain/service/User.service";
import { User } from "../../../../domain/User.domain";
import { UserRepositoryInterface } from "../../../../domain/repository/User.repository.interface";
import { UserErrorCodeEnum } from "../../../../enum/UserErrorCode.enum";

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
});
