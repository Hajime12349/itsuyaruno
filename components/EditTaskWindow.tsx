'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import styles from './TaskWindow.module.css'
import { Task, User } from '@/lib/entity'
import { createTask,deleteTask } from '@/lib/db_api_wrapper'
import { useRouter } from 'next/navigation'



const EditTaskWindow = ({ task }: { task:Task}) => {
  //フォームの値を管理するためのステート
  const { register, handleSubmit, setValue, getValues } = useForm()
  // 詳細設定の表示状態を管理するためのステート
  const [showDetails, setShowDetails] = useState(true);
  // 編集ボタンをクリックしたかどうか
  const [disableAddButton, setDisableAddButton] = useState(false);
  // ルーターを取得
  const router = useRouter()

  let current_set =task.current_set
  let is_complete=task.is_complete

  //クリック時のアクション
  const onSubmit = (data: any) => {
    let { task_name, total_set, deadline} = data;
        
    if (!task_name || !total_set ) {
      alert("タイトルとセット数を入力してください");
      return;
    }
    const taskData = { task_name, total_set, deadline, current_set, is_complete };
    handleTaskData(taskData); // 受け渡し用関数にデータを渡す
    pageTransition(); // ページ遷移
  }
  // 受け渡し用関数
  const handleTaskData = (taskData: { task_name: string, total_set: number, deadline: string, current_set: number, is_complete: boolean }) => {
    setDisableAddButton(true)
    createTask(taskData).then(() => {
      if (task.id) {
        deleteTask(task.id).then(()=>{
          console.log("タスクを編集しました");
          console.log(taskData);
          window.location.reload();
        })
      }
    }).catch((error) => {
      console.error("タスクの編集に失敗しました", error);
    });
  }

    //ページ遷移用関数
  const pageTransition = () => {
    router.push('/task-config-main-screen')
  }

  // 今日の日付を取得
  const today = new Date().toISOString().split('T')[0];

  // totalSetをランダムに設定する関数
  const setRandomTotalSet = () => {
      const randomValue = Math.floor(Math.random() * 3) + 1;
      setValue('total_set', randomValue);
  };



  return (
  <div className="App">
      <div className={styles.header}>
          <h1>タスクを編集</h1>
          <button className={styles.trashButton}>削除</button>
          <button className={styles.closeButton} onClick={pageTransition}>×</button>

      </div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p>タイトル</p>
        <input id="task_name" defaultValue={task.task_name} {...register('task_name')}/>
      </div>
      <div>
        <p>セット数</p>
        <button type="button" onClick={setRandomTotalSet}>自動</button>
        <input id="total_set" type="number" min="1" step="1" defaultValue={task.total_set} {...register('total_set')}/>
      </div>

      <div>
        <button type="button" onClick={() => setShowDetails(!showDetails)}>詳細設定</button>
        {showDetails && (
          <div>
            <p>期限</p>
            <input type="date" defaultValue={task.deadline} {...register('deadline')} />
          </div>
        )}
      </div>

          <button disabled={disableAddButton} type="submit">編集</button>
      </form>
  </div>
  );
};

export default EditTaskWindow;