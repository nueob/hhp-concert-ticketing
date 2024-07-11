import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../../domain/service/User.service";
import { User } from "../../../domain/User.domain";
import { AuthFacade } from "../../../application/Auth.facade";
import { UserRepositoryInterface } from "@root/domain/repository/User.repository.interface";

describe("Auth facade integration", () => {
  let authFacade: AuthFacade;
  let jwtService: JwtService;
  let userRepositoryInterface: UserRepositoryInterface;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthFacade,
        UserService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
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

    authFacade = module.get<AuthFacade>(AuthFacade);
    jwtService = module.get<JwtService>(JwtService);
    userRepositoryInterface = module.get<UserRepositoryInterface>(
      "UserRepositoryInterface",
    );
  });

  describe("createToken: access token을 생성한다.", () => {
    test("createToken: access token을 생성한다.", async () => {
      //given
      const uuid = "00001";

      jest
        .spyOn(userRepositoryInterface, "findByUuid")
        .mockResolvedValue(new User(uuid));
      //when
      await authFacade.createToken(uuid);
      //then
      expect(userRepositoryInterface.findByUuid).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });
});
