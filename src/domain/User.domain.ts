import { WaitingQueueStatusEnum } from "../enum/WaitingQueueStatus.enum";
import { WaitingQueue } from "./WaitingQueue.domain";

export class User {
  private readonly _uuid: string;
  private readonly _point: number;
  private readonly _version: number;

  constructor(uuid?: string, point?: number, version?: number) {
    this._uuid = uuid;
    this._point = point;
    this._version = version;
  }

  get uuid(): string {
    return this._uuid;
  }

  get version(): number {
    return this._version;
  }

  get point(): number {
    return this._point;
  }
}
