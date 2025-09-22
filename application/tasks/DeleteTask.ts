import type { TaskRepository } from '../../domain/tasks/TaskRepository';
import type { TaskId } from '../../domain/tasks/Task';

export class DeleteTaskUseCase {
    constructor(private readonly taskRepository: TaskRepository) {}

    async execute(params: { id: TaskId; userId: string }): Promise<void> {
        const { id, userId } = params;
        await this.taskRepository.delete(id, userId);
    }
}


