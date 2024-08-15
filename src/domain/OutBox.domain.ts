export class OutBox {
  private readonly _id: number;
  private readonly _topic: string;
  private readonly _message: string;
  private readonly _isFinish: boolean;
  private readonly _createdAt: Date;

  constructor(
    id: number,
    topic: string,
    message: string,
    isFinish: boolean,
    createdAt: Date,
  ) {
    this._id = id;
    this._topic = topic;
    this._message = message;
    this._isFinish = isFinish;
    this._createdAt = createdAt;
  }

  get id(): number {
    return this._id;
  }

  get topic(): string {
    return this._topic;
  }

  get message(): string {
    return this._message;
  }

  get isFinish(): boolean {
    return this._isFinish;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
