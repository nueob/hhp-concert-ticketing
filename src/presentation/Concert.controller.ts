import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from "@nestjs/common";

import { ConcertFacade } from "../application/Concert.facade";

import { FindReservationAvailableSeatResponseDTO } from "./dto/res/FindReservationAvailableSeat.res.dto";
import { FindReservationAvailableDateResponseDTO } from "./dto/res/FindReservationAvailableDate.res.dto";
import { FindAllConcertListResponseDTO } from "./dto/res/FindAllConcertList.dto";
import { ReservationConcertRequestDTO } from "./dto/req/ReservationConcert.req.dto";
import { ReservationConcertResponseDTO } from "./dto/res/ReservationConcert.res.dto";
import { ApiExtraModels, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import {
  FindAllDocs,
  FindReservationAvailableDateDocs,
  FindReservationAvailableDateErrorReponse,
  FindReservationAvailableSeatDocs,
  FindReservationAvailableSeatErrorReponse,
  ReservationDocs,
  ReservationErrorResponse,
} from "./swaggerDocs/ConcertDocs";
import { UserAuth } from "../../libs/decorator/UserAuth";
import { ReqUser } from "../../libs/decorator/ReqUser";
import { User } from "../domain/User.domain";

@ApiTags("콘서트 API")
@Controller("/concerts")
@ApiExtraModels(
  FindReservationAvailableDateResponseDTO,
  FindAllConcertListResponseDTO,
  FindReservationAvailableSeatResponseDTO,
  ReservationConcertRequestDTO,
  ReservationConcertResponseDTO,
)
export class ConcertController {
  constructor(private readonly concertFacade: ConcertFacade) {}

  @Get()
  @FindAllDocs()
  @ApiOkResponse({ type: [FindAllConcertListResponseDTO] })
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<FindAllConcertListResponseDTO[]> {
    const concertList = await this.concertFacade.getAllConcertList();

    return concertList.map(
      (concert) => new FindAllConcertListResponseDTO(concert),
    );
  }

  @Get("/:concertId/dates")
  @FindReservationAvailableDateDocs()
  @FindReservationAvailableDateErrorReponse()
  @ApiOkResponse({ type: FindReservationAvailableDateResponseDTO })
  @HttpCode(HttpStatus.OK)
  async findReservationAvailableDate(
    @Param("concertId") concertId: number,
  ): Promise<FindReservationAvailableDateResponseDTO> {
    return new FindReservationAvailableDateResponseDTO(
      await this.concertFacade.getAvailableDateList(concertId),
    );
  }

  @Get("/:concertId/:performanceId/available-seats")
  @FindReservationAvailableSeatDocs()
  @FindReservationAvailableSeatErrorReponse()
  @ApiOkResponse({ type: [FindReservationAvailableSeatResponseDTO] })
  @HttpCode(HttpStatus.OK)
  async findReservationAvailableSeat(
    @Param("concertId") concertId: number,
    @Param("performanceId") performanceId: number,
  ): Promise<FindReservationAvailableSeatResponseDTO[]> {
    const seatList = await this.concertFacade.getAvailableSeat(
      concertId,
      performanceId,
    );

    return seatList.map(
      (seat) => new FindReservationAvailableSeatResponseDTO(seat),
    );
  }

  @UserAuth()
  @Post("/reservation")
  @ReservationDocs()
  @ReservationErrorResponse()
  @ApiOkResponse({ type: ReservationConcertResponseDTO })
  @HttpCode(HttpStatus.OK)
  async reservation(
    @Body() reservationConcertRequestDTO: ReservationConcertRequestDTO,
    @ReqUser() user: User,
  ): Promise<ReservationConcertResponseDTO> {
    return new ReservationConcertResponseDTO(
      await this.concertFacade.reservation(
        reservationConcertRequestDTO.toDomain(user.uuid),
      ),
    );
  }
}
