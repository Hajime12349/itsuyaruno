'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './TaskWindow.module.css';
import type { TaskDraft } from './types';

interface AddTaskWindowProps {
  onSubmitTask: (task: TaskDraft) => Promise<void>;
  onClose: () => void;
}

const AddTaskWindow = ({ onSubmitTask, onClose }: AddTaskWindowProps) => {
  const { register, handleSubmit, setValue } = useForm();
  const [showDetails, setShowDetails] = useState(false);
  const [disableAddButton, setDisableAddButton] = useState(false);

  const onSubmit = async (data: any) => {
    const { task_name, total_set, deadline } = data ?? {};
    const trimmedName = typeof task_name === 'string' ? task_name.trim() : '';
    const parsedTotalSet = typeof total_set === 'number' ? total_set : Number(total_set);

    if (trimmedName.length === 0 || Number.isNaN(parsedTotalSet) || parsedTotalSet < 1) {
      alert("タイトルとセット数を入力してください");
      return;
    }

    const normalizedDeadline =
      typeof deadline === 'string' && deadline.trim().length > 0 ? deadline : undefined;

    const taskData: TaskDraft = {
      task_name: trimmedName,
      total_set: parsedTotalSet,
      deadline: normalizedDeadline,
      current_set: 0,
      is_complete: false,
    };

    await handleTaskData(taskData);
  };

  const handleTaskData = async (taskData: TaskDraft) => {
    setDisableAddButton(true);
    try {
      await onSubmitTask(taskData);
      onClose();
    } catch (error) {
      console.error("タスクの追加に失敗しました", error);
      alert('タスクの追加に失敗しました');
      setDisableAddButton(false);
    }
  };

  const closeModal = () => {
    onClose();
  };

  const setRandomTotalSet = () => {
    const randomValue = Math.floor(Math.random() * 3) + 1;
    setValue('total_set', randomValue);
  };

  return (
    <div className="App">
      <div className={styles.header}>
        <h1>タスクを追加</h1>
        <button className={styles.closeButton} onClick={closeModal}>×</button>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p>タイトル</p>
          <input id="task_name" {...register('task_name')} />
        </div>
        <div>
          <p>セット数</p>
          <button type="button" onClick={setRandomTotalSet}>自動</button>
          <input id="total_set" type="number" min="1" step="1" defaultValue={1} {...register('total_set')} />
        </div>

        <div>
          <button type="button" onClick={() => setShowDetails(!showDetails)}>詳細設定</button>
          {showDetails && (
            <div>
              <p>期限</p>
              <input type="date" {...register('deadline')} />
            </div>
          )}
        </div>

        <button disabled={disableAddButton} type="submit">追加</button>
      </form>
    </div>
  );
};

export default AddTaskWindow;
