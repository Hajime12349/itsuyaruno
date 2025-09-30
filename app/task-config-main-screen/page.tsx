'use client'

import React, { useEffect, useState } from 'react';
import { NextAuthProvider, WithLoggedIn } from '@/app/provider';
import Header from '@/components/Header';
import TaskColumn from '@/components/task-config-main-screen/TaskColumn';
import type { TaskDraft } from '@/components/task-config-main-screen/types';
import { createTask, deleteTask, getTasks, updateTask } from "@/interfaces/http/api_wrapper";
import type { TaskCreatePayload } from '@/interfaces/http/api_wrapper';
import type { TaskDTO as Task } from '@/interfaces/http/tasks/mappers';
import { BadRequestError } from '@/lib/errors/AppError';
import styles from './page.module.css';

export default function Home() {

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
  }, []);

  const handleCreateTask = async (draft: TaskDraft) => {
    const payload: TaskCreatePayload = {
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
      throw new BadRequestError('Task id is required for update');
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
