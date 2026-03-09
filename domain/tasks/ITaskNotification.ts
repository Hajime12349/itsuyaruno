import { TaskCompletionStatus } from "./valueObjects/TaskCompletionStatus";
import { TaskCurrentSet } from "./valueObjects/TaskCurrentSet";
import { TaskDeadline } from "./valueObjects/TaskDeadline";
import { TaskId } from "./valueObjects/TaskId";
import { TaskName } from "./valueObjects/TaskName";
import { TaskOwnerId } from "./valueObjects/TaskOwnerId";
import { TaskTotalSet } from "./valueObjects/TaskTotalSet";

export interface ITaskNotification {
  Id(id: TaskId | undefined): void;
  OwnerId(ownerId: TaskOwnerId): void;
  Name(name: TaskName): void;
  Deadline(deadline: TaskDeadline | undefined): void;
  TotalSet(totalSet: TaskTotalSet): void;
  CurrentSet(currentSet: TaskCurrentSet): void;
  IsComplete(isComplete: TaskCompletionStatus): void;
}
