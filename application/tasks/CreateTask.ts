import type { TaskRepository } from '../../domain/tasks/TaskRepository';
import { TaskEntity } from '../../domain/tasks/Task';

export type CreateTaskInput = {
    userId: string;
    name: string;
    deadline?: string;
    totalSet: number;
    currentSet: number;
    isComplete: boolean;
}

export class CreateTaskUseCase {
    constructor(private readonly taskRepository: TaskRepository) {}

    async execute(input: CreateTaskInput) {
        const entity = TaskEntity.create({
            userId: input.userId,
            name: input.name,
            deadline: input.deadline,
            totalSet: input.totalSet,
            currentSet: input.currentSet,
            isComplete: input.isComplete,
        });
        return await this.taskRepository.create(entity);
    }
}


