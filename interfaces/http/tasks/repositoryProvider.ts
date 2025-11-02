import type { TaskRepository } from "@/domain/tasks/TaskRepository";
import { PostgresTaskRepository } from "@/infrastructure/tasks/PostgresTaskRepository";

export function resolveTaskRepository(): TaskRepository {
  return new PostgresTaskRepository();
}
