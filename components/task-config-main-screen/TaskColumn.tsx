import { useState } from "react";
import { usePathname } from "next/navigation";
import type { ITaskDataModel as Task } from "@/application/tasks/TaskDataModelMapper";
import AddTaskButton from "./AddTaskButton";
import AddTaskWindow from "./AddTaskWindow";
import EditTaskWindow from "./EditTaskWindow";
import TaskPanel from "./TaskPanel";
import type { TaskDraft } from "./types";
import styles from "./TaskColumn.module.css";

interface TaskColumnProps {
  tasks: Task[];
  onCreateTask: (task: TaskDraft) => Promise<void>;
  onUpdateTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
}

const TaskColumn = ({
  tasks,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
}: TaskColumnProps) => {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isAddModalActive, setIsAddModalActive] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>();

  const pathname = usePathname();
  const boxClass =
    pathname === "/task-config-main-screen"
      ? styles.taskColumnLarge
      : styles.taskColumnSmall;

  const handleClick = (taskId?: number) => {
    if (taskId === undefined) {
      setSelectedTaskId(null);
      return;
    }
    setSelectedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  return (
    <main>
      {isAddModalActive && (
        <AddTaskWindow
          onSubmitTask={onCreateTask}
          onClose={() => setIsAddModalActive(false)}
        />
      )}
      {editTask && (
        <EditTaskWindow
          task={editTask}
          onSubmitTask={onUpdateTask}
          onDeleteTask={async (taskId) => {
            await onDeleteTask(taskId);
            setSelectedTaskId((prev) => (prev === taskId ? null : prev));
          }}
          onClose={() => setEditTask(undefined)}
        />
      )}
      <div className={boxClass}>
        {pathname === "/task-config-main-screen" && (
          <AddTaskButton setIsAddModalActive={setIsAddModalActive} />
        )}
        {Array.isArray(tasks) &&
          tasks.map((task) => (
            <TaskPanel
              key={task.id}
              task={task}
              isSelected={selectedTaskId === task.id}
              setEditTask={setEditTask}
              onClick={() => handleClick(task.id)}
            />
          ))}
      </div>
      <div className={styles.taskWindow}></div>
    </main>
  );
};

export default TaskColumn;
