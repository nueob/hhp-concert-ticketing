import { Injectable, ExecutionContext, Inject } from "@nestjs/common";
import { CacheInterceptor, CACHE_MANAGER } from "@nestjs/cache-manager";
import { Reflector } from "@nestjs/core";

@Injectable()
export class HttpCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) cacheManager: any,
    protected readonly reflector: Reflector,
  ) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    const cacheKey = this.reflector.get<string>(
      "CACHE_KEY_METADATA",
      context.getHandler(),
    );

    if (cacheKey) {
      const request = context.switchToHttp().getRequest();
      return `${cacheKey}-${request.url}`;
    }

    return super.trackBy(context);
  }
}
