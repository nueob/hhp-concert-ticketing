import { User } from "../domain/User.domain";
import { UserEntity } from "../infrastructure/entity/User.entity";

export class UserMapper {
  static mapToUserDomain(entity: UserEntity): User {
    if (!entity) return;

    return new User(entity.uuid, entity.point, entity.version);
  }
}
