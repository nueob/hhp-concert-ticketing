import { WaitingQueueStatusEnum } from "../enum/WaitingQueueStatus.enum";

export class WaitingQueue {
  private readonly _id: number;
  private readonly _userUuid: string;
  private readonly _status: WaitingQueueStatusEnum;
  private readonly _createdAt: Date;

  constructor(
    id: number,
    userUuid: string,
    status: WaitingQueueStatusEnum,
    createdAt: Date,
  ) {
    this._id = id;
    this._userUuid = userUuid;
    this._status = status;
    this._createdAt = createdAt;
  }

  get id(): number {
    return this._id;
  }

  get userUuid(): string {
    return this._userUuid;
  }

  get status(): WaitingQueueStatusEnum {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
