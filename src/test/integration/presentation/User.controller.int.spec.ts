import { Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";

import { UserFacade } from "../../../application/User.facade";
import { UserService } from "../../../domain/service/User.service";

import { UserEntity } from "../../../infrastructure/entity/User.entity";
import { UserPointLogEntity } from "../../../infrastructure/entity/UserPointLog.entity";
import { UserRepositoryImpl } from "../../../infrastructure/User.repository.impl";
import { UserController } from "../../../presentation/User.controller";
import { UserQueueEntity } from "../../../infrastructure/entity/UserQueue.entity";
import { ReservationTicketEntity } from "../../../infrastructure/entity/ReservationTicket.entity";
import { SeatEntity } from "../../../infrastructure/entity/Seat.entity";
import { PerformanceEntity } from "../../../infrastructure/entity/Performance.entity";
import { ConcertEntity } from "../../../infrastructure/entity/Concert.entity";
import { OrderTicketEntity } from "../../../infrastructure/entity/OrderTicket.entity";

describe("User Controller integration test", () => {
  let userController: UserController;
  let userRepository: Repository<UserEntity>;
  let userPointLogRepository: Repository<UserPointLogEntity>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          synchronize: true,
          entities: [
            UserEntity,
            UserPointLogEntity,
            UserQueueEntity,
            ReservationTicketEntity,
            SeatEntity,
            PerformanceEntity,
            ConcertEntity,
            OrderTicketEntity,
          ],
        }),
        TypeOrmModule.forFeature([
          UserEntity,
          UserPointLogEntity,
          UserQueueEntity,
          ReservationTicketEntity,
          SeatEntity,
          PerformanceEntity,
          ConcertEntity,
          OrderTicketEntity,
        ]),
      ],
      controllers: [UserController],
      providers: [
        UserFacade,
        UserService,
        {
          provide: "UserRepositoryInterface",
          useClass: UserRepositoryImpl,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    userPointLogRepository = module.get<Repository<UserPointLogEntity>>(
      getRepositoryToken(UserPointLogEntity),
    );
  });

  beforeEach(async () => {
    // user setting
    const userEntity = new UserEntity();
    userEntity.uuid = "0001";
    userEntity.point = 1000;
    userRepository.insert(userEntity);
  });

  afterEach(async () => {
    await Promise.all([userRepository.clear(), userPointLogRepository.clear()]);
  });

  describe("chargeUserPoint: 유저 포인트를 충전한다.", () => {
    test("정상요청, 정상적으로 포인트가 충전된다.", async () => {
      //given
      const uuid = "0001";
      const amount = 200;
      const userBeforeUsePoint = await userController.findUserPoint(uuid);
      //when
      const response = await userController.chargeUserPoint(uuid, { amount });
      //then
      expect(response.point).toBe(userBeforeUsePoint.point + amount);
    });
  });
});
