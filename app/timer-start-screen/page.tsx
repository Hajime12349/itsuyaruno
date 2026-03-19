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
import LoadingScreen from "@/components/common/LoadingScreen";
import styles from "./TimerStartScreen.module.css";

export default function TimerStartScreen() {
  const [, setUser] = useState<User | undefined>(); // user はこのコンポーネント内で未使用のため、値部分を破棄する
  const [currentTask, setCurrentTask] = useState<Task | undefined>();
  const [isTask, setIsTask] = useState(true);
  const router = useRouter();
  
  
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

  const handleTimerComplete = async () => {

    if (isTask) {
      if (!currentTask || typeof currentTask.id !== "number") {
        // currentTask が取得できていない場合は未処理例外を投げず、安全なフォールバックとして完了画面へ遷移する
        console.error("currentTask is not defined. Redirecting to /timer-finish-screen as a safe fallback.");
        router.replace("/timer-finish-screen");
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
        setIsTask(false);
      }
    } else {
      router.replace("/timer-finish-screen");
    }
  };

  return (
    <NextAuthProvider>
      <WithLoggedIn>
        <main className={styles.main}>
          <Header />
          <div className={styles.TaskTextComponents}>
            {isTask && !currentTask ? (
              <LoadingScreen />
            ) : (
              <ProgressBar
                key={isTask ? "task" : "break"}
                task={isTask ? currentTask : undefined}
                onTickComplete={handleTimerComplete}
              />
            )}
          </div>
          {isTask && (
            <div className={styles.NavigateTaskButton}>
              <NavigateTaskButton />
            </div>
          )}
        </main>
      </WithLoggedIn>
    </NextAuthProvider>
  );
}
