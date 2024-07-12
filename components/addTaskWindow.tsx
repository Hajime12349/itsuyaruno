'use client'
import { postAction } from "@/components/taskWindowAction";
import { useState } from 'react';
import { useForm } from 'react-hook-form'

const page = () => {
    const { register, handleSubmit, setValue, getValues } = useForm()
    const onSubmit = (data: any) => {
        const { taskName, totalSet } = data;
        if (!taskName || !totalSet) {
            alert("taskNameとtotalSetを入力してください");
            return;
        }
        //onSubmitによってフォームが送信されたときにデータをコンソールにログ出力する。ほんとはここでバックエンドに送信したい。
        console.log(data);
    }
    const today = new Date().toISOString().split('T')[0];

    // 詳細設定の表示状態を管理するためのステート
    const [showDetails, setShowDetails] = useState(false);

    // totalSetをランダムに設定する関数
    const setRandomTotalSet = () => {
        const randomValue = Math.floor(Math.random() * 3) + 1;
        setValue('totalSet', randomValue);
    };

    return (
    <div>
        <h1>ここにヘッダー？</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <p>タイトル</p>
          <input id="taskName" {...register('taskName')}/>
        </div>
        <div>
          <p>セット数</p>
          <button type="button" onClick={setRandomTotalSet}>自動</button>
          <input id="totalSet" {...register('totalSet')}/>
        </div>

        <div>
          <button type="button" onClick={() => setShowDetails(!showDetails)}>詳細設定</button>
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