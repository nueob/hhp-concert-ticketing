import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SchedulerFacade } from "@root/application/Scheduler.facade";

@Injectable()
export class UserQueueScheduler {
  constructor(private readonly schedulerFacade: SchedulerFacade) {}

  @Cron(CronExpression.EVERY_SECOND)
  async handleUserQueueStatus() {
    await this.schedulerFacade.execute();
  }
}
