import { Concert } from "../../../domain/Concert.domain";
import { FindReservationAvailableDateResponseDTO } from "./FindReservationAvailableDate.res.dto";

export class FindAllConcertListResponseDTO extends FindReservationAvailableDateResponseDTO {
  private readonly _concertId: number;

  constructor(concert: Concert) {
    super(concert);
    this._concertId = concert?.id;
  }

  get concertId(): number {
    return this._concertId;
  }
}
