"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./TaskWindow.module.css";
import type { TaskDraft } from "./types";

interface AddTaskWindowProps {
  onSubmitTask: (task: TaskDraft) => Promise<void>;
  onClose: () => void;
}

const AddTaskWindow = ({ onSubmitTask, onClose }: AddTaskWindowProps) => {
  const { register, handleSubmit } = useForm();
  const [showDetails, setShowDetails] = useState(false);
  const [disableAddButton, setDisableAddButton] = useState(false);

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

    const taskData: TaskDraft = {
      task_name: trimmedName,
      total_set: parsedTotalSet,
      deadline: normalizedDeadline,
      current_set: 0,
      is_complete: false,
    };

    await handleTaskData(taskData);
  };

  const handleTaskData = async (taskData: TaskDraft) => {
    setDisableAddButton(true);
    try {
      await onSubmitTask(taskData);
      onClose();
    } catch (error) {
      console.error("タスクの追加に失敗しました", error);
      alert("タスクの追加に失敗しました");
      setDisableAddButton(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* ヘッダー */}
        <div className={styles.header}>
          <h1>タスクを追加</h1>
          <button className={styles.closeButton} onClick={onClose}>
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
                defaultValue={1}
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
              disabled={disableAddButton}
              type="submit"
              className={styles.primaryButton}
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskWindow;
