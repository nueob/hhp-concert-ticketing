import { Inject, Injectable } from "@nestjs/common";

import { WaitingQueueRepositoryInterface } from "../repository/WaitingQueue.repository.interface";

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

  expireActiveTokenByUuid(uuid: string): Promise<void> {
    const key = `ACTIVE:${uuid}`;

    return this.waitingQueueRepositoryInterface.expireToken(key);
  }
}
