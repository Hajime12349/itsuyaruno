import Image from "next/image";
import React, { PureComponent } from 'react';
import styles from './TaskPanel.module.css';
import { Task } from '@/lib/entity';
import TaskStartButton from './TaskStartButton';
import EditTaskButton from './EditTaskButton';
import { usePathname, useRouter} from 'next/navigation'; // usePathname フックをインポート
import EditTaskWindow from "./EditTaskWindow";
import { updateUser } from "@/lib/db_api_wrapper";

import { useState } from "react";


interface TaskPanelProps {
  task: Task;
  isSelected: boolean;
  setEditTask:React.Dispatch<React.SetStateAction<Task | undefined>>;
  onClick: () => void;
}


const TaskPanel: React.FC<TaskPanelProps> = ({ task, isSelected,setEditTask, onClick }) => {
  const pathname = usePathname();//現在のパスを取得
  const router = useRouter();
  // 残り日数を計算
  const deadlineMs = task.deadline ? Date.parse(task.deadline) : NaN;
  const remainingDays = Math.ceil((deadlineMs - Date.now()) / (1000 * 60 * 60 * 24));

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

  async function handleStart(selectedTask: Task) {
    try {
      await updateUser({ current_task: selectedTask.id, current_task_time: new Date().toISOString() } as unknown as any);
      router.replace('/timer-start-screen');
    } catch (e) {
      console.error(e);
    }
  }


  return (
    <div className={styles.content} onClick={onClick}>
      <h2 className={styles.title}>{task.task_name}</h2>
      <div className={styles.flexContainer}>
        <div className={styles.text}>{task.current_set} / {task.total_set} セット</div>
        <div className={styles.text}>{remainingDaysText}</div>
      </div>
      <div className={isSelected ? styles.buttonContainer : styles.buttonContainerHidden}>
        <TaskStartButton task={task} onStart={handleStart} />
        {pathname == "/task-config-main-screen" && (
          <EditTaskButton onClick={EditTaskWindow} />
        )}
      </div>
    </div>
  );
};

export default TaskPanel;