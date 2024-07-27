import { db, Task } from "@/lib/kysely"
import { Suspense } from "react"

async function TaskList() {
    const tasks = await db.selectFrom('tasks').selectAll().execute()
    return <ul>{tasks.map((task) => <li key={task.id}>{task.task_name}</li>)}</ul>
}

export default function DBPage() {
    return (
        <div>
            <h1>tasks</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <TaskList />
            </Suspense>
        </div>
    )
}