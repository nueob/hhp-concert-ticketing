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
            chargePoint: jest.fn(),
            insertPointHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    userFacade = module.get<UserFacade>(UserFacade);
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
      expect(userService.chargePoint).toHaveBeenCalled();
      expect(userService.insertPointHistory).toHaveBeenCalled();
    });
  });
});
