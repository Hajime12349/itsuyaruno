"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { TaskDTO as Task } from "@/interfaces/http/tasks/mappers";
import styles from "./TaskWindow.module.css";

interface EditTaskWindowProps {
  task: Task;
  onSubmitTask: (task: Task) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
  onClose: () => void;
}

const EditTaskWindow = ({
  task,
  onSubmitTask,
  onDeleteTask,
  onClose,
}: EditTaskWindowProps) => {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      task_name: task.task_name,
      total_set: task.total_set,
      deadline: task.deadline ? task.deadline.slice(0, 10) : "",
    },
  });
  const [showDetails, setShowDetails] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const current_set = task.current_set;
  const is_complete = task.is_complete;

  useEffect(() => {
    setValue("task_name", task.task_name);
    setValue("total_set", task.total_set);
    setValue("deadline", task.deadline ? task.deadline.slice(0, 10) : "");
  }, [task, setValue]);

  const onSubmit = async (data: any) => {
    const { task_name, total_set, deadline } = data ?? {};
    const trimmedName = typeof task_name === "string" ? task_name.trim() : "";
    const parsedTotalSet =
      typeof total_set === "number" ? total_set : Number(total_set);

    if (
      trimmedName.length === 0 ||
      Number.isNaN(parsedTotalSet) ||
      parsedTotalSet < 1
    ) {
      alert("タイトルとセット数を入力してください");
      return;
    }

    const normalizedDeadline =
      typeof deadline === "string" && deadline.trim().length > 0
        ? deadline
        : undefined;

    const taskData: Task = {
      ...task,
      task_name: trimmedName,
      total_set: parsedTotalSet,
      deadline: normalizedDeadline,
      current_set,
      is_complete,
    };

    await handleTaskData(taskData);
  };

  const handleTaskData = async (taskData: Task) => {
    if (taskData.id === undefined) {
      console.error("タスクIDが未設定です");
      return;
    }

    setIsProcessing(true);
    try {
      await onSubmitTask(taskData);
      onClose();
    } catch (error) {
      console.error("タスクの編集に失敗しました", error);
      alert("タスクの編集に失敗しました");
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (task.id === undefined) {
      console.error("タスクIDが未設定です");
      return;
    }

    setIsProcessing(true);
    try {
      await onDeleteTask(task.id);
      onClose();
    } catch (error) {
      console.error("タスクの削除に失敗しました", error);
      alert("タスクの削除に失敗しました");
      setIsProcessing(false);
    }
  };

  const setRandomTotalSet = () => {
    const randomValue = Math.floor(Math.random() * 3) + 1;
    setValue("total_set", randomValue);
  };

  return (
    <div className="App" onClick={(event) => event.stopPropagation()}>
      <div className={styles.header}>
        <h1>タスクを編集</h1>
        <button
          className={styles.trashButton}
          onClick={handleDelete}
          disabled={isProcessing}
        >
          削除
        </button>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p>タイトル</p>
          <input id="task_name" {...register("task_name")} />
        </div>
        <div>
          <p>セット数</p>
          <button type="button" onClick={setRandomTotalSet}>
            自動
          </button>
          <input
            id="total_set"
            type="number"
            min="1"
            step="1"
            {...register("total_set")}
          />
        </div>

        <div>
          <button type="button" onClick={() => setShowDetails(!showDetails)}>
            詳細設定
          </button>
          {showDetails && (
            <div>
              <p>期限</p>
              <input type="date" {...register("deadline")} />
            </div>
          )}
        </div>

        <button disabled={isProcessing} type="submit">
          編集
        </button>
      </form>
    </div>
  );
};

export default EditTaskWindow;
