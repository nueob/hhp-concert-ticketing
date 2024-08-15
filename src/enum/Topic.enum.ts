export class TopicEnum {
  static readonly 결제완료 = new TopicEnum("pay-done", "결제완료");

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
}
