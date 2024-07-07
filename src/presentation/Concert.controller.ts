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

@Controller("/concerts")
export class ConcertController {
  constructor(private readonly concertFacade: ConcertFacade) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<FindReservationAvailableDateResponseDTO[]> {
    const concertList = await this.concertFacade.getAllConcertList();

    return concertList.map(
      (concert) => new FindAllConcertListResponseDTO(concert),
    );
  }

  @Get("/:concertId/dates")
  @HttpCode(HttpStatus.OK)
  async findReservationAvailableDate(
    @Param("concertId") concertId: number,
  ): Promise<FindReservationAvailableDateResponseDTO[]> {
    const concertList =
      await this.concertFacade.getAvailableDateList(concertId);

    return concertList.map(
      (concert) => new FindReservationAvailableDateResponseDTO(concert),
    );
  }

  @Get("/:concertId/:performanceId/available-seats")
  @HttpCode(HttpStatus.OK)
  async findReservationAvailableSeat(
    @Param("concertId") concertId: number,
    @Param("performanceId") performanceId: number,
  ): Promise<FindReservationAvailableSeatResponseDTO> {
    return new FindReservationAvailableSeatResponseDTO(
      await this.concertFacade.getAvailableSeatCount(concertId, performanceId),
    );
  }

  @Post("/reservation")
  @HttpCode(HttpStatus.OK)
  async reservation(
    @Body() reservationConcertRequestDTO: ReservationConcertRequestDTO,
  ): Promise<ReservationConcertResponseDTO> {
    return new ReservationConcertResponseDTO(
      await this.concertFacade.reservation(
        reservationConcertRequestDTO.toDomain(1),
      ),
    );
  }
}
