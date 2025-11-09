import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { updateUser } from "@/lib/api_wrapper";
import type { TaskDTO as Task } from "@/interfaces/http/tasks/mappers";
import type { UserDTO as User } from "@/interfaces/http/users/mappers";
import EditTaskButton from "./EditTaskButton";
import TaskStartButton from "./TaskStartButton";
import styles from "./TaskPanel.module.css";

interface TaskPanelProps {
  task: Task;
  isSelected: boolean;
  setEditTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
  onClick: () => void;
}

const TaskPanel: React.FC<TaskPanelProps> = ({
  task,
  isSelected,
  setEditTask,
  onClick,
}) => {
  const pathname = usePathname(); // 現在のパスを取得
  const router = useRouter();
  // 〆切までの残り日数を計算
  const deadlineMs = task.deadline ? Date.parse(task.deadline) : NaN;
  const remainingDays = Math.ceil(
    (deadlineMs - Date.now()) / (1000 * 60 * 60 * 24),
  );

  // 表示テキストを整える
  let remainingDaysText: string;
  if (isNaN(remainingDays)) {
    remainingDaysText = "未設定";
  } else if (remainingDays > 0) {
    remainingDaysText = `残り ${remainingDays} 日`;
  } else if (remainingDays === 0) {
    remainingDaysText = "今日まで";
  } else {
    remainingDaysText = `${Math.abs(remainingDays)} 日過ぎています`;
  }

  const openEditTaskWindow = () => {
    console.log(task.id);
    setEditTask(task);
  };

  async function handleStart(selectedTask: Task) {
    try {
      const payload: User = {
        id: selectedTask.user_id,
        displayName: "",
        currentTask: selectedTask.id,
        currentTaskTime: new Date().toISOString(),
      };
      await updateUser(payload);
      router.replace("/timer-start-screen");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className={styles.content} onClick={onClick}>
      <h2 className={styles.title}>{task.task_name}</h2>
      <div className={styles.flexContainer}>
        <div className={styles.text}>
          {task.current_set} / {task.total_set} セット
        </div>
        <div className={styles.text}>{remainingDaysText}</div>
      </div>
      <div
        className={
          isSelected ? styles.buttonContainer : styles.buttonContainerHidden
        }
      >
        <TaskStartButton task={task} onStart={handleStart} />
        {pathname === "/task-config-main-screen" && (
          <EditTaskButton onClick={openEditTaskWindow} />
        )}
      </div>
    </div>
  );
};

export default TaskPanel;
