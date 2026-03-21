"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { ITaskDataModel as Task } from "@/application/tasks/TaskDataModelMapper";
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

    const confirmed = window.confirm(
      `「${task.task_name}」を削除しますか？この操作は元に戻せません。`
    );
    if (!confirmed) return;

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

  return (
    <div className={styles.overlay} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modal}>
        {/* ヘッダー */}
        <div className={styles.header}>
          <h1>タスクを編集</h1>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="閉じる">
            ×
          </button>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.body}>
            {/* タイトル */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="task_name">
                タイトル
              </label>
              <input
                id="task_name"
                className={styles.input}
                placeholder="タスク名を入力"
                {...register("task_name")}
              />
            </div>

            {/* セット数 */}
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="total_set">
                セット数
              </label>
              <input
                id="total_set"
                type="number"
                min="1"
                step="1"
                className={styles.input}
                {...register("total_set")}
              />
            </div>

            {/* 詳細設定（期限） */}
            <div className={styles.formGroup}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "▼" : "▶"} 詳細設定
              </button>
              {showDetails && (
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="deadline">
                    期限
                  </label>
                  <input
                    id="deadline"
                    type="date"
                    className={styles.input}
                    {...register("deadline")}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ボタン行 */}
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.dangerButton}
              onClick={handleDelete}
              disabled={isProcessing}
            >
              削除
            </button>
            <button
              disabled={isProcessing}
              type="submit"
              className={styles.primaryButton}
            >
              編集を保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskWindow;
