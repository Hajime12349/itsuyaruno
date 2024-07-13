import type { Task, User } from '@/lib/entity';

/**
 * タスクの一覧を取得します。
 * @returns タスクの配列をPromiseとして返します。
 */
export async function getTasks(): Promise<Task[]> {
    const response = await fetch('/api/tasks');
    return await response.json() as Promise<Task[]>;
}

/**
 * 特定のタスクを取得します。
 * @param taskId タスクのID
 * @returns タスクをPromiseとして返します。
 */
export async function getTask(taskId: number): Promise<Task> {
    const response = await fetch(`/api/tasks/${taskId}`);
    return await response.json() as Promise<Task>;
}

/**
 * 新しいタスクを作成します。
 * @param task 作成するタスク
 * @returns 作成されたタスクをPromiseとして返します。
 */
export async function createTask(task: Task): Promise<Task> {
    const response = await fetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(task),
    });
    return await response.json() as Promise<Task>;
}

/**
 * タスクを更新します。
 * @param task 更新するタスク
 * @returns 更新されたタスクをPromiseとして返します。
 */
export async function updateTask(task: Task): Promise<Task> {
    const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        body: JSON.stringify(task),
    });
    return await response.json() as Promise<Task>;
}

/**
 * タスクを削除します。
 * @param taskId 削除するタスクのID
 */
export async function deleteTask(taskId: number): Promise<void> {
    await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
    });
}

/**
 * ユーザー情報を取得します。
 * @returns ユーザーをPromiseとして返します。
 */
export async function getUser(): Promise<User> {
    const response = await fetch('/api/users');
    return await response.json() as Promise<User>;
}

/**
 * ユーザーを登録します。
 * @param user 登録するユーザー
 * @returns 登録されたユーザーをPromiseとして返します。
 */
export async function registerUser(user: User): Promise<User> {
    const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(user),
    });
    return await response.json() as Promise<User>;
}

/**
 * ユーザー情報を更新します。
 * @param user 更新するユーザー
 * @returns 更新されたユーザーをPromiseとして返します。
 */
export async function updateUser(user: User): Promise<User> {
    if (!(user.id)) {
        const response = await fetch('/api/users', {
            method: 'PUT',
            body: JSON.stringify(user),
        });
        return await response.json() as Promise<User>;
    }

    const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(user),
    });
    return await response.json() as Promise<User>;
}

/**
 * ユーザーを削除します。
 * @param userId 削除するユーザーのID
 */
export async function deleteUser(userId: number): Promise<void> {
    await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
    });
}
