import { BadRequestError } from "@/lib/errors/AppError";
import { TaskCompletionStatus } from "./valueObjects/TaskCompletionStatus";
import { TaskCurrentSet } from "./valueObjects/TaskCurrentSet";
import { TaskDeadline } from "./valueObjects/TaskDeadline";
import { TaskId } from "./valueObjects/TaskId";
import { TaskName } from "./valueObjects/TaskName";
import { TaskOwnerId } from "./valueObjects/TaskOwnerId";
import { TaskTotalSet } from "./valueObjects/TaskTotalSet";
import { ensureCurrentSetWithinTotal } from "./validators";

export interface TaskValueProps {
  id?: TaskId;
  userId: TaskOwnerId;
  name: TaskName;
  deadline?: TaskDeadline;
  totalSet: TaskTotalSet;
  currentSet: TaskCurrentSet;
  isComplete: TaskCompletionStatus;
}

export class TaskEntity {
  readonly id?: TaskId;
  readonly userId: TaskOwnerId;
  readonly name: TaskName;
  readonly deadline?: TaskDeadline;
  readonly totalSet: TaskTotalSet;
  readonly currentSet: TaskCurrentSet;
  readonly isComplete: TaskCompletionStatus;

  private constructor(props: TaskValueProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.deadline = props.deadline;
    this.totalSet = props.totalSet;
    this.currentSet = props.currentSet;
    this.isComplete = props.isComplete;
  }

  static create(props: TaskValueProps): TaskEntity {
    const { id, userId, name, deadline, totalSet, currentSet, isComplete } =
      props;

    if (id !== undefined && !(id instanceof TaskId)) {
      throw new BadRequestError("TaskEntity id must be a TaskId");
    }
    if (!(userId instanceof TaskOwnerId)) {
      throw new BadRequestError("TaskEntity userId must be a TaskOwnerId");
    }
    if (!(name instanceof TaskName)) {
      throw new BadRequestError("TaskEntity name must be a TaskName");
    }
    if (deadline !== undefined && !(deadline instanceof TaskDeadline)) {
      throw new BadRequestError("TaskEntity deadline must be a TaskDeadline");
    }
    if (!(totalSet instanceof TaskTotalSet)) {
      throw new BadRequestError("TaskEntity totalSet must be a TaskTotalSet");
    }
    if (!(currentSet instanceof TaskCurrentSet)) {
      throw new BadRequestError(
        "TaskEntity currentSet must be a TaskCurrentSet",
      );
    }
    if (!(isComplete instanceof TaskCompletionStatus)) {
      throw new BadRequestError(
        "TaskEntity isComplete must be a TaskCompletionStatus",
      );
    }

    ensureCurrentSetWithinTotal(totalSet, currentSet);

    return new TaskEntity({
      id,
      userId,
      name,
      deadline,
      totalSet,
      currentSet,
      isComplete,
    });
  }
}
