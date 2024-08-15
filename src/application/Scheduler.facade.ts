import { Logger, Injectable, Inject } from "@nestjs/common";
import { PayDoneMessageSender } from "@root/domain/message/PayDone.message-sender";
import { OutBoxService } from "@root/domain/service/OutBox.service";
import { QueueService } from "@root/domain/service/Queue.service";
import { TopicEnum } from "@root/enum/Topic.enum";

@Injectable()
export class SchedulerFacade {
  private readonly activeUserLimit = 10;

  constructor(
    private readonly queueService: QueueService,
    private readonly outBoxService: OutBoxService,
    @Inject("PayDoneMessageSender")
    private readonly payDoneMessageSender: PayDoneMessageSender,
  ) {}

  private readonly logger = new Logger(SchedulerFacade.name);

  async handleUserQueueStatus(): Promise<[void, void]> {
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

  async handleOutBox(): Promise<void> {
    const outboxList = await this.outBoxService.findUnfinishedTasks();
    if (!outboxList.length) return;

    await Promise.all([
      ...outboxList.map(
        (outbox) =>
          outbox.topic === TopicEnum.결제완료.value &&
          this.payDoneMessageSender.sendMessage(outbox.message),
      ),
      ...outboxList.map((outbox) => this.outBoxService.changeFinish(outbox.id)),
    ]);
    return;
  }
}
