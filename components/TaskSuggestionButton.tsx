import { useState, useEffect } from 'react';
import { User, Task } from '@/lib/entity';
import { getTasks } from '@/lib/db_api_wrapper';
import styles from './TaskSuggestionButton.module.css';
import TaskColumn from './TaskColumn';
import { randomInt } from 'crypto';

function TaskSuggestionButton() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [randomTasks, setRandomTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks()
      .then((tasks) => {
        setTasks(tasks);
        if (tasks.length > 0) {
          //タスクがある場合はランダムにタスクを３つまで選択
          const shuffledTasks = tasks.sort(() => 0.5 - Math.random());
          const selectedTasks = shuffledTasks.slice(0, 3);
          //ランダムに選択したタスクをセット
          setRandomTasks(selectedTasks);
        } else {
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      {randomTasks.length > 0 ? (
        <>
          <TaskColumn tasks={randomTasks} />
        </>
      ) : (
        <p className={styles.TaskNotFound}>タスクが見つかりませんでした</p>
      )}
    </div>
  );
}

export default TaskSuggestionButton;