import React, { PureComponent } from 'react';
import TaskPanel from './TaskPanel';
import { Task } from '@/lib/entity';
import styles from './TaskColumn.module.css';
import AddTaskButton from '@/components/AddTaskButton';
import AddTaskWindow from "@/components/AddTaskWindow"
import EditTaskWindow from "@/components/EditTaskWindow"
import { useState } from 'react';

interface TaskColumnProps {
    tasks: Task[];
}

const TaskColumn = ({ tasks }: TaskColumnProps) => {
    const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

    const [isAddModalActive,setIsAddModalActive] = useState(false)
    const [editTask,setEditTask] = useState<Task | undefined>()

    const handleClick = (taskId?: number) => {
        if (taskId === undefined) { // 無効なクリックの場合
            setSelectedTaskId(null);
            return;
        }
        if (taskId === selectedTaskId) { // 既に選択されているタスクを再度選択した場合
            setSelectedTaskId(null);
        } else { // 新しいタスクを選択した場合
            setSelectedTaskId(taskId);
        }
    };

    // const handleAddTaskClick = () => {
    //     console.log("Add task button clicked");
    // }


    return (
        <main>
            {isAddModalActive && <AddTaskWindow setIsActive={setIsAddModalActive}/>}
            {editTask && <EditTaskWindow task={editTask} />}
            <div className={styles.taskColumn}>
                <AddTaskButton setIsAddModalActive={setIsAddModalActive} />
              {tasks.map((task) => (

                <TaskPanel key={task.id} task={task} isSelected={selectedTaskId === task.id} setEditTask={setEditTask} onClick={() => handleClick(task.id)} />
            ))}
            </div>
            <div className={styles.taskWindow}>
            </div>
        </main>
    );
};

export default TaskColumn;