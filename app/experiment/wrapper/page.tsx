'use client';

import { NextAuthProvider } from "@/app/provider";
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import { getUserID } from "@/lib/auth";
import { getUser, getTask, getTasks, createTask, updateTask, deleteTask, updateUser, registerUser } from "@/lib/db_api_wrapper";
import { Task, User } from "@/lib/entity";
import TaskPanel from "@/components/TaskPanel";


const CRUDApiWrapperTestComponent = () => {
    const { data: session } = useSession();
    const [tasks, setTasks] = useState<Task[]>();
    const [user, setUser] = useState<User>();

    // 最初にタスク一覧を取得する
    useEffect(() => {
        getTasks().then(setTasks);
    }, []);

    useEffect(() => {
        getUser().then(setUser);
    }, []);

    // タスクを作成する関数を定義
    function onCreateTask(task: Task) {
        createTask(task).then( // タスクを作成する
            () => {
                getTasks() // タスク追加後のタスク一覧を取得
                    .then(setTasks) // タスク一覧の状態を更新
                    .catch((error) => { // getTasksで発生したエラーをキャッチ
                        console.error('Failed to get tasks:', error);
                    });
            }
        )
            .catch((error) => { // createTaskで発生したエラーをキャッチ
                console.error('Failed to create task:', error);
            });
    }

    // タスクを更新する関数を定義
    function onUpdateTask(task: Task) {
        updateTask(task).then( // タスクを更新する
            () => {
                getTasks() // タスク更新後のタスク一覧を取得
                    .then(setTasks) // タスク一覧の状態を更新
                    .catch((error) => { // getTasksで発生したエラーをキャッチ
                        console.error('Failed to get tasks:', error);
                    });
            }
        )
            .catch((error) => { // updateTaskで発生したエラーをキャッチ
                console.error('Failed to update task:', error);
            });
    }

    // タスクを削除する関数を定義
    function onDeleteTask(id?: number) {
        if (!id) {
            console.error('Failed to delete task');
            return;
        }
        deleteTask(id).then( // タスクを削除する
            () => {
                getTasks() // タスク削除後のタスク一覧を取得
                    .then(setTasks) // タスク一覧の状態を更新
                    .catch((error) => { // getTasksで発生したエラーをキャッチ
                        console.error('Failed to get tasks:', error);
                    });
            }
        )
            .catch((error) => { // deleteTaskで発生したエラーをキャッチ
                console.error('Failed to delete task:', error);
            });
    }

    // ユーザーを更新する関数を定義
    function onUpdateUser(user: User) {
        updateUser(user).then( // ユーザーを更新する
            () => {
                getUser()
                    .then(setUser) // ユーザーの状態を更新
                    .catch((error) => { // getUserで発生したエラーをキャッチ
                        console.error('Failed to get user:', error);
                    });
            }
        )
            .catch((error) => { // updateUserで発生したエラーをキャッチ
                console.error('Failed to update user:', error);
            });
    }

    // ユーザーを登録する関数を定義
    function onRegisterUser(user: User) {
        registerUser(user).then( // ユーザーを登録する
            () => {
                getUser()
                    .then(setUser) // ユーザーの状態を更新
                    .catch((error) => { // getUserで発生したエラーをキャッチ
                        console.error('Failed to get user:', error);
                    });
            }
        )
            .catch((error) => { // registerUserで発生したエラーをキャッチ
                console.error('Failed to register user:', error);
            });
    }

    function onStartTask(id?: number) {
        if (!id) {
            console.error('Failed to start task');
            return;
        }
        updateUser({ current_task: id, current_task_time: new Date().toISOString() }).then(() => {
            getUser()
                .then(setUser)
                .catch((error) => {
                    console.error('Failed to get user:', error);
                });
        })
            .catch((error) => {
                console.error('Failed to start task:', error);
            });
    }

    // ユーザー情報を表示するTSX要素
    var user_info_tsx = (
        <div>
            <h1>ユーザー情報</h1>
            <p>{session?.user?.name}</p>
            <p>{session?.user?.email}</p>
            <p>{session?.user?.image}</p>
            <p>{getUserID(session)}</p>
        </div>
    );

    // DBに登録されているユーザー情報を表示するTSX要素
    var user_info_in_db_tsx = (
        <div>
            <h1>ユーザー情報 in DB</h1>
            <p>{user?.display_name}</p>
            <p>{user?.icon_path}</p>
            <p>{user?.id}</p>
            <p>{user?.current_task}</p>
            <p>{user?.current_task_time}</p>
        </div>
    );

    // DBにユーザーが存在しない場合は、ユーザーを登録するボタンを表示する
    if (!(user?.id)) {
        user_info_in_db_tsx = (
            <div>
                <h1>ユーザー情報 in DB</h1>
                <p>ユーザーが存在しません</p>
                <button onClick={() => {
                    onRegisterUser({ display_name: session?.user?.name || "" })
                }}>ユーザーを登録</button>
            </div>
        );
    }

    // タスク一覧のヘッダーを表示するTSX要素
    var tasks_header_tsx = (
        <div>
            <h1>タスク一覧</h1>
            <button onClick={() => {
                onCreateTask({ task_name: '新しいタスク', total_set: 1, current_set: 0, deadline: "2024-08-05 12:00:00", is_complete: false });
            }}>タスクを作成</button>
        </div>
    );

    return (
        <div>
            {user_info_tsx}
            {user_info_in_db_tsx}
            {tasks_header_tsx}
            <ul>
                {tasks?.map((task) => {
                    return (
                        <div key={task.id}>
                            <TaskPanel task={task} isSelected={false} onClick={() => { }} />
                            <button onClick={() => {
                                onDeleteTask(task.id);
                            }}>タスクを削除</button>
                            <button onClick={() => {
                                onUpdateTask({ ...task, is_complete: true });
                            }}>タスクを完了</button>
                            <button onClick={() => {
                                onUpdateTask({ ...task, is_complete: false });
                            }}>タスクを未完了</button>
                            <button onClick={() => {
                                onUpdateTask({ ...task, current_set: task.current_set + 1 });
                            }}>タスクを進める</button>
                            <button onClick={() => {
                                onUpdateTask({ ...task, current_set: task.current_set - 1 });
                            }}>タスクを戻す</button>
                            <button onClick={() => {
                                onUpdateTask({ ...task, task_name: '更新されたタスク' });
                            }}>タスクの名前を更新</button>
                            <button onClick={() => {
                                onStartTask(task.id);
                            }}>このタスクを開始</button>
                        </div>
                    );
                })}
            </ul>
        </div>
    );
}

// NextAuthProviderで囲むと、useSessionを利用できる
// useSessionにより、ログインしているユーザーの情報を取得できる
const CRUDApiWrapperTest = () => {
    return (
        <NextAuthProvider>
            <CRUDApiWrapperTestComponent />
        </NextAuthProvider>
    );
}

export default CRUDApiWrapperTest;
