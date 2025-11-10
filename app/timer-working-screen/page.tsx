"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NextAuthProvider, WithLoggedIn } from "@/app/provider";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { getTask, getUser, updateTask } from "@/lib/api_wrapper";
import type { ITaskDataModel as Task } from "@/application/tasks/TaskDataModelMapper";
import type { IUserDataModel as User } from "@/application/users/UserDataModelMapper";
import styles from "./TimerWorkingScreen.module.css";

export default function TimerWorkingScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | undefined>();
  const [currentTask, setCurrentTask] = useState<Task | undefined>();
  const WORK_DURATION = process.env.NODE_ENV === "development" ? 3 : 1500;

  const handleWorkTimerComplete = async () => {
    if (!currentTask || typeof currentTask.id !== "number") {
      router.replace("/timer-break-screen");
      return;
    }

    const nextSet = Math.min(
      currentTask.current_set + 1,
      currentTask.total_set
    );
    const taskPayload: Task = { ...currentTask, current_set: nextSet };

    try {
      const updated = await updateTask(taskPayload);
      setCurrentTask(updated);
    } catch (error) {
      console.error("タスクのセット数更新に失敗しました", error);
    } finally {
      router.replace("/timer-break-screen");
    }
  };

  useEffect(() => {
    getUser().then((user) => {
      setUser(user);
      if (user.currentTask) {
        getTask(user.currentTask).then((task) => {
          setCurrentTask(task);
        });
      } else {
        router.replace("/task-config-main-screen");
      }
    });
  }, [router]);

  return (
    <NextAuthProvider>
      <WithLoggedIn>
        <main className={styles.main}>
          <Header />
          <ProgressBar
            task={currentTask}
            isTask={true}
            progress={WORK_DURATION}
            onTickComplete={handleWorkTimerComplete}
          />
        </main>
      </WithLoggedIn>
    </NextAuthProvider>
  );
}
