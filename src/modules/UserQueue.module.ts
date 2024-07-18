import { Module } from "@nestjs/common";

import { EntityModule } from "./Entity.module";
import { SchedulerFacade } from "../application/Scheduler.facade";
import { QueueService } from "../domain/service/Queue.service";
import { WaitingQueueRepositoryImpl } from "../infrastructure/WaitingQueue.repository.impl";

@Module({
  imports: [EntityModule],
  providers: [
    SchedulerFacade,
    QueueService,
    {
      provide: "WaitingQueueRepositoryInterface",
      useClass: WaitingQueueRepositoryImpl,
    },
  ],
})
export class UserQueueModule {}
