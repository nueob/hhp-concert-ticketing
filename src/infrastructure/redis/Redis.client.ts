import { Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisClient {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: "localhost",
      port: 6379,
    });
  }

  async get(key: string): Promise<any> {
    return this.redis.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, "EX", ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.redis.keys(pattern);
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    return this.redis.zadd(key, score, member);
  }

  async zrank(key: string, member: string): Promise<number | null> {
    return this.redis.zrank(key, member);
  }

  async zrange(
    key: string,
    startIndex: number,
    endIndex: number,
  ): Promise<string[]> {
    return this.redis.zrange(key, startIndex, endIndex);
  }
}
