import type { UserEntity } from "../../../domain/users/User";

export interface UserDTO {
  id: string;
  displayName: string;
  iconPath?: string;
  currentTask?: number;
  currentTaskTime?: string;
};

export function toDTO(user: UserEntity): UserDTO {
  return {
    id: user.id.value,
    displayName: user.displayName.value,
    iconPath: user.iconPath?.value,
    currentTask: user.currentTask?.value,
    currentTaskTime: user.currentTaskTime?.asString,
  };
}
