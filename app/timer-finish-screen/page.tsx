"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NextAuthProvider, WithLoggedIn } from "@/app/provider";
import Header from "@/components/Header";
import NavigateTaskButton from "@/components/NavigateTaskButton";
import TaskSuggestionButton from "@/components/timer-finish-screen/TaskSuggestionButton";
import { getTask, getTasks, getUser, updateTask } from "@/lib/api_wrapper";
import type { TaskDTO as Task } from "@/interfaces/http/tasks/mappers";
import type { UserDTO as User } from "@/interfaces/http/users/mappers";
import styles from "./TimerFinishScreen.module.css";

export default function TimerFinishScreen() {
  // ルーターを取得
  const router = useRouter();

  const [currentTask, setCurrentTask] = useState<Task | undefined>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDecided, setIsDecided] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const taskSuggestions = useMemo(() => {
    return tasks.filter((task) => !task.is_complete);
  }, [tasks]);

  useEffect(() => {
    getUser() // ユーザー情報をDBから取得
      .then((user) => {
        // ユーザー情報をDBから取得できたら
        if (!user.current_task) return; // 現在のタスクが無ければ即リターン
        getTask(user.current_task) // current_task(現在のタスクの「ID」)をもとに、タスクをDBから取得
          .then((currentTask) => {
            // タスクをDBから取得できたら
            setCurrentTask(currentTask); // taskというコンポーネントの状態に取得したタスクをセット
          });
      })
      .catch((error) => {
        // エラーが生じたら
        console.error(error);
      });
  }, []);

  useEffect(() => {
    getTasks()
      .then((tasks) => {
        setTasks(tasks);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const decideContinue = () => {
    if (!currentTask || typeof currentTask.id !== "number") {
      setIsFinished(false);
      setIsDecided(true);
      return;
    }

    const nextSet = currentTask.current_set + 1;
    const taskPayload: Task = { ...currentTask, current_set: nextSet };

    updateTask(taskPayload)
      .then((updatedTask) => {
        setCurrentTask(updatedTask);
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (typeof task.id !== "number" || task.id !== updatedTask.id) {
              return task;
            }
            return updatedTask;
          }),
        );
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsFinished(false);
        setIsDecided(true);
      });
  };
  const decideChange = () => {
    if (!currentTask) return;
    currentTask.is_complete = true;
    updateTask(currentTask)
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsFinished(true);
        setIsDecided(true);
      });
  };

  //ページ遷移用関数
  const pageTransition = () => {
    router.push("/timer-start-screen");
  };

  return (
    <NextAuthProvider>
      <WithLoggedIn>
        <main className={styles.main}>
          <Header />
          {!isDecided ? (
            <div className={styles.AskFinish}>
              <h2>現在のタスクは終わりましたか？</h2>
              <div className={styles.AskButtonDiv}>
                <button onClick={decideChange}>はい</button>
                <button onClick={decideContinue}>いいえ</button>
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.FinishTexts}>
                <h2 className={styles.TaskFinishText}>休憩が終了しました！</h2>
                <h2 className={styles.TaskChangeText}>
                  タスクを変更しますか？
                </h2>
              </div>
              <div className={styles.ControlNextTaskFrame}>
                {isFinished ? (
                  <></>
                ) : (
                  <div>
                    <button
                      className={styles.TaskContinue}
                      onClick={pageTransition}
                    >
                      Continue
                    </button>
                    <p className={styles.TextOR}>or</p>
                  </div>
                )}

                <div className={styles.NextTasks}>
                  <TaskSuggestionButton tasks={taskSuggestions} />
                </div>
              </div>

              <div className={styles.NavigateTaskButton}>
                <NavigateTaskButton />
              </div>
            </div>
          )}
        </main>
      </WithLoggedIn>
    </NextAuthProvider>
  );
}
