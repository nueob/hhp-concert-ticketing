import { Inject, Injectable } from "@nestjs/common";
import { WaitingQueueRepositoryInterface } from "../repository/WaitingQueue.repository.interface";
import { WaitingQueue } from "../WaitingQueue.domain";

@Injectable()
export class QueueService {
  constructor(
    @Inject("WaitingQueueRepositoryInterface")
    private readonly waitingQueueRepositoryInterface: WaitingQueueRepositoryInterface,
  ) {}

  findActiveUserByToken(token: string): Promise<string> {
    return this.waitingQueueRepositoryInterface.findByToken(`ACTIVE:${token}`);
  }

  findWaitingRankByToken(token: string): Promise<number> {
    return this.waitingQueueRepositoryInterface.findRankByToken(
      "WAITING",
      token,
    );
  }

  setWaitingRankByToken(token: string): Promise<number> {
    return this.waitingQueueRepositoryInterface.setRankByToken(
      "WAITING",
      token,
      Date.now(),
    );
  }

  getTokensAfter5Minutes(): Promise<WaitingQueue[]> {
    const fiveMinutesAgo = new Date(new Date().getTime() - 5 * 60 * 1000);

    return this.waitingQueueRepositoryInterface.findAfterTime(fiveMinutesAgo);
  }

  getTokenListToBeActivated(count: number): Promise<WaitingQueue[]> {
    return this.waitingQueueRepositoryInterface.findByLimitCount(count);
  }

  activatePendingTokens(ids: number[]): Promise<void> {
    return this.waitingQueueRepositoryInterface.activatePendingTokens(ids);
  }

  expireOldTokens(ids: number[]): Promise<void> {
    return this.waitingQueueRepositoryInterface.expireOldTokens(ids);
  }
}
