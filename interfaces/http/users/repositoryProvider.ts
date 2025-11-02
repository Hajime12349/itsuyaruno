import type { UserRepository } from "@/domain/users/UserRepository";
import { PostgresUserRepository } from "@/infrastructure/users/PostgresUserRepository";

export function resolveUserRepository(): UserRepository {
  return new PostgresUserRepository();
}
