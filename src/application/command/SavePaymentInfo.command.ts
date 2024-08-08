export class SavePaymentInfoCommand {
  constructor(
    public readonly orderId: number,
    public readonly uuid: string,
    public readonly price: number,
  ) {}
}
