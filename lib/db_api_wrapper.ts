import type { Task, User, Tag } from '@/lib/entity';

/**
 * タスクの一覧を取得します。
 * @returns タスクの配列をPromiseとして返します。
 */
export async function getTasks(): Promise<Task[]> {
    try {
        const response = await fetch('/api/tasks');

        if (!response.ok) {
            console.error('Failed to fetch tasks:', response.status, response.statusText);
            return [];
        }

        const data = await response.json();

        // エラーレスポンスの場合は空配列を返す
        if (data.error) {
            console.error('API error:', data.error);
            return [];
        }

        // 配列でない場合は空配列を返す
        if (!Array.isArray(data)) {
            console.error('Expected array but got:', typeof data, data);
            return [];
        }

        return data as Task[];
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}

/**
 * 指定のタスクを取得します。
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
    if (!user.id) {
        const response = await fetch('/api/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        return await response.json() as Promise<User>;
    }

    const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });
    return await response.json() as Promise<User>;
}

/**
 * ユーザーを削除します。
 * @param userId 削除するユーザーのID
 */
export async function deleteUser(userId: string): Promise<void> {
    await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
    });
}

/**
 * タグの一覧を取得します。
 * @returns タグの配列をPromiseとして返します。
 */
export async function getTags(): Promise<Tag[]> {
    const response = await fetch('/api/tags');
    return await response.json() as Promise<Tag[]>;
}

/**
 * 新しいタグを作成します。
 * @param tag 作成するタグ
 * @returns 作成されたタグをPromiseとして返します。
 */
export async function createTag(tag: Tag): Promise<Tag> {
    const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tag),
    });
    return await response.json() as Promise<Tag>;
}

/**
 * タグを更新します。
 * @param tag 更新対象のタグ
 * @param newTag 更新後のタグ
 * @returns 更新されたタグをPromiseとして返します。
 */
export async function updateTag(targetTag: Tag, newTag: Tag): Promise<Tag> {
    const response = await fetch(`/api/tags/${targetTag.tag_name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_tag_name: newTag.tag_name }),
    });
    return await response.json() as Promise<Tag>;
}

/**
 * タグを削除します。
 * @param tagName 削除するタグの名前
 */
export async function deleteTag(tagName: string): Promise<void> {
    await fetch(`/api/tags/${tagName}`, {
        method: 'DELETE',
    });
}