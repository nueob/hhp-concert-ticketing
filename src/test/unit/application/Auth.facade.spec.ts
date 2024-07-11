import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../../domain/service/User.service";
import { User } from "../../../domain/User.domain";
import { AuthFacade } from "../../../application/Auth.facade";

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
          },
        },
      ],
    }).compile();

    authFacade = module.get<AuthFacade>(AuthFacade);
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
      await authFacade.createToken(uuid);
      //then
      expect(userService.findByUuid).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });
});
