import { useState, useEffect } from 'react';
import { User, Task } from '@/lib/entity';
import { getTasks } from '@/lib/db_api_wrapper';
import styles from './TaskSuggestionButton.module.css';
import TaskColumn from './TaskColumn';

function TaskSuggestionButton() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [randomTask, setRandomTask] = useState<Task | null>(null);

  useEffect(() => {
    getTasks()
      .then((tasks) => {
        setTasks(tasks);
        if (tasks.length > 0) {
          //タスクがある場合はランダムにタスクを３つまで選択
          const firstThreeTasks = tasks.slice(0, 3);
          const randomIndex = Math.floor(Math.random() * firstThreeTasks.length);
          setRandomTask(firstThreeTasks[randomIndex]);
        } else {
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      {randomTask ? (
        <>
          <p>{randomTask.task_name}</p>
          <TaskColumn tasks={tasks} />
        </>
      ) : (
        <p className={styles.TaskNotFound}>タスクが見つかりませんでした</p>
      )}
    </div>
  );
}

export default TaskSuggestionButton;