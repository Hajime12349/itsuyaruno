import type { TaskRepository } from '../../domain/tasks/TaskRepository';
import { TaskEntity, type TaskId } from '../../domain/tasks/Task';

export type UpdateTaskInput = {
    id: TaskId;
    userId: string;
    name: string;
    deadline?: string;
    totalSet: number;
    currentSet: number;
    isComplete: boolean;
}

export class UpdateTaskUseCase {
    constructor(private readonly taskRepository: TaskRepository) {}

    async execute(input: UpdateTaskInput) {
        const entity = TaskEntity.create({
            id: input.id,
            userId: input.userId,
            name: input.name,
            deadline: input.deadline,
            totalSet: input.totalSet,
            currentSet: input.currentSet,
            isComplete: input.isComplete,
        });
        return await this.taskRepository.update(entity);
    }
}


