import type { TaskDTO as Task } from "@/interfaces/http/tasks/mappers";

export type TaskDraft = {
  task_name: string;
  total_set: number;
  deadline?: string;
  current_set: number;
  is_complete: boolean;
};

export type TaskWithId = Task & { id: number };
