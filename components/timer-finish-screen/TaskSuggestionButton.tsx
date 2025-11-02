import { useMemo } from "react";
import type { TaskDTO as Task } from "@/interfaces/http/tasks/mappers";
import styles from "./TaskSuggestionButton.module.css";

interface TaskSuggestionButtonProps {
  tasks: Task[];
}

function TaskSuggestionButton({ tasks }: TaskSuggestionButtonProps) {
  const randomTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    const shuffledTasks = [...tasks].sort(() => 0.5 - Math.random());
    return shuffledTasks.slice(0, 3);
  }, [tasks]);

  return (
    <div>
      {randomTasks.length > 0 ? (
        <ul className={styles.TaskList}>
          {randomTasks.map((task) => (
            <li key={task.id ?? task.task_name} className={styles.TaskItem}>
              <div className={styles.TaskName}>{task.task_name}</div>
              <div className={styles.TaskMeta}>
                <span>
                  {task.current_set} / {task.total_set} セット
                </span>
                {task.deadline && (
                  <span>
                    期限: {new Date(task.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.TaskNotFound}>タスクが見つかりませんでした</p>
      )}
    </div>
  );
}

export default TaskSuggestionButton;
