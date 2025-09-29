import type { TaskRepository } from '../../domain/tasks/TaskRepository';
import type { TaskEntity } from '../../domain/tasks/Task';
import { TaskOwnerId } from '../../domain/tasks/valueObjects/TaskOwnerId';

export class GetTasksUseCase {
    constructor(private readonly taskRepository: TaskRepository) {}

    async execute(params: { userId: string; includeComplete: boolean }): Promise<TaskEntity[]> {
        const ownerId = TaskOwnerId.create(params.userId);
        return await this.taskRepository.findAllByUser(ownerId, params.includeComplete);
    }
}
