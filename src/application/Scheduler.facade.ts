import { Logger, Injectable } from "@nestjs/common";
import { QueueService } from "@root/domain/service/Queue.service";

@Injectable()
export class SchedulerFacade {
  private readonly activeUserLimit = 10;

  constructor(private readonly queueService: QueueService) {}

  private readonly logger = new Logger(SchedulerFacade.name);

  async execute(): Promise<[void, void]> {
    /**
     * 1. 활성화 토큰 가져오기
     * 2. 활성화 될 수 있는 일정 인원 - 현재 활성화 된 토큰 수 = 활성화 시킬 수 있는 토큰 수
     * 3. 활성화 시킬 수 있는 토큰 수 만큼 대기열에서 !순서대로! 가져오기
     * 4. 가져온 토큰 활성화 TTL 5분
     */
    const activeUsers = await this.queueService.findActiveUsers();
    const activatableUsers = await this.queueService.findWaitingRankList(
      this.activeUserLimit - activeUsers.length,
    );

    this.logger.debug("Scheduler 토큰 활성화 : " + activatableUsers);

    await Promise.all([
      ...activatableUsers.map((uuid) => this.queueService.setActiveUser(uuid)),
    ]);

    return;
  }
}
