"use client";

import TaskColumn from "@/components/task-config-main-screen/TaskColumn";
import styles from "@/components/task-config-main-screen/TaskColumn.module.css";
import { getTasks } from "@/lib/db_api_wrapper";
import { useEffect, useState } from "react";
import { Task } from "@/lib/entity";

export default function TaskColumnTest() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        getTasks().then(setTasks).catch(console.error);
    }, []);


    return (
        <main>
            <div className={styles.scrollContainer}>
                <TaskColumn tasks={tasks} />
            </div>
        </main>
    );
}
