export interface OrderUseCase {
  order(reservationTicketId: number): Promise<void>;
}
