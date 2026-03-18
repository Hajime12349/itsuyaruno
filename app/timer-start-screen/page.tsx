"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NextAuthProvider, WithLoggedIn } from "@/app/provider";
import Header from "@/components/Header";
import NavigateTaskButton from "@/components/NavigateTaskButton";
import ProgressBar from "@/components/ProgressBar";
import { getTask, getUser, updateTask } from "@/lib/api_wrapper";
import type { ITaskDataModel as Task } from "@/application/tasks/TaskDataModelMapper";
import type { IUserDataModel as User} from "@/application/users/UserDataModelMapper";
import styles from "./TimerStartScreen.module.css";

export default function TimerStartScreen() {
  const [user, setUser] = useState<User | undefined>();
  const [currentTask, setCurrentTask] = useState<Task | undefined>();
  const router = useRouter();
  const WORK_DURATION = process.env.NODE_ENV === "development" ? 3 : 1500;

  useEffect(() => {
    getUser().then((user) => {
      setUser(user);
      console.log("ユーザー情報を取得しました:", user); 
      if (user.currentTask) {
        getTask(user.currentTask).then((task) => {
          setCurrentTask(task);
          console.log("task", task);
        });
      }
      else {
        console.log("currentTaskが設定されていません", user.currentTask);
      }
    });
  }, []);

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

  return (
    <NextAuthProvider>
      <WithLoggedIn>
        <main className={styles.main}>
          <Header />
          <div className={styles.TaskTextComponets}>
            <ProgressBar
              task={currentTask}
              isTask={true}
              progress={WORK_DURATION}
              onTickComplete={handleWorkTimerComplete}
            />
          </div>
          <div className={styles.NavigateTaskButton}>
            <NavigateTaskButton />
          </div>
        </main>
      </WithLoggedIn>
    </NextAuthProvider>
  );
}
