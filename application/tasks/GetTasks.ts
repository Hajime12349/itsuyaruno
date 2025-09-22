import type { TaskRepository } from '../../domain/tasks/TaskRepository';
import type { TaskEntity } from '../../domain/tasks/Task';

export class GetTasksUseCase {
    constructor(private readonly taskRepository: TaskRepository) {}

    async execute(params: { userId: string; includeComplete: boolean }): Promise<TaskEntity[]> {
        const { userId, includeComplete } = params;
        return await this.taskRepository.findAllByUser(userId, includeComplete);
    }
}


