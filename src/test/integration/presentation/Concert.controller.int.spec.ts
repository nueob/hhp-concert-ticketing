import { DataSource, Repository } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { INestApplication } from "@nestjs/common";

import { UserAuth } from "../../../../libs/decorator/UserAuth";

import { ReservationConcertRequestDTO } from "../../../presentation/dto/req/ReservationConcert.req.dto";
import { ConcertController } from "../../../presentation/Concert.controller";

import { ConcertFacade } from "../../../application/Concert.facade";

import { UserService } from "../../../domain/service/User.service";
import { ConcertService } from "../../../domain/service/Concert.service";

import { UserMapper } from "../../../mapper/User.mapper";
import { ConcertRepositoryImpl } from "../../../infrastructure/Concert.repository.impl";

import { UserEntity } from "../../../infrastructure/entity/User.entity";
import { UserPointLogEntity } from "../../../infrastructure/entity/UserPointLog.entity";
import { UserRepositoryImpl } from "../../../infrastructure/User.repository.impl";
import { UserQueueEntity } from "../../../infrastructure/entity/UserQueue.entity";
import { ReservationTicketEntity } from "../../../infrastructure/entity/ReservationTicket.entity";
import { SeatEntity } from "../../../infrastructure/entity/Seat.entity";
import { PerformanceEntity } from "../../../infrastructure/entity/Performance.entity";
import { ConcertEntity } from "../../../infrastructure/entity/Concert.entity";
import { OrderTicketEntity } from "../../../infrastructure/entity/OrderTicket.entity";
import { AuthFacade } from "../../../application/Auth.facade";

describe("Concert Controller integration test", () => {
  let app: INestApplication;
  let concertController: ConcertController;
  let userRepository: Repository<UserEntity>;
  let concertRepository: Repository<ConcertEntity>;
  let performanceRepository: Repository<PerformanceEntity>;
  let seatRepository: Repository<SeatEntity>;
  let reservationTicketRepository: Repository<ReservationTicketEntity>;
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
      logging: true,
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
      controllers: [ConcertController],
      providers: [
        ConcertFacade,
        AuthFacade,
        ConcertService,
        UserService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: "ConcertRepositoryInterface",
          useClass: ConcertRepositoryImpl,
        },
        {
          provide: "UserRepositoryInterface",
          useClass: UserRepositoryImpl,
        },
      ],
    })
      .overrideGuard(UserAuth)
      .useValue({
        canActivate: () => {
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    await app.init();

    concertController = module.get<ConcertController>(ConcertController);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    concertRepository = module.get<Repository<ConcertEntity>>(
      getRepositoryToken(ConcertEntity),
    );
    performanceRepository = module.get<Repository<PerformanceEntity>>(
      getRepositoryToken(PerformanceEntity),
    );
    seatRepository = module.get<Repository<SeatEntity>>(
      getRepositoryToken(SeatEntity),
    );
    reservationTicketRepository = module.get<
      Repository<ReservationTicketEntity>
    >(getRepositoryToken(ReservationTicketEntity));
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    // user setting
    const user1 = new UserEntity();
    user1.uuid = "0001";
    user1.point = 100000;
    const user2 = new UserEntity();
    user2.uuid = "0002";
    user2.point = 200000;
    const user3 = new UserEntity();
    user3.uuid = "0003";
    user3.point = 300000;
    const user4 = new UserEntity();
    user4.uuid = "0004";
    user4.point = 400000;
    // concert setting
    const concert = new ConcertEntity();
    concert.id = 1;
    concert.name = "브이하는 이브이";
    // performance setting
    const performance = new PerformanceEntity();
    performance.id = 1;
    performance.concert_id = 1;
    performance.maximum_capacity = 5;
    performance.start_at = new Date("2024-09-01 00:00:00");
    performance.ticketing_start_at = new Date("2024-07-01 00:00:00");
    performance.ticketing_end_at = new Date("2024-08-01 00:00:00");
    // seat setting
    const seat = new SeatEntity();
    seat.id = 1;
    seat.performance_id = 1;
    seat.seat_no = 1;
    seat.is_reserved = false;
    seat.price = 1000;

    await Promise.all([
      userRepository.insert([user1, user2, user3, user4]),
      concertRepository.insert(concert),
      performanceRepository.insert(performance),
      seatRepository.insert(seat),
    ]);
  });

  afterEach(async () => {
    await Promise.all([
      userRepository.clear(),
      concertRepository.clear(),
      performanceRepository.clear(),
      seatRepository.clear(),
      reservationTicketRepository.clear(),
    ]);
  });

  describe("reservation: 콘서트 좌석을 예약한다.", () => {
    test("정상요청, 콘서트가 예약된다.", async () => {
      //given
      const seatId = 1;
      const userEntity = await userRepository.findOne({
        where: { uuid: "0001" },
      });
      const user = UserMapper.mapToUserDomain(userEntity);
      //when
      const response = await concertController.reservation(
        new ReservationConcertRequestDTO(seatId),
        user,
      );
      const reservationTicket = await reservationTicketRepository.findOne({
        where: { user_uuid: user.uuid, seat_id: seatId },
      });
      //then
      expect(response.reservationTicketId).toBe(reservationTicket.id);
    });
    test("비관적 쓰기 잠금, 여러명이 동시 요청 했을 때 모두 성공한다.", async () => {
      //given
      // user setting
      const userEntitis = await userRepository.find({
        where: [
          { uuid: "0001" },
          { uuid: "0002" },
          { uuid: "0003" },
          { uuid: "0004" },
        ],
      });

      const seatId = 1;
      //when
      const requests = [
        concertController.reservation(
          new ReservationConcertRequestDTO(seatId),
          UserMapper.mapToUserDomain(
            userEntitis.find((user) => user.uuid === "0001"),
          ),
        ),
        concertController.reservation(
          new ReservationConcertRequestDTO(seatId),
          UserMapper.mapToUserDomain(
            userEntitis.find((user) => user.uuid === "0002"),
          ),
        ),
        concertController.reservation(
          new ReservationConcertRequestDTO(seatId),
          UserMapper.mapToUserDomain(
            userEntitis.find((user) => user.uuid === "0003"),
          ),
        ),
        concertController.reservation(
          new ReservationConcertRequestDTO(seatId),
          UserMapper.mapToUserDomain(
            userEntitis.find((user) => user.uuid === "0004"),
          ),
        ),
      ];
      const results = await Promise.allSettled(requests);
      //then
      let successfulRequests = 0;
      let failedReqeust = 0;

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          successfulRequests++;
        } else if (result.status === "rejected") {
          failedReqeust++;
        }
      });
      expect(successfulRequests).toBe(4);
      expect(failedReqeust).toBe(0);
    });
  });
});
