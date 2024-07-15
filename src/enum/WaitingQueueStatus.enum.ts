export class WaitingQueueStatusEnum {
  static readonly 활성화 = new WaitingQueueStatusEnum("ACTIVE");
  static readonly 만료 = new WaitingQueueStatusEnum("EXPIRED");
  static readonly 대기 = new WaitingQueueStatusEnum("WAITING");

  private readonly _code: string;

  constructor(code: string) {
    this._code = code;
  }

  get code(): string {
    return this._code;
  }

  static findByCode(code: string) {
    return Object.values(WaitingQueueStatusEnum).find((e) => e.code === code);
  }
}
