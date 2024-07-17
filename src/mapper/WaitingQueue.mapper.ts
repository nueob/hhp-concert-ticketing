import { WaitingQueue } from "../domain/WaitingQueue.domain";
import { UserQueueEntity } from "../infrastructure/entity/UserQueue.entity";

export class WaitingQueueMapper {
  static mapToWaitingQueueDomain(entity: UserQueueEntity): WaitingQueue {
    if (!entity) return;

    return new WaitingQueue(
      entity.id,
      entity.user_uuid,
      entity.status,
      entity.created_at,
    );
  }
}
