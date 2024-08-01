import { Inject, Injectable } from "@nestjs/common";
import { WaitingQueueRepositoryInterface } from "../repository/WaitingQueue.repository.interface";
import { WaitingQueue } from "../WaitingQueue.domain";

@Injectable()
export class QueueService {
  constructor(
    @Inject("WaitingQueueRepositoryInterface")
    private readonly waitingQueueRepositoryInterface: WaitingQueueRepositoryInterface,
  ) {}

  findActiveUsers(): Promise<string[]> {
    return this.waitingQueueRepositoryInterface.findByPattern("ACTIVE:*");
  }

  findActiveUserByToken(token: string): Promise<string> {
    return this.waitingQueueRepositoryInterface.findByToken(`ACTIVE:${token}`);
  }

  findWaitingRankList(count: number): Promise<string[]> {
    return this.waitingQueueRepositoryInterface.findRankList(
      "WAITING",
      0,
      count,
    );
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

  setActiveUser(uuid: string): Promise<void> {
    const key = `ACTIVE:${uuid}`;
    const value = uuid;
    const ttl = 300;

    return this.waitingQueueRepositoryInterface.setToken(key, value, ttl);
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
