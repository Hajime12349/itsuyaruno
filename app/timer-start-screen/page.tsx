"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NextAuthProvider, WithLoggedIn } from "@/app/provider";
import Header from "@/components/Header";
import NavigateTaskButton from "@/components/NavigateTaskButton";
import ProgressBar from "@/components/ProgressBar";
import { getTask, getUser } from "@/lib/api_wrapper";
import type { TaskDTO as Task } from "@/interfaces/http/tasks/mappers";
import type { IUserDataModel } from "@/application/users/UserDataModelMapper";
import styles from "./TimerStartScreen.module.css";

export default function TimerStartScreen() {
  const [user, setUser] = useState<IUserDataModel | undefined>();
  const [currentTask, setCurrentTask] = useState<Task | undefined>();
  const router = useRouter();

  useEffect(() => {
    getUser().then((user) => {
      setUser(user);
      if (user.currentTask) {
        getTask(user.currentTask).then((task) => {
          setCurrentTask(task);
        });
      }
    });
  }, []);

  return (
    <NextAuthProvider>
      <WithLoggedIn>
        <main className={styles.main}>
          <Header />
          <div className={styles.TaskTextComponets}>
            <ProgressBar
              task={currentTask}
              isTask={true}
              progress={10}
              onStartFromStartScreen={() => {
                router.push("/timer-working-screen");
              }}
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
