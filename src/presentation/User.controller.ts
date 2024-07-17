import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Put,
} from "@nestjs/common";
import { UserPointResponseDTO } from "./dto/res/UserPoint.res.dto";
import { UserFacade } from "../application/User.facade";
import { ChargeUserPointRequestDTO } from "./dto/req/ChargeUserPoint.req.dto";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
  ChargeUserPointDocs,
  ChargeUserPointErrorResponse,
  FindUserPointDocs,
  FindUserPointErrorResponse,
} from "./swaggerDocs/UserDocs";
@ApiTags("사용자 포인트 API")
@Controller("/users")
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  private readonly logger = new Logger(UserController.name);

  @Get()
  async checkUserActivation(@Param("uuid") uuid: string): Promise<boolean> {
    this.logger.debug("유저 활성화 여부 조회 : " + JSON.stringify(uuid));
    const checkUserActivation = await this.userFacade.checkUserActivation(uuid);

    return checkUserActivation;
  }

  @Get("/:uuid/point")
  @FindUserPointDocs()
  @FindUserPointErrorResponse()
  @ApiOkResponse({ type: UserPointResponseDTO })
  @HttpCode(HttpStatus.OK)
  async findUserPoint(
    @Param("uuid") uuid: string,
  ): Promise<UserPointResponseDTO> {
    this.logger.debug("포인트 조회 : " + JSON.stringify(uuid));

    return new UserPointResponseDTO(
      await this.userFacade.findPointByUuid(uuid),
    );
  }

  @Put("/:uuid/point")
  @ChargeUserPointDocs()
  @ChargeUserPointErrorResponse()
  @HttpCode(HttpStatus.OK)
  async chargeUserPoint(
    @Param("uuid") uuid: string,
    @Body() chargeUserPointRequestDTO: ChargeUserPointRequestDTO,
  ) {
    this.logger.debug(
      "포인트 사용 : " + JSON.stringify({ uuid, ...chargeUserPointRequestDTO }),
    );

    return new UserPointResponseDTO(
      await this.userFacade.chargePointByUuid(
        uuid,
        chargeUserPointRequestDTO.amount,
      ),
    );
  }
}
