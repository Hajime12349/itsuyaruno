'use client'

import React from "react"
import { Task } from "@/lib/entity"
import { updateUser } from "@/lib/db_api_wrapper"
import { useRouter } from "next/navigation"

interface TaskStartButtonProps {
    task: Task
}

const TaskStartButton: React.FC<TaskStartButtonProps> = ({ task }) => {
    const router = useRouter()
    function onStart() {
        updateUser({ current_task: task.id }).then(() => { // ユーザーのcurrent_taskを更新できたら
            console.log('Task started');
            router.push(`/timer-start-screen`);
        }).catch((error) => { // ユーザーのcurrent_taskを更新できなかったら
            console.error('Failed to start task:', error);
        });
    }

    // TSXを返す
    // TODO: ボタンのスタイルを設定する
    return <button onClick={onStart}>開始</button>
}

export default TaskStartButton

