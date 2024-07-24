import { DataSource, Repository } from "typeorm";
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
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "user",
      password: "123",
      database: "concert",
      synchronize: true,
      dropSchema: true,
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
    });
    await dataSource.initialize();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dataSource.options),
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

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe("chargeUserPoint: 유저 포인트를 충전한다.", () => {
    beforeEach(async () => {
      // user setting
      const userEntity = new UserEntity();
      userEntity.uuid = "0001";
      userEntity.point = 1000;
      userRepository.insert(userEntity);
    });

    afterEach(async () => {
      await Promise.all([
        userRepository.clear(),
        userPointLogRepository.clear(),
        // dataSource.destroy(),
      ]);
    });

    // test("정상요청, 정상적으로 포인트가 충전된다.", async () => {
    //   //given
    //   const uuid = "0001";
    //   const amount = 200;
    //   const userBeforeUsePoint = await userController.findUserPoint(uuid);
    //   //when
    //   const response = await userController.chargeUserPoint(uuid, { amount });
    //   //then
    //   expect(response.point).toBe(userBeforeUsePoint.point + amount);
    // });
    // 락 적용 전
    // test("[락 적용 전] 동시성 테스트, 포인트 충전 여러 요청 시 모두 성공하고 한 요청 건에 대해서만 업데이트 된다.", async () => {
    //   //given
    //   const uuid = "0001";
    //   const amount = 200;
    //   const userBeforeUsePoint = await userController.findUserPoint(uuid);
    //   //when
    //   await Promise.all([
    //     userController.chargeUserPoint(uuid, { amount }),
    //     userController.chargeUserPoint(uuid, { amount }),
    //     userController.chargeUserPoint(uuid, { amount }),
    //     userController.chargeUserPoint(uuid, { amount }),
    //   ]);

    //   const userAfterChargePoint = await userController.findUserPoint(uuid);
    //   //then
    //   expect(userAfterChargePoint.point).toBe(
    //     userBeforeUsePoint.point + amount,
    //   );
    // });
    test("[비관적 읽기 잠금] 동시성 테스트, 포인트 충전 여러 요청 시 순차적으로 실행되어 모두 성공한다.", async () => {
      //given
      const uuid = "0001";
      const wallet = {
        amount1: 1000,
        amount2: 2000,
        amount3: 3000,
        amount4: 4000,
        amount5: 5000,
      };
      const userBeforeChargePoint = await userController.findUserPoint(uuid);
      console.log(userBeforeChargePoint);
      //when
      await Promise.all([
        userController.chargeUserPoint(uuid, { amount: wallet.amount1 }),
        userController.chargeUserPoint(uuid, { amount: wallet.amount2 }),
        userController.chargeUserPoint(uuid, { amount: wallet.amount3 }),
        userController.chargeUserPoint(uuid, { amount: wallet.amount4 }),
        userController.chargeUserPoint(uuid, { amount: wallet.amount5 }),
      ]);
      const userAfterChargePoint = await userController.findUserPoint(uuid);

      // then
      expect(userAfterChargePoint.point).toBe(
        userBeforeChargePoint.point +
          Object.values(wallet).reduce((acc, amount) => (acc += amount), 0),
      );
    });
  });
});
