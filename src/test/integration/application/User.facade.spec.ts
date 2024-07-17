import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../../domain/service/User.service";
import { User } from "../../../domain/User.domain";
import { UserFacade } from "../../../application/User.facade";
import { UserRepositoryInterface } from "@root/domain/repository/User.repository.interface";

describe("UserFacade unit test", () => {
  let userFacade: UserFacade;
  let userRepositoryInterface: UserRepositoryInterface;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFacade,
        UserService,
        {
          provide: "UserRepositoryInterface",
          useValue: {
            findByUuid: jest.fn(),
            updatePoint: jest.fn(),
            insertPointHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    userFacade = module.get<UserFacade>(UserFacade);
    userRepositoryInterface = module.get<UserRepositoryInterface>(
      "UserRepositoryInterface",
    );
  });

  describe("findPointByUuid: 포인트를 조회한다.", () => {
    test("정상 요청", async () => {
      //given
      const uuid = "00001";
      const point = 1000;
      jest
        .spyOn(userRepositoryInterface, "findByUuid")
        .mockResolvedValue(new User(uuid, point));
      //when
      const response = await userFacade.findPointByUuid(uuid);
      //then
      expect(response).toEqual(point);
      expect(userRepositoryInterface.findByUuid).toHaveBeenCalled();
    });
  });

  describe("chargePointByUuid: 포인트를 충전한다.", () => {
    test("정상 요청", async () => {
      //given
      const uuid = "00001";
      const point = 1000;
      const amount = 1000;

      jest
        .spyOn(userRepositoryInterface, "findByUuid")
        .mockResolvedValue(new User(uuid, point));
      //when
      await userFacade.chargePointByUuid(uuid, amount);
      //then
      expect(userRepositoryInterface.updatePoint).toHaveBeenCalled();
      expect(userRepositoryInterface.insertPointHistory).toHaveBeenCalled();
    });
  });
});
