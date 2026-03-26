import type { UserEntity } from "./User";
import { CurrentTaskId } from "./valueObjects/CurrentTaskId";
import { CurrentTaskTime } from "./valueObjects/CurrentTaskTime";
import { DisplayName } from "./valueObjects/DisplayName";
import { IconPath } from "./valueObjects/IconPath";
import { UserId } from "./valueObjects/UserId";

export interface IUserNotification {
  Id(id: UserId): void;
  DisplayName(displayName: DisplayName): void;
  IconPath(iconPath: IconPath | undefined): void;
  CurrentTask(currentTask: CurrentTaskId | undefined): void;
  CurrentTaskTime(currentTaskTime: CurrentTaskTime | undefined): void;
}
