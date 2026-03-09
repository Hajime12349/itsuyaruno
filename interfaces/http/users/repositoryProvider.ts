import type { IUserRepository } from "@/domain/users/IUserRepository";
import { PostgresUserRepository } from "@/infrastructure/users/PostgresUserRepository";

export function resolveUserRepository(): IUserRepository {
  return new PostgresUserRepository();
}
