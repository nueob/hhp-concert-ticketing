import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
} from "@nestjs/common";
import { UserPointResponseDTO } from "./dto/res/UserPoint.res.dto";
import { UserFacade } from "../application/User.facade";
import { ChargeUserPointRequestDTO } from "./dto/req/ChargeUserPoint.req.dto";

@Controller("/users")
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  @Get("/:uuid/point")
  @HttpCode(HttpStatus.OK)
  async findUserPoint(
    @Param("uuid") uuid: string,
  ): Promise<UserPointResponseDTO> {
    return new UserPointResponseDTO(
      await this.userFacade.findPointByUuid(uuid),
    );
  }

  @Put("/:uuid/point")
  @HttpCode(HttpStatus.OK)
  async chargeUserPoint(
    @Param("uuid") uuid: string,
    @Body() chargeUserPointRequestDTO: ChargeUserPointRequestDTO,
  ) {
    return new UserPointResponseDTO(
      await this.userFacade.chargePointByUuid(
        uuid,
        chargeUserPointRequestDTO.amount,
      ),
    );
  }
}
