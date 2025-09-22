import { useMemo } from 'react';
import { User, Task } from '@/lib/entity';
import styles from './TaskSuggestionButton.module.css';
import TaskColumn from './TaskColumn';
import { randomInt } from 'crypto';

interface TaskSuggestionButtonProps {
  tasks: Task[]
}

function TaskSuggestionButton({ tasks }: TaskSuggestionButtonProps) {
  const randomTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return []
    const shuffledTasks = [...tasks].sort(() => 0.5 - Math.random());
    return shuffledTasks.slice(0, 3);
  }, [tasks])

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