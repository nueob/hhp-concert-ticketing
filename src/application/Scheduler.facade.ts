import { Injectable } from "@nestjs/common";
import { QueueService } from "@root/domain/service/Queue.service";

@Injectable()
export class SchedulerFacade {
  constructor(private readonly queueService: QueueService) {}

  async execute(): Promise<[void, void]> {
    const expireOldTokenList = await this.queueService.getTokensAfter5Minutes();
    const expiredTokenIds = expireOldTokenList.map(({ id }) => id);

    const tokenListToBeActivated =
      await this.queueService.getTokenListToBeActivated(expiredTokenIds.length);
    const activeTokenIds = tokenListToBeActivated.map(({ id }) => id);

    return Promise.all([
      this.queueService.activatePendingTokens(activeTokenIds),
      this.queueService.expireOldTokens(expiredTokenIds),
    ]);
  }
}
