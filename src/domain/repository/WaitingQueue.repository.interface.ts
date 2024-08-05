export interface WaitingQueueRepositoryInterface {
  findByPattern(pattern: string): Promise<string[]>;
  findByToken(token: string): Promise<string>;
  findRankList(
    key: string,
    startIndex: number,
    endIndex: number,
  ): Promise<string[]>;
  findRankByToken(key: string, token: string): Promise<number>;
  setRankByToken(key: string, token: string, score: number): Promise<number>;
  setToken(key: string, value: string, ttl: number): Promise<void>;
}
