import { CacheKey, CacheTTL } from "@nestjs/cache-manager";
import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { HttpCacheInterceptor } from "../interceptor/HttpCache.interceptor";

export function HttpCache(key: string) {
  return applyDecorators(
    CacheKey(key),
    CacheTTL(60),
    UseInterceptors(HttpCacheInterceptor),
  );
}
