// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

// import { QueueService } from "../../src/domain/service/Queue.service";

// @Injectable()
// export class QueueActiveUserGuard implements CanActivate {
//   constructor(private readonly queueService: QueueService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean | number> {
//     const request = context.switchToHttp().getRequest();

//     const token = request.headers["x-token"];
//     const activeUser = await this.queueService.findActiveUserByToken(token);
//     if (activeUser) {
//       return true;
//     }

//     const waitingRank = await this.queueService.findWaitingRankByToken(token);
//     if (waitingRank > 0) {
//       return waitingRank;
//     }

//     await this.queueService.setWaitingRankByToken(token);

//     return this.queueService.findWaitingRankByToken(token);
//   }
// }
