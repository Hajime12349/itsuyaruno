"use client";

import { useEffect, useState } from "react";
import TaskColumn from "@/components/task-config-main-screen/TaskColumn";
import type { TaskDraft } from "@/components/task-config-main-screen/types";
import { getTasks } from "@/lib/api_wrapper";
import type { ITaskDataModel as Task } from "@/application/tasks/TaskDataModelMapper";
import styles from "@/components/task-config-main-screen/TaskColumn.module.css";

export default function TaskColumnTest() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
  }, []);

  return (
    <main>
      <div className={styles.scrollContainer}>
        <TaskColumn
          tasks={tasks}
          onCreateTask={function (task: TaskDraft): Promise<void> {
            throw new Error("Function not implemented.");
          }}
          onUpdateTask={function (task: Task): Promise<void> {
            throw new Error("Function not implemented.");
          }}
          onDeleteTask={function (taskId: number): Promise<void> {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </main>
  );
}
