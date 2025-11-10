import type { ITaskDataModel as Task } from "@/application/tasks/TaskDataModelMapper";

export type TaskDraft = {
  task_name: string;
  total_set: number;
  deadline?: string;
  current_set: number;
  is_complete: boolean;
};

export type TaskWithId = Task & { id: number };
