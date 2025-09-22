import type { TaskRepository } from '../../domain/tasks/TaskRepository';
import type { TaskEntity, TaskId } from '../../domain/tasks/Task';

export class GetTaskByIdUseCase {
    constructor(private readonly taskRepository: TaskRepository) {}

    async execute(params: { id: TaskId; userId: string }): Promise<TaskEntity | null> {
        const { id, userId } = params;
        return await this.taskRepository.findByIdForUser(id, userId);
    }
}


