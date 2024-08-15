export class PayDoneEvent {
  constructor(
    public readonly outBoxId: number,
    public readonly orderId: number,
    public readonly uuid: string,
    public readonly price: number,
  ) {}
}
