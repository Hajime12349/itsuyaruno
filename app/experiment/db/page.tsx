import { db, Task } from "@/lib/kysely"
import { useState, useEffect } from "react"

export default function DBPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    useEffect(() => {
        db.selectFrom('tasks').selectAll().execute().then(setTasks)
    }, [])
    return (
        <div>
            <h1>Tasks</h1>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>{task.task_name}</li>
                ))}
            </ul>
        </div>
    )
}