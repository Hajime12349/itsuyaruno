import { BadRequestError } from '@/shared/errors/AppError';
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
        // business guards
        const name = (input.name ?? "").trim();
        if (name.length === 0) {
            throw new BadRequestError('BadRequestError: name must be non-empty');
        }
        if (!Number.isInteger(input.totalSet) || input.totalSet < 1) {
            throw new BadRequestError('BadRequestError: totalSet must be >= 1');
        }
        if (!Number.isInteger(input.currentSet) || input.currentSet < 0 || input.currentSet > input.totalSet) {
            throw new BadRequestError('BadRequestError: currentSet must be between 0 and totalSet');
        }
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


