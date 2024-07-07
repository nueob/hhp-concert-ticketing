import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthUseCaseImpl } from "../../../../application/useCase/Auth.usecase.impl";
import { UserService } from "../../../../domain/service/User.service";
import { UserErrorCodeEnum } from "../../../../enum/UserErrorCode.enum";
import { User } from "../../../../domain/User.domain";

describe("accessToken을 생성한다.", () => {
  let authUseCaseImpl: AuthUseCaseImpl;
  let jwtService: JwtService;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthUseCaseImpl,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findByUuid: jest.fn(),
          },
        },
      ],
    }).compile();

    authUseCaseImpl = module.get<AuthUseCaseImpl>(AuthUseCaseImpl);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  describe("createToken: access token을 생성한다.", () => {
    test("createToken: access token을 생성한다.", async () => {
      //given
      const uuid = "00001";

      jest
        .spyOn(userService, "findByUuid")
        .mockReturnValue(Promise.resolve(new User(uuid)));
      //when
      await authUseCaseImpl.createToken(uuid);
      //then
      expect(userService.findByUuid).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalled();
    });

    test("createToken: 없는 유저일 경우 error를 던진다.", async () => {
      //given
      const uuid = "00001";

      jest.spyOn(userService, "findByUuid").mockReturnValue(null);
      //when
      //then
      await expect(authUseCaseImpl.createToken(uuid)).rejects.toThrow(
        new Error(UserErrorCodeEnum.존재하지_않는_유저.message),
      );
    });
  });
});
