import React, { PureComponent } from 'react';
import TaskPanel from './TaskPanel';
import styles from './TaskColumn.module.css';

const TaskColumn = () => {
    return (
        <div className={styles.taskColumn}>
            <TaskPanel taskName="タスク" currentSet={1} totalSet={3} deadline={3} />
            <TaskPanel taskName="ディズニー" currentSet={1} totalSet={3} deadline={3} />
            <TaskPanel taskName="gym" currentSet={1} totalSet={3} deadline={3} />
            <TaskPanel taskName="Task 1" currentSet={1} totalSet={3} deadline={3} />
            <TaskPanel taskName="Task 1" currentSet={1} totalSet={3} deadline={3} />
        </div>
    );
};

export default TaskColumn;