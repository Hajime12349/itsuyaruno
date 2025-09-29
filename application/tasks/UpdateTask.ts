import type { TaskRepository } from '../../domain/tasks/TaskRepository';
import { TaskEntity } from '../../domain/tasks/Task';
import { TaskId } from '../../domain/tasks/valueObjects/TaskId';
import { TaskOwnerId } from '../../domain/tasks/valueObjects/TaskOwnerId';
import { TaskName } from '../../domain/tasks/valueObjects/TaskName';
import { TaskDeadline } from '../../domain/tasks/valueObjects/TaskDeadline';
import { TaskTotalSet } from '../../domain/tasks/valueObjects/TaskTotalSet';
import { TaskCurrentSet } from '../../domain/tasks/valueObjects/TaskCurrentSet';
import { TaskCompletionStatus } from '../../domain/tasks/valueObjects/TaskCompletionStatus';

export type UpdateTaskInput = {
    id: number;
    userId: string;
    name: string;
    deadline?: string;
    totalSet: number;
    currentSet: number;
    isComplete: boolean;
};

export class UpdateTaskUseCase {
    constructor(private readonly taskRepository: TaskRepository) {}

    async execute(input: UpdateTaskInput) {
        const entity = TaskEntity.create({
            id: TaskId.create(input.id),
            userId: TaskOwnerId.create(input.userId),
            name: TaskName.create(input.name),
            deadline: input.deadline !== undefined && input.deadline !== null
                ? TaskDeadline.create(input.deadline)
                : undefined,
            totalSet: TaskTotalSet.create(input.totalSet),
            currentSet: TaskCurrentSet.create(input.currentSet),
            isComplete: TaskCompletionStatus.create(input.isComplete),
        });
        return await this.taskRepository.update(entity);
    }
}
