'use client'
import { postAction } from "@/components/taskWindowAction";


import { useForm } from 'react-hook-form'

const page = () => {
    const { register, handleSubmit } = useForm()
    //onSubmitによってフォームが送信されたときにデータをコンソールにログ出力する。ほんとはここでバックエンドに送信したい。
    const onSubmit = (data: any) => console.log(data)
    const today = new Date().toISOString().split('T')[0]

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
          <button type="button">自動</button>
          <input id="totalSet" {...register('totalSet')}/>
        </div>

        <div>
          <button type="button">詳細設定</button>
          <p>詳細設定</p>
          <div>
            <p> 期限 </p>
            <button type="button">日付</button>
            <input type="date" defaultValue={today} {...register('deadline')} />
          </div>
        </div>

        <button type="submit"> 追加 </button>

      </form>
    </div>
    );


};

export default page;