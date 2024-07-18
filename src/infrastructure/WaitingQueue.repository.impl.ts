import { Injectable } from "@nestjs/common";
import { WaitingQueueRepositoryInterface } from "../domain/repository/WaitingQueue.repository.interface";

@Injectable()
export class WaitingQueueRepositoryImpl
  implements WaitingQueueRepositoryInterface
{
  expireOldTokens(): Promise<void> {
    return;
  }
  activatePendingTokens(): Promise<void> {
    return;
  }
}
