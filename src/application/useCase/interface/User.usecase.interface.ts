export interface UserUseCase {
  findPointByUuid(uuid: string): Promise<number>;
  chargePointByUuid(uuid: string, amount: number): Promise<number>;
}
