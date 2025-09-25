import type { UserEntity } from '../../../domain/users/User';

export type UserDTO = {
    id: string;
    display_name?: string;
    icon_path?: string;
    current_task?: number;
    current_task_time?: string;
};

export function toDTO(user: UserEntity): UserDTO {
    return {
        id: user.id.value,
        display_name: user.displayName?.value,
        icon_path: user.iconPath?.value,
        current_task: user.currentTask?.value,
        current_task_time: user.currentTaskTime?.value,
    };
}

export function toPlain(user: UserEntity): {
    id: string;
    displayName?: string;
    iconPath?: string;
    currentTask?: number;
    currentTaskTime?: string;
} {
    return {
        id: user.id.value,
        displayName: user.displayName?.value,
        iconPath: user.iconPath?.value,
        currentTask: user.currentTask?.value,
        currentTaskTime: user.currentTaskTime?.value,
    };
}

