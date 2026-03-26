import type { UserEntity } from "@/domain/users/User";
import { IUserNotification } from "@/domain/users/IUserNotification";
import { CurrentTaskId } from "@/domain/users/valueObjects/CurrentTaskId";
import { CurrentTaskTime } from "@/domain/users/valueObjects/CurrentTaskTime";
import { DisplayName } from "@/domain/users/valueObjects/DisplayName";
import { IconPath } from "@/domain/users/valueObjects/IconPath";
import { UserId } from "@/domain/users/valueObjects/UserId";

export interface IUserDataModel {
  id: string;
  displayName: string;
  iconPath?: string;
  currentTask?: number;
  currentTaskTime?: string;
}

export class UserDataModelBuilder implements IUserNotification {
  private userProps: IUserDataModel = {
    id: "",
    displayName: "",
    iconPath: undefined,
    currentTask: undefined,
    currentTaskTime: undefined,
  };

  Id(userId: UserId): void {
    this.userProps.id = userId.value;
  }

  DisplayName(displayName: DisplayName): void {
    this.userProps.displayName = displayName.value;
  }

  IconPath(iconPath: IconPath | undefined): void {
    this.userProps.iconPath = iconPath?.value;
  }

  CurrentTask(currentTask: CurrentTaskId | undefined): void {
    this.userProps.currentTask = currentTask?.value;
  }

  CurrentTaskTime(currentTaskTime: CurrentTaskTime | undefined): void {
    this.userProps.currentTaskTime = currentTaskTime?.asString;
  }

  build(): IUserDataModel {
    return this.userProps;
  }
}
