import type { TaskRepository } from '../../domain/tasks/TaskRepository';
import { TaskId } from '../../domain/tasks/valueObjects/TaskId';
import { TaskOwnerId } from '../../domain/tasks/valueObjects/TaskOwnerId';

export class DeleteTaskUseCase {
    constructor(private readonly taskRepository: TaskRepository) {}

    async execute(params: { id: number; userId: string }): Promise<void> {
        const taskId = TaskId.create(params.id);
        const ownerId = TaskOwnerId.create(params.userId);
        await this.taskRepository.delete(taskId, ownerId);
    }
}
