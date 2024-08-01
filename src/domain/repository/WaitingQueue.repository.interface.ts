import { WaitingQueue } from "../WaitingQueue.domain";

export interface WaitingQueueRepositoryInterface {
  findByToken(token: string): Promise<string>;
  findAfterTime(time: Date): Promise<WaitingQueue[]>;
  findByLimitCount(count: number): Promise<WaitingQueue[]>;
  expireOldTokens(ids: number[]): Promise<void>;
  activatePendingTokens(ids: number[]): Promise<void>;
}
