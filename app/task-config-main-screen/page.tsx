'use client'

import React from 'react';
import styles from './page.module.css';
import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import { Task } from "@/lib/entity";
import { getTasks } from "@/lib/db_api_wrapper";
import TaskColumn from '@/components/TaskColumn';
import { NextAuthProvider, WithLoggedIn } from '@/app/provider';

export default function Home() {

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks().then(setTasks).catch(console.error);
  }, []);



  return (
    <NextAuthProvider>
      <WithLoggedIn>
        <main className={styles.main}>
          <div>
            <Header />
            <input type="text" placeholder="検索" className={styles.search} />
            <div className={styles.scrollContainer}>
              <TaskColumn tasks={tasks} />
            </div>
          </div>
        </main>
      </WithLoggedIn>
    </NextAuthProvider>
  );
}