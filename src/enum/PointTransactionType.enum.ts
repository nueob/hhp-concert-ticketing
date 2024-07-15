export class PointTransactionTypeEnum {
  static readonly 충전 = new PointTransactionTypeEnum("CHARGE", "충전");
  static readonly 사용 = new PointTransactionTypeEnum("USE", "사용");

  private readonly _code: string;
  private readonly _value: string;
  constructor(code: string, value: string) {
    this._code = code;
    this._value = value;
  }

  get code(): string {
    return this._code;
  }

  get value(): string {
    return this._value;
  }

  static findByCode(code: string) {
    return Object.values(PointTransactionTypeEnum).find((e) => e.code === code);
  }
}
