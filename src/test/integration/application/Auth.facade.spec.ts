import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../../domain/service/User.service";
import { User } from "../../../domain/User.domain";
import { AuthFacade } from "../../../application/Auth.facade";
import { UserRepositoryInterface } from "../../../domain/repository/User.repository.interface";
import { WaitingQueue } from "../../../domain/WaitingQueue.domain";
import { WaitingQueueStatusEnum } from "../../../enum/WaitingQueueStatus.enum";
import { UserErrorCodeEnum } from "../../../enum/UserErrorCode.enum";

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
            createWaitingQueue: jest.fn(),
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
    test("정상 요청", async () => {
      //given
      const uuid = "00001";
      const user = new User(uuid, 1000);

      jest.spyOn(userRepositoryInterface, "findByUuid").mockResolvedValue(user);
      //when
      await authFacade.createToken(uuid);
      //then
      expect(userRepositoryInterface.findByUuid).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalled();
    });

    test("대기 중인 토큰이 있을 경우 에러를 던진다.", async () => {
      //given
      const uuid = "00001";
      const user = new User(
        uuid,
        1000,
        new WaitingQueue(1, uuid, WaitingQueueStatusEnum.대기, new Date()),
      );

      jest.spyOn(userRepositoryInterface, "findByUuid").mockResolvedValue(user);
      //when
      //then
      await expect(authFacade.createToken(uuid)).rejects.toThrow(
        new Error(UserErrorCodeEnum.이미_발급받은_토큰.message),
      );
    });

    test("활성화 토큰이 있을 경우 에러를 던진다.", async () => {
      //given
      const uuid = "00001";
      const user = new User(
        uuid,
        1000,
        new WaitingQueue(1, uuid, WaitingQueueStatusEnum.활성화, new Date()),
      );

      jest.spyOn(userRepositoryInterface, "findByUuid").mockResolvedValue(user);
      //when
      //then
      await expect(authFacade.createToken(uuid)).rejects.toThrow(
        new Error(UserErrorCodeEnum.이미_발급받은_토큰.message),
      );
    });
  });
});
