import type { TaskEntity, TaskId } from './Task';

export interface TaskRepository {
    findAllByUser(userId: string, includeComplete: boolean): Promise<TaskEntity[]>;
    findByIdForUser(id: TaskId, userId: string): Promise<TaskEntity | null>;
    create(task: TaskEntity): Promise<TaskEntity>;
    update(task: TaskEntity): Promise<TaskEntity>;
    delete(id: TaskId, userId: string): Promise<void>;
}


