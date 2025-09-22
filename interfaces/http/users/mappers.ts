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
        id: user.id,
        display_name: user.displayName,
        icon_path: user.iconPath,
        current_task: user.currentTask,
        current_task_time: user.currentTaskTime,
    };
}


