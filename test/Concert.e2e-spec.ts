import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { APP_INTERCEPTOR } from "@nestjs/core";

import * as request from "supertest";

import { ConcertEntity } from "../src/infrastructure/entity/Concert.entity";
import { OrderTicketEntity } from "../src/infrastructure/entity/OrderTicket.entity";
import { PerformanceEntity } from "../src/infrastructure/entity/Performance.entity";
import { ReservationTicketEntity } from "../src/infrastructure/entity/ReservationTicket.entity";
import { SeatEntity } from "../src/infrastructure/entity/Seat.entity";
import { UserEntity } from "../src/infrastructure/entity/User.entity";
import { UserPointLogEntity } from "../src/infrastructure/entity/UserPointLog.entity";
import { UserQueueEntity } from "../src/infrastructure/entity/UserQueue.entity";
import { RedisClient } from "../src/infrastructure/redis/Redis.client";

import { ConcertController } from "../src/presentation/Concert.controller";
import { ConcertFacade } from "../src/application/Concert.facade";
import { AuthFacade } from "../src/application/Auth.facade";
import { ConcertService } from "../src/domain/service/Concert.service";
import { UserService } from "../src/domain/service/User.service";
import { ConcertRepositoryImpl } from "../src/infrastructure/Concert.repository.impl";
import { UserRepositoryImpl } from "../src/infrastructure/User.repository.impl";
import { UserAuth } from "../libs/decorator/UserAuth";

import { HttpCacheInterceptor } from "../libs/interceptor/HttpCache.interceptor";

describe("SpecialLectureController (e2e)", () => {
  let app: INestApplication;

  let concertRepository: Repository<ConcertEntity>;
  let performanceRepository: Repository<PerformanceEntity>;

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
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          envFilePath: ".env",
        }),
        CacheModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            store: redisStore as any,
            host: configService.get<string>("REDIS_HOST", "localhost"),
            port: configService.get<number>("REDIS_PORT", 6379),
            ttl: configService.get<number>("CACHE_TTL", 300),
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [ConcertController],
      providers: [
        RedisClient,
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
        {
          provide: APP_INTERCEPTOR,
          useClass: HttpCacheInterceptor,
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

    concertRepository = module.get<Repository<ConcertEntity>>(
      getRepositoryToken(ConcertEntity),
    );
    performanceRepository = module.get<Repository<PerformanceEntity>>(
      getRepositoryToken(PerformanceEntity),
    );

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
    await Promise.all([
      concertRepository.insert(
        Array.from({ length: 100 }).map((_, i) => {
          const concert = new ConcertEntity();
          concert.id = i + 1;
          concert.name = `브이하는 이브${i}`;

          return concert;
        }),
      ),
      performanceRepository.insert(
        Array.from({ length: 100 }).map((_, i) => {
          const performance = new PerformanceEntity();
          performance.id = i + 1;
          performance.concert_id = 1;
          performance.maximum_capacity = 5 * i;
          performance.start_at = new Date("2024-09-01 00:00:00");
          performance.ticketing_start_at = new Date("2024-07-01 00:00:00");
          performance.ticketing_end_at = new Date("2024-08-01 00:00:00");

          return performance;
        }),
      ),
    ]);
  });

  afterAll(async () => {
    await Promise.all([
      concertRepository.clear(),
      performanceRepository.clear(),
    ]);
    await dataSource.destroy();
    await app.close();
  });

  describe("전체 콘서트를 조회한다.", () => {
    test("정상요청", async () => {
      //given
      //when
      const response = await request(app.getHttpServer()).get("/concerts");
      //then
      expect(response.status).toBe(200);
    });
    test("100개의 콘서트를 100명이 동시에 조회했을 때", async () => {
      //given
      const requestList = Array.from({ length: 100 }).map(() =>
        request(app.getHttpServer()).get("/concerts"),
      );
      //when
      await Promise.all([...requestList]);
      //then
    });
  });

  describe("특정 콘서트의 예약 가능한 날짜를 조회한다.", () => {
    test("정상 요청", async () => {
      //given
      const concertId = 1;
      //when
      const response = await request(app.getHttpServer()).get(
        `/concerts/${concertId}/dates`,
      );
      //then
      expect(response.status).toBe(200);
    });
    test("100개의 공연일정을 가진 콘서트를 100명이 동시에 조회했을 때", async () => {
      //given
      const concertId = 1;
      const requestList = Array.from({ length: 100 }).map(() =>
        request(app.getHttpServer()).get(`/concerts/${concertId}/dates`),
      );
      //when
      await Promise.all([...requestList]);
      //then
    });
  });
});
