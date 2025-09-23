'use client'
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import styles from './TaskWindow.module.css'
import { Task } from '@/lib/entity'
import { updateTask } from '@/lib/db_api_wrapper'
import { useRouter } from 'next/navigation'



const EditTaskWindow = ({ task, onSubmitTask, onDeleteTask, onClose }: EditTaskWindowProps) => {
  //フォームの値を管理するためのステート
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      task_name: task.task_name,
      total_set: task.total_set,
      deadline: task.deadline ? task.deadline.slice(0, 10) : '',
    },
  })
  // 詳細設定の表示状態を管理するためのステート
  const [showDetails, setShowDetails] = useState(true);
  // 編集ボタンをクリックしたかどうか
  const [disableAddButton, setDisableAddButton] = useState(false);
  // ルーターを取得
  const router = useRouter()

  const current_set = task.current_set
  const is_complete = task.is_complete

  useEffect(() => {
    setValue('task_name', task.task_name);
    setValue('total_set', task.total_set);
    setValue('deadline', task.deadline ? task.deadline.slice(0, 10) : '');
  }, [task, setValue]);

  //フォーム送信時の処理
  const onSubmit = (data: any) => {
    const { task_name, total_set, deadline } = data;
    const trimmedTaskName = task_name?.trim();
    const parsedTotalSet = Number(total_set);

    if (!trimmedTaskName || Number.isNaN(parsedTotalSet) || parsedTotalSet < 1) {
      alert("タイトルとセット数を入力してください");
      return;
    }

    const taskData: Task = {
      ...task,
      task_name: trimmedTaskName,
      total_set: parsedTotalSet,
      deadline: deadline ?? '',
      current_set,
      is_complete,
    };

    console.log('[EditTaskWindow] submit', taskData);
    handleTaskData(taskData); // 受け渡し用関数にデータを渡す
  }
  // 受け渡し用関数
  const handleTaskData = async (taskData: Task) => {
    if (!taskData.id) {
      console.error("タスクIDが見つかりません");
      return;
    }

    try {
      setDisableAddButton(true)
      await updateTask(taskData);
      console.log('[EditTaskWindow] updateTask success');
      pageTransition(); // ページ遷移
      // 画面を必ず更新
      if (typeof window !== 'undefined') window.location.reload();
    } catch (error) {
      setDisableAddButton(false)
      console.error("タスクの編集に失敗しました", error);
    }
  }

    //ページ遷移用関数
  const pageTransition = () => {
    if (onClose) {
      onClose()
    }
  }

  // totalSetをランダムに設定する関数
  const setRandomTotalSet = () => {
      const randomValue = Math.floor(Math.random() * 3) + 1;
      setValue('total_set', randomValue);
  };



  return (
  <div className="App" onClick={(event) => event.stopPropagation()}>
      <div className={styles.header}>
          <h1>タスクを編集</h1>
          <button className={styles.trashButton} onClick={() => onDeleteTask && task.id && onDeleteTask(task.id)}>削除</button>
          <button className={styles.closeButton} onClick={pageTransition}>×</button>

      </div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p>タイトル</p>
        <input id="task_name" {...register('task_name')}/>
      </div>
      <div>
        <p>セット数</p>
        <button type="button" onClick={setRandomTotalSet}>自動</button>
        <input id="total_set" type="number" min="1" step="1" {...register('total_set')}/>
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

          <button
            disabled={disableAddButton}
            type="submit"
          >
            編集
          </button>
      </form>
  </div>
  );
};

export default EditTaskWindow;
