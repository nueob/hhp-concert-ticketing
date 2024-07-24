import { User } from "../domain/User.domain";
import { UserEntity } from "../infrastructure/entity/User.entity";
import { WaitingQueueMapper } from "./WaitingQueue.mapper";
import { WaitingQueueStatusEnum } from "../enum/WaitingQueueStatus.enum";

export class UserMapper {
  static mapToUserDomain(entity: UserEntity): User {
    if (!entity) return;

    return new User(
      entity.uuid,
      entity.point,
      WaitingQueueMapper.mapToWaitingQueueDomain(
        entity.userQueueList?.find(
          ({ status }) => status !== WaitingQueueStatusEnum.만료,
        ),
      ),
    );
  }
}
