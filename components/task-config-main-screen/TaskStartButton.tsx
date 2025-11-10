"use client";

import React from "react";
import type { ITaskDataModel as Task } from "@/application/tasks/TaskDataModelMapper";

interface TaskStartButtonProps {
  task: Task;
  onStart?: (task: Task) => void;
}

const TaskStartButton: React.FC<TaskStartButtonProps> = ({ task, onStart }) => {
  function handleClick() {
    if (onStart) {
      onStart(task);
    }
  }

  // TSXを返す
  // TODO: ボタンのスタイルを設定する
  return <button onClick={handleClick}>開始</button>;
};

export default TaskStartButton;
