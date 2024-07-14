"use client";
"use client";

import Image from "next/image";
import styles from "./TimerWorkingScreen.module.css";
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';
import { User, Task } from '@/lib/entity';
import { getUser, getTask } from '@/lib/db_api_wrapper';
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function TimerWorkingScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | undefined>();
  const [currentTask, setCurrentTask] = useState<Task | undefined>();

  useEffect(() => {
    getUser()
      .then((user) => {
        setUser(user);
        if (user.current_task) {
          getTask(user.current_task)
            .then((task) => {
              setCurrentTask(task);
            })
        } else {
          router.replace('/task-config-main-screen');
        }
      });
  }, [router]);

  return (
    <main className={styles.main}>
      <Header />
      <ProgressBar task={currentTask} isTask={true} progress={10} />
    </main>
  );
}
