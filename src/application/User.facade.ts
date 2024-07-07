export class UserFacade {
  async findPointByUuid(uuid: string): Promise<number> {
    return Promise.resolve(1000);
  }

  async chargePointByUuid(uuid: string, amount: number): Promise<number> {
    return Promise.resolve(1000);
  }
}
