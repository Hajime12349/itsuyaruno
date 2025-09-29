import type { UserEntity } from './User';

export type UserEntityPlain = {
    id: string;
    displayName?: string;
    iconPath?: string;
    currentTask?: number;
    currentTaskTime?: string;
};

export function userEntityToPlain(user: UserEntity): UserEntityPlain {
    return {
        id: user.id.value,
        displayName: user.displayName?.value,
        iconPath: user.iconPath?.value,
        currentTask: user.currentTask?.value,
        currentTaskTime: user.currentTaskTime?.value,
    };
}
