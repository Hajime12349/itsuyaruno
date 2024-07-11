import Image from "next/image";
import React, { PureComponent } from 'react';
import styles from './TaskPanel.module.css';  


interface TaskPanelProps {
  taskName: string;
  currentSet: number;
  totalSet : number;
  deadline: number;
}
 

const TaskPanel: React.FC<TaskPanelProps> = ({ taskName, currentSet, totalSet, deadline}) => {
  return (
    <div className={styles.content}>
      <h2 className={styles.title}>{taskName}</h2>
      <div className={styles.flexContainer}>
        <div  className={styles.text}>{currentSet} / {totalSet} セット</div>
        <div className={styles.text}>あと {deadline} 日</div>
      </div>
    </div>
  );
};

export default TaskPanel;