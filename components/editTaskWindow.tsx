'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import styles from './taskWindow.module.css'
import { Task, User } from '@/lib/entity'
import { createTask } from '@/lib/db_api_wrapper'



const page = ({ task_name, total_set, deadline, current_set, is_complete }: { task_name: string, total_set: number, deadline: string, current_set: number, is_complete: boolean }) => {
  //フォームの値を管理するためのステート
  const { register, handleSubmit, setValue, getValues } = useForm()
  // 詳細設定の表示状態を管理するためのステート
  const [showDetails, setShowDetails] = useState(false);

  
  //クリック時のアクション
  const onSubmit = (data: any) => {
    let { task_name, total_set, deadline } = data;
        
    if (!task_name || !total_set ) {
      alert("タイトルとセット数を入力してください");
      return;
    }
    const taskData = { task_name, total_set, deadline, current_set, is_complete };
    handleTaskData(taskData); // 受け渡し用関数にデータを渡す
  }
  // 受け渡し用関数
  const handleTaskData = (taskData: { task_name: string, total_set: number, deadline: string, current_set: number, is_complete: boolean }) => {
    createTask(taskData).then(() => {
      console.log("タスクを編集しました");
      console.log(taskData);
    }).catch((error) => {
      console.error("タスクの編集に失敗しました", error);
    });
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
          <button className={styles.closeButton}>×</button>
      </div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p>タイトル</p>
        <input id="task_name" defaultValue={task_name} {...register('task_name')}/>
      </div>
      <div>
        <p>セット数</p>
        <button type="button" onClick={setRandomTotalSet}>自動</button>
        <input id="total_set" type="number" min="1" step="1" defaultValue={total_set} {...register('total_set')}/>
      </div>

      <div>
        <button type="button" onClick={() => setShowDetails(!showDetails)}>詳細設定</button>
        {showDetails && (
          <div>
            <p>期限</p>
            <input type="date" defaultValue={deadline} {...register('deadline')} />
          </div>
        )}
      </div>

          <button type="submit">追加</button>
      </form>
  </div>
  );
};

export default page;