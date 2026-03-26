"use client";

import React from "react";
import type { ITaskDataModel as Task } from "@/application/tasks/TaskDataModelMapper";
import styles from "./StartTaskButton.module.css";

interface StartTaskButtonProps {
  task: Task;
  onStart?: (task: Task) => void;
}

const StartTaskButton: React.FC<StartTaskButtonProps> = ({ task, onStart }) => {
  function handleClick() {
    if (onStart) {
      onStart(task);
    }
  }

  // TSXを返す
  // TODO: ボタンのスタイルを設定する
  return <button type="button" className={styles.StartButton} onClick={handleClick}>開始</button>;
};

export default StartTaskButton;
