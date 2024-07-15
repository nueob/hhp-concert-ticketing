export class OrderStepEnum {
  static readonly 결제전 = new OrderStepEnum("BEFORE_ORDER");
  static readonly 결제후 = new OrderStepEnum("AFTER_ORDER");

  private readonly _code: string;

  constructor(code: string) {
    this._code = code;
  }

  get code(): string {
    return this._code;
  }

  static findByCode(code: string) {
    return Object.values(OrderStepEnum).find((e) => e.code === code);
  }
}
