import { BadRequestError } from "@/lib/errors/AppError";
import { CurrentTaskId } from "./valueObjects/CurrentTaskId";
import { CurrentTaskTime } from "./valueObjects/CurrentTaskTime";
import { DisplayName } from "./valueObjects/DisplayName";
import { IconPath } from "./valueObjects/IconPath";
import { UserId } from "./valueObjects/UserId";
import { IUserNotification } from "./IUserNotification";

export interface UserValueProps {
  id: UserId;
  displayName: DisplayName;
  iconPath?: IconPath;
  currentTask?: CurrentTaskId;
  currentTaskTime?: CurrentTaskTime;
}

export class UserEntity {
  readonly _id: UserId;
  readonly _displayName: DisplayName;
  readonly _iconPath?: IconPath;
  readonly _currentTask?: CurrentTaskId;
  readonly _currentTaskTime?: CurrentTaskTime;

  private constructor(props: UserValueProps) {
    this._id = props.id;
    this._displayName = props.displayName;
    this._iconPath = props.iconPath;
    this._currentTask = props.currentTask;
    this._currentTaskTime = props.currentTaskTime;
  }

  static create(props: UserValueProps): UserEntity {
    if (!(props.id instanceof UserId)) {
      throw new BadRequestError("UserEntity requires a UserId");
    }
    if (props.displayName === undefined) {
      throw new BadRequestError("UserEntity requires a DisplayName");
    }
    if (!(props.displayName instanceof DisplayName)) {
      throw new BadRequestError("UserEntity displayName must be a DisplayName");
    }
    if (props.iconPath !== undefined && !(props.iconPath instanceof IconPath)) {
      throw new BadRequestError("UserEntity iconPath must be an IconPath");
    }
    if (
      props.currentTask !== undefined &&
      !(props.currentTask instanceof CurrentTaskId)
    ) {
      throw new BadRequestError(
        "UserEntity currentTask must be a CurrentTaskId"
      );
    }
    if (
      props.currentTaskTime !== undefined &&
      !(props.currentTaskTime instanceof CurrentTaskTime)
    ) {
      throw new BadRequestError(
        "UserEntity currentTaskTime must be a CurrentTaskTime"
      );
    }

    return new UserEntity({
      id: props.id,
      displayName: props.displayName,
      iconPath: props.iconPath,
      currentTask: props.currentTask,
      currentTaskTime: props.currentTaskTime,
    });
  }

  notify(notification: IUserNotification): void {
    notification.Id(this._id);
    notification.DisplayName(this._displayName);
    notification.IconPath(this._iconPath);
    notification.CurrentTask(this._currentTask);
    notification.CurrentTaskTime(this._currentTaskTime);
  }
}
