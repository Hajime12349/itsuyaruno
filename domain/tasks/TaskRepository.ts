import type { TaskEntity } from './Task';
import { TaskId } from './valueObjects/TaskId';
import { TaskOwnerId } from './valueObjects/TaskOwnerId';

export interface TaskRepository {
    findAllByUser(userId: TaskOwnerId, includeComplete: boolean): Promise<TaskEntity[]>;
    findByIdForUser(id: TaskId, userId: TaskOwnerId): Promise<TaskEntity | null>;
    create(task: TaskEntity): Promise<TaskEntity>;
    update(task: TaskEntity): Promise<TaskEntity>;
    delete(id: TaskId, userId: TaskOwnerId): Promise<void>;
}
