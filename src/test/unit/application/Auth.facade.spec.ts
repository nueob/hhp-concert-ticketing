import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../../domain/service/User.service";
import { User } from "../../../domain/User.domain";
import { AuthFacade } from "../../../application/Auth.facade";
import { UserErrorCodeEnum } from "../../../enum/UserErrorCode.enum";

describe("accessToken을 생성한다.", () => {
  let authFacade: AuthFacade;
  let jwtService: JwtService;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthFacade,
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
            createWaitingQueue: jest.fn(),
          },
        },
      ],
    }).compile();

    authFacade = module.get<AuthFacade>(AuthFacade);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  describe("createToken: access token을 생성한다.", () => {
    test("정상 요청", async () => {
      //given
      const uuid = "00001";
      const user = new User(uuid);
      user.isWaiting = jest.fn().mockReturnValue(false);
      user.isActive = jest.fn().mockReturnValue(false);

      jest
        .spyOn(userService, "findByUuid")
        .mockReturnValue(Promise.resolve(user));
      //when
      await authFacade.createToken(uuid);
      //then
      expect(userService.findByUuid).toHaveBeenCalled();
      expect(userService.createWaitingQueue).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalled();
    });

    test("대기 중인 토큰이 있을 경우 error를 던진다.", async () => {
      //given
      const uuid = "00001";
      const user = new User(uuid);
      user.isWaiting = jest.fn().mockReturnValue(true);

      jest
        .spyOn(userService, "findByUuid")
        .mockReturnValue(Promise.resolve(user));
      //when
      //then
      await expect(authFacade.createToken(uuid)).rejects.toThrow(
        new Error(UserErrorCodeEnum.이미_발급받은_토큰.message),
      );
    });

    test("활성화 토큰이 있을 경우 error를 던진다.", async () => {
      //given
      const uuid = "00001";
      const user = new User(uuid);
      user.isWaiting = jest.fn().mockReturnValue(false);
      user.isActive = jest.fn().mockReturnValue(true);

      jest
        .spyOn(userService, "findByUuid")
        .mockReturnValue(Promise.resolve(user));
      //when
      //then
      await expect(authFacade.createToken(uuid)).rejects.toThrow(
        new Error(UserErrorCodeEnum.이미_발급받은_토큰.message),
      );
    });
  });
});
