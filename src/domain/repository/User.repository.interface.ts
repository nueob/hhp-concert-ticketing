import { User } from "../User.domain";

export interface UserRepositoryInterface {
  findByUuid(uuid: string): Promise<User>;
}