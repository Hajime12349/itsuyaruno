import type { TaskEntity } from '../../../domain/tasks/Task';
import type { TagDTO } from '../tags/mappers';

export type TaskDTO = {
    id?: number;
    user_id: string;
    task_name: string;
    deadline?: string;
    total_set: number;
    current_set: number;
    is_complete: boolean;
    tags?: TagDTO[];
};

export function toDTO(entity: TaskEntity): TaskDTO {
    return {
        id: entity.id?.value,
        user_id: entity.userId.value,
        task_name: entity.name.value,
        deadline: entity.deadline?.value,
        total_set: entity.totalSet.value,
        current_set: entity.currentSet.value,
        is_complete: entity.isComplete.value,
    };
}
