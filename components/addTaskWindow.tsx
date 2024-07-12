'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import styles from './taskWindow.module.css'
import { Task, User } from '@/lib/entity'
import { createTask } from '@/lib/db_api_wrapper'

const page = () => {
    const { register, handleSubmit, setValue, getValues } = useForm()
    
    // 新しい関数を定義
    const handleTaskData = (taskData: { task_name: string, total_set: number, deadline: string, current_set: number, is_complete: boolean }) => {
        // ここでtaskDataを使って何かを行う
        createTask(taskData).then(() => {
            console.log("タスクを追加しました");
        }).catch((error) => {
            console.error("タスクの追加に失敗しました", error);
        });
    }

    //クリック時のアクション
    const onSubmit = (data: any) => {
        let { task_name, total_set, deadline } = data;
        let current_set = total_set; // current_setをtotal_setと同じに設定
        let is_complete = false; // is_completeをfalseに設定
        
        if (!task_name || !total_set || !deadline) {
            alert("タイトルとセット数と期限を入力してください");
            return;
        }
        
        const taskData = { task_name, total_set, deadline, current_set, is_complete };
        handleTaskData(taskData); // 新しい関数にデータを渡す
    }
    const today = new Date().toISOString().split('T')[0];

    // 詳細設定の表示状態を管理するためのステート
    const [showDetails, setShowDetails] = useState(false);



    // totalSetをランダムに設定する関数
    const setRandomTotalSet = () => {
        const randomValue = Math.floor(Math.random() * 3) + 1;
        setValue('total_set', randomValue);
    };

    return (
    <div>
        <div className={styles.header}>
            <h1>タスク追加</h1>
            <button className={styles.closeButton}>×</button>
        </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p>タイトル</p>
          <input id="task_name" {...register('task_name')}/>
        </div>
        <div>
          <p>セット数</p>
          <button type="button" onClick={setRandomTotalSet}>自動</button>
          <input id="total_set" type="number" min="1" step="1" defaultValue={1} {...register('total_set')}/>
        </div>

        <div>
          <button type="button" onClick={() => setShowDetails(!showDetails)}>詳細設定</button>
          //詳細設定の表示状態を管理するためのステート
          {showDetails && (
            <div>
              <p>期限</p>
              <input type="date" defaultValue={today} {...register('deadline')} />
            </div>
          )}
        </div>

            <button type="submit">追加</button>
        </form>
    </div>
    );


};

export default page;