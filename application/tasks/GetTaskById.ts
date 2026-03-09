import type { TaskRepository } from "../../domain/tasks/TaskRepository";
import type { TaskEntity } from "../../domain/tasks/Task";
import { TaskId } from "../../domain/tasks/valueObjects/TaskId";
import { TaskOwnerId } from "../../domain/tasks/valueObjects/TaskOwnerId";

export class GetTaskByIdUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(params: {
    id: number;
    userId: string;
  }): Promise<TaskEntity | null> {
    const taskId = TaskId.create(params.id);
    const ownerId = TaskOwnerId.create(params.userId);
    return await this.taskRepository.findByIdForUser(taskId, ownerId);
  }
}
