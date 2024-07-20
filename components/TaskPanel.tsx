import Image from "next/image";
import React, { PureComponent } from 'react';
import styles from './TaskPanel.module.css';
import { Task } from '@/lib/entity';
import TaskStartButton from './TaskStartButton';
import EditTaskButton from './EditTaskButton';
import { usePathname } from 'next/navigation'; // usePathname フックをインポート
import EditTaskWindow from "./EditTaskWindow";

import { useState } from "react";


interface TaskPanelProps {
  task: Task;
  isSelected: boolean;
  setEditTask: React.Dispatch<React.SetStateAction<Task | undefined>>;
  onClick: () => void;
}


const TaskPanel: React.FC<TaskPanelProps> = ({ task, isSelected, setEditTask, onClick }) => {
  const pathname = usePathname();//現在のパスを取得
  // 残り日数を計算
  let remainingDays;
  if (task.deadline) {
    remainingDays = Math.ceil((Date.parse(task.deadline) - Date.now()) / (1000 * 60 * 60 * 24));
  } else {
    remainingDays = NaN;
  }

  // 表示内容を条件分岐
  let remainingDaysText;
  if (isNaN(remainingDays)) {
    remainingDaysText = "期限なし";
  } else if (remainingDays > 0) {
    remainingDaysText = `あと ${remainingDays} 日`;
  } else if (remainingDays == 0) {
    remainingDaysText = `今日まで`;
  } else {
    remainingDaysText = `${Math.abs(remainingDays)} 日過ぎています`;
  }

  const EditTaskWindow = () => {
    console.log(task.id);
    setEditTask(task)
  }



  return (
    <div className={styles.content} onClick={onClick}>
      <h2 className={styles.title}>{task.task_name}</h2>
      <div className={styles.flexContainer}>
        <div className={styles.text}>{task.current_set} / {task.total_set} セット</div>
        <div className={styles.text}>{remainingDaysText}</div>
      </div>
      <div className={isSelected ? styles.buttonContainer : styles.buttonContainerHidden}>
        <TaskStartButton task={task} />
        {pathname == "/task-config-main-screen" && (
          <EditTaskButton onClick={EditTaskWindow} />
        )}
      </div>
    </div>
  );
};

export default TaskPanel;