import type { TaskRepository } from '../../domain/tasks/TaskRepository';
import { TaskEntity } from '../../domain/tasks/Task';
import { TaskOwnerId } from '../../domain/tasks/valueObjects/TaskOwnerId';
import { TaskName } from '../../domain/tasks/valueObjects/TaskName';
import { TaskDeadline } from '../../domain/tasks/valueObjects/TaskDeadline';
import { TaskTotalSet } from '../../domain/tasks/valueObjects/TaskTotalSet';
import { TaskCurrentSet } from '../../domain/tasks/valueObjects/TaskCurrentSet';
import { TaskCompletionStatus } from '../../domain/tasks/valueObjects/TaskCompletionStatus';
import { ensureCurrentSetWithinTotal } from '../../domain/tasks/validators';

export type CreateTaskInput = {
    userId: string;
    name: string;
    deadline?: string;
    totalSet: number;
    currentSet: number;
    isComplete: boolean;
};

export class CreateTaskUseCase {
    constructor(private readonly taskRepository: TaskRepository) {}

    async execute(input: CreateTaskInput) {
        const totalSet = TaskTotalSet.create(input.totalSet);
        const currentSet = TaskCurrentSet.create(input.currentSet);
        ensureCurrentSetWithinTotal(totalSet, currentSet);

        const entity = TaskEntity.create({
            userId: TaskOwnerId.create(input.userId),
            name: TaskName.create(input.name),
            deadline: input.deadline !== undefined && input.deadline !== null
                ? TaskDeadline.create(input.deadline)
                : undefined,
            totalSet,
            currentSet,
            isComplete: TaskCompletionStatus.create(input.isComplete),
        });
        return await this.taskRepository.create(entity);
    }
}
