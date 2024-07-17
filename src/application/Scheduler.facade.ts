import { Logger, Injectable } from "@nestjs/common";
import { QueueService } from "@root/domain/service/Queue.service";

@Injectable()
export class SchedulerFacade {
  constructor(private readonly queueService: QueueService) {}

  private readonly logger = new Logger(SchedulerFacade.name);

  async execute(): Promise<[void, void]> {
    const expireOldTokenList = await this.queueService.getTokensAfter5Minutes();
    const expiredTokenIds = expireOldTokenList.map(({ id }) => id);

    this.logger.debug("Scheduler 토큰 만료 : " + expiredTokenIds);

    const tokenListToBeActivated =
      await this.queueService.getTokenListToBeActivated(expiredTokenIds.length);
    const activeTokenIds = tokenListToBeActivated.map(({ id }) => id);

    this.logger.debug("Scheduler 토큰 활성화 : " + activeTokenIds);

    return Promise.all([
      this.queueService.activatePendingTokens(activeTokenIds),
      this.queueService.expireOldTokens(expiredTokenIds),
    ]);
  }
}
