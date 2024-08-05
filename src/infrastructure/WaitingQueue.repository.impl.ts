import { Injectable } from "@nestjs/common";

import { WaitingQueueRepositoryInterface } from "../domain/repository/WaitingQueue.repository.interface";

import { RedisClient } from "./redis/Redis.client";

@Injectable()
export class WaitingQueueRepositoryImpl
  implements WaitingQueueRepositoryInterface
{
  constructor(private readonly redisClient: RedisClient) {}

  findByPattern(pattern: string): Promise<string[]> {
    return this.redisClient.keys(pattern);
  }

  findByToken(token: string): Promise<string> {
    return this.redisClient.get(token);
  }

  findRankList(
    key: string,
    startIndex: number,
    endIndex: number,
  ): Promise<string[]> {
    return this.redisClient.zrange(key, startIndex, endIndex);
  }

  findRankByToken(key: string, token: string): Promise<number> {
    return this.redisClient.zrank(key, token);
  }

  setToken(key: string, value: string, ttl: number): Promise<void> {
    return this.redisClient.set(key, value, ttl);
  }

  setRankByToken(key: string, token: string, score: number): Promise<number> {
    return this.redisClient.zadd(key, score, token);
  }

  expireToken(key: string): Promise<void> {
    return this.redisClient.delete(key);
  }
}
