'use client'

import React from 'react';
import styles from './page.module.css';
import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { Task } from "@/lib/entity";
import { createTask, deleteTask, getTasks, updateTask } from "@/lib/db_api_wrapper";
import TaskColumn from '@/components/task-config-main-screen/TaskColumn';
import { NextAuthProvider, WithLoggedIn } from '@/app/provider';
import type { TaskDraft } from '@/components/task-config-main-screen/types';

export default function Home() {

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
  }, []);

  const handleCreateTask = async (draft: TaskDraft) => {
    const payload: Task = {
      task_name: draft.task_name,
      total_set: draft.total_set,
      current_set: draft.current_set,
      is_complete: draft.is_complete,
      deadline: draft.deadline,
    };

    const created = await createTask(payload);
    setTasks((prev) => [...prev, created]);
  };

  const handleUpdateTask = async (task: Task) => {
    if (!task.id) {
      throw new Error('Task id is required for update');
    }

    const sanitized: Task = {
      ...task,
      deadline: task.deadline && task.deadline.trim().length > 0 ? task.deadline : undefined,
    };

    const updated = await updateTask(sanitized);
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteTask = async (taskId: number) => {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };


//<input type="text" placeholder="検索" className={styles.search} />
          
  return (
    <NextAuthProvider>
      <WithLoggedIn>
        <main className={styles.main}>
          <div>
            <Header />
            <div className={styles.scrollContainer}>
              <TaskColumn
                tasks={tasks}
                onCreateTask={handleCreateTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          </div>
        </main>
      </WithLoggedIn>
    </NextAuthProvider>
  );
}
