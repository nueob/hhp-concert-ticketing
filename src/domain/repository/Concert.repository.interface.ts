import { EntityManager } from "typeorm";

import { Concert } from "../Concert.domain";
import { ReservationTicket } from "../ReservationTicket.domain";
import { Seat } from "../Seat.domain";

export interface ConcertRepositoryInterface {
  findAll(): Promise<Concert[]>;
  findById(concertId: number): Promise<Concert>;
  findBySeatId(seatId: number): Promise<Concert>;
  findSeatById(
    seatId: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<Seat>;
  updateSeat(
    seat: Seat,
    transactionalEntityManager?: EntityManager,
  ): Promise<Seat>;
  saveReservationTicket(
    reservationTicket: ReservationTicket,
    transactionalEntityManager?: EntityManager,
  ): Promise<ReservationTicket>;
}
