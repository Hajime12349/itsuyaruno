import { BadRequestError } from '@/shared/errors/AppError';
import { CurrentTaskId } from './valueObjects/CurrentTaskId';
import { CurrentTaskTime } from './valueObjects/CurrentTaskTime';
import { DisplayName } from './valueObjects/DisplayName';
import { IconPath } from './valueObjects/IconPath';
import { UserId } from './valueObjects/UserId';

export interface UserValueProps {
    id: UserId;
    displayName?: DisplayName;
    iconPath?: IconPath;
    currentTask?: CurrentTaskId;
    currentTaskTime?: CurrentTaskTime;
}

export class UserEntity {
    readonly id: UserId;
    readonly displayName?: DisplayName;
    readonly iconPath?: IconPath;
    readonly currentTask?: CurrentTaskId;
    readonly currentTaskTime?: CurrentTaskTime;

    private constructor(props: UserValueProps) {
        this.id = props.id;
        this.displayName = props.displayName;
        this.iconPath = props.iconPath;
        this.currentTask = props.currentTask;
        this.currentTaskTime = props.currentTaskTime;
    }

    static create(props: UserValueProps): UserEntity {
        if (!props || typeof props !== 'object') {
            throw new BadRequestError('UserEntity requires a props object');
        }

        if (!(props.id instanceof UserId)) {
            throw new BadRequestError('UserEntity requires a UserId');
        }
        if (props.displayName !== undefined && !(props.displayName instanceof DisplayName)) {
            throw new BadRequestError('UserEntity displayName must be a DisplayName');
        }
        if (props.iconPath !== undefined && !(props.iconPath instanceof IconPath)) {
            throw new BadRequestError('UserEntity iconPath must be an IconPath');
        }
        if (props.currentTask !== undefined && !(props.currentTask instanceof CurrentTaskId)) {
            throw new BadRequestError('UserEntity currentTask must be a CurrentTaskId');
        }
        if (props.currentTaskTime !== undefined && !(props.currentTaskTime instanceof CurrentTaskTime)) {
            throw new BadRequestError('UserEntity currentTaskTime must be a CurrentTaskTime');
        }

        return new UserEntity({
            id: props.id,
            displayName: props.displayName,
            iconPath: props.iconPath,
            currentTask: props.currentTask,
            currentTaskTime: props.currentTaskTime,
        });
    }
}
