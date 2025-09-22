import type { TaskEntity } from '../../../domain/tasks/Task';

export type TaskDTO = {
    id?: number;
    user_id?: string;
    task_name: string;
    deadline?: string;
    total_set: number;
    current_set: number;
    is_complete: boolean;
};

export function toDTO(entity: TaskEntity): TaskDTO {
    return {
        id: entity.id,
        user_id: entity.userId,
        task_name: entity.name,
        deadline: entity.deadline,
        total_set: entity.totalSet,
        current_set: entity.currentSet,
        is_complete: entity.isComplete,
    };
}


