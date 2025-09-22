'use client'

import React from "react"
import { Task } from "@/lib/entity"

interface TaskStartButtonProps {
    task: Task
    onStart?: (task: Task) => void
}


const TaskStartButton: React.FC<TaskStartButtonProps> = ({ task, onStart }) => {
    function handleClick() {
        if (onStart) {
            onStart(task)
        }
    }

    // TSXを返す
    // TODO: ボタンのスタイルを設定する
    return <button onClick={handleClick}>開始</button>
}

export default TaskStartButton

