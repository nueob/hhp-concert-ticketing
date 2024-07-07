import { User } from "../User.domain";

export class UserService {
  findByUuid(uuid: string): Promise<User | undefined> {
    return;
  }
}
