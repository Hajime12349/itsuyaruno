import { ITaskNotification } from "@/domain/tasks/ITaskNotification";
import { TaskCompletionStatus } from "@/domain/tasks/valueObjects/TaskCompletionStatus";
import { TaskCurrentSet } from "@/domain/tasks/valueObjects/TaskCurrentSet";
import { TaskDeadline } from "@/domain/tasks/valueObjects/TaskDeadline";
import { TaskId } from "@/domain/tasks/valueObjects/TaskId";
import { TaskName } from "@/domain/tasks/valueObjects/TaskName";
import { TaskOwnerId } from "@/domain/tasks/valueObjects/TaskOwnerId";
import { TaskTotalSet } from "@/domain/tasks/valueObjects/TaskTotalSet";

export interface ITaskDataModel {
  id?: number;
  user_id: string;
  task_name: string;
  deadline?: string;
  total_set: number;
  current_set: number;
  is_complete: boolean;
}

export class TaskDataModelBuilder implements ITaskNotification {
  private taskProps: ITaskDataModel = {
    id: undefined,
    user_id: "",
    task_name: "",
    deadline: undefined,
    total_set: 0,
    current_set: 0,
    is_complete: false,
  };

  Id(id: TaskId | undefined): void {
    this.taskProps.id = id?.value;
  }

  OwnerId(ownerId: TaskOwnerId): void {
    this.taskProps.user_id = ownerId.value;
  }

  Name(name: TaskName): void {
    this.taskProps.task_name = name.value;
  }

  Deadline(deadline: TaskDeadline | undefined): void {
    this.taskProps.deadline = deadline?.value;
  }

  TotalSet(totalSet: TaskTotalSet): void {
    this.taskProps.total_set = totalSet.value;
  }

  CurrentSet(currentSet: TaskCurrentSet): void {
    this.taskProps.current_set = currentSet.value;
  }

  IsComplete(isComplete: TaskCompletionStatus): void {
    this.taskProps.is_complete = isComplete.value;
  }

  build(): ITaskDataModel {
    return this.taskProps;
  }
}
