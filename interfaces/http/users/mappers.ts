import type { UserEntity } from "../../../domain/users/User";
import {
  userEntityToPlain,
  type UserEntityPlain,
} from "../../../domain/users/mappers";

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
    current_task_time: user.currentTaskTime?.asString,
  };
}

export type UserPlain = UserEntityPlain;

export function toPlain(user: UserEntity): UserPlain {
  return userEntityToPlain(user);
}
