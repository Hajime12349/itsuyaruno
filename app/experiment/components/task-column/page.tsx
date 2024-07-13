"use client";

import TaskColumn from "@/components/TaskColumn";
import styles from "@/components/TaskColumn.module.css";
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