import { BadRequestError } from '@/shared/errors/AppError';

export type TaskId = number;

export interface TaskProps {
    id?: TaskId;
    userId: string;
    name: string;
    deadline?: string; // ISO date string
    totalSet: number;
    currentSet: number;
    isComplete: boolean;
}

export class TaskEntity {
    readonly id?: TaskId;
    readonly userId: string;
    name: string;
    deadline?: string;
    totalSet: number;
    currentSet: number;
    isComplete: boolean;

    private constructor(props: TaskProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.name = props.name;
        this.deadline = props.deadline;
        this.totalSet = props.totalSet;
        this.currentSet = props.currentSet;
        this.isComplete = props.isComplete;
    }

    static create(props: TaskProps): TaskEntity {
        if (!props.userId) throw new BadRequestError('userId is required');
        if (!props.name) throw new BadRequestError('name is required');
        if (props.totalSet < 0) throw new BadRequestError('totalSet must be >= 0');
        if (props.currentSet < 0) throw new BadRequestError('currentSet must be >= 0');
        return new TaskEntity(props);
    }
}


