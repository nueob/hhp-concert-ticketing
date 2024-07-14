import { WaitingQueueStatusEnum } from "../enum/WaitingQueueStatus.enum";
import { WaitingQueue } from "./WaitingQueue.domain";

export class User {
  private readonly _uuid: string;
  private readonly _point: number;
  private readonly _waitingQueue: WaitingQueue;

  constructor(uuid?: string, point?: number, waitingQueue?: WaitingQueue) {
    this._uuid = uuid;
    this._point = point;
    this._waitingQueue = waitingQueue;
  }

  public isWaiting(): boolean {
    return this.waitingQueue?.status === WaitingQueueStatusEnum.대기;
  }

  public isActive(): boolean {
    return this.waitingQueue?.status === WaitingQueueStatusEnum.활성화;
  }

  get uuid(): string {
    return this._uuid;
  }

  get point(): number {
    return this._point;
  }

  get waitingQueue(): WaitingQueue {
    return this._waitingQueue;
  }
}
