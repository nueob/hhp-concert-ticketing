import { WaitingQueue } from "../WaitingQueue.domain";

export interface WaitingQueueRepositoryInterface {
  findByToken(token: string): Promise<string>;
  findRankByToken(key: string, token: string): Promise<number>;
  setRankByToken(key: string, token: string, score: number): Promise<number>;
  findAfterTime(time: Date): Promise<WaitingQueue[]>;
  findByLimitCount(count: number): Promise<WaitingQueue[]>;
  expireOldTokens(ids: number[]): Promise<void>;
  activatePendingTokens(ids: number[]): Promise<void>;
}
