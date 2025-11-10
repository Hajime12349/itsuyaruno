import type { TagDTO as Tag } from "@/interfaces/http/tags/mappers";
import type { TaskDTO as Task } from "@/interfaces/http/tasks/mappers";
import type { IUserDataModel } from "@/application/users/UserDataModelMapper";

type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type TaskCreatePayload = OptionalKeys<Task, "id" | "user_id">;
export type TaskUpdatePayload = OptionalKeys<Task, "user_id">;
export type UserUpsertPayload = OptionalKeys<IUserDataModel, "id">;

/**
 * タスクの一覧を取得します。
 * @returns タスクの配列をPromiseとして返します。
 */
export async function getTasks(): Promise<Task[]> {
  try {
    const response = await fetch("/api/tasks");

    if (!response.ok) {
      console.error(
        "Failed to fetch tasks:",
        response.status,
        response.statusText
      );
      return [];
    }

    const data = await response.json();

    // エラーレスポンスの場合は空配列を返す
    if (data.error) {
      console.error("API error:", data.error);
      return [];
    }

    // 配列でない場合は空配列を返す
    if (!Array.isArray(data)) {
      console.error("Expected array but got:", typeof data, data);
      return [];
    }

    return data as Task[];
  } catch (error) {
    console.error("Error fetching tasks:", error);
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
  return (await response.json()) as Promise<Task>;
}

/**
 * 新しいタスクを作成します。
 * @param task 作成するタスク
 * @returns 作成されたタスクをPromiseとして返します。
 */
export async function createTask(task: TaskCreatePayload): Promise<Task> {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Create failed: ${response.status} ${text}`);
  }
  return (await response.json()) as Promise<Task>;
}

/**
 * タスクを更新します。
 * @param task 更新するタスク
 * @returns 更新されたタスクをPromiseとして返します。
 */
export async function updateTask(task: TaskUpdatePayload): Promise<Task> {
  const response = await fetch(`/api/tasks/${task.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Update failed: ${response.status} ${text}`);
  }
  return (await response.json()) as Promise<Task>;
}

/**
 * タスクを削除します。
 * @param taskId 削除するタスクのID
 */
export async function deleteTask(taskId: number): Promise<void> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Delete failed: ${response.status} ${text}`);
  }
}

/**
 * ユーザー情報を取得します。
 * @returns ユーザーをPromiseとして返します。
 */
export async function getUser(): Promise<IUserDataModel> {
  const response = await fetch("/api/users");
  return (await response.json()) as Promise<IUserDataModel>;
}

/**
 * ユーザーを登録します。
 * @param user 登録するユーザー
 * @returns 登録されたユーザーをPromiseとして返します。
 */
export async function registerUser(user: UserUpsertPayload): Promise<IUserDataModel> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Register failed: ${response.status} ${text}`);
  }
  return (await response.json()) as Promise<IUserDataModel>;
}

/**
 * ユーザー情報を更新します。
 * @param user 更新するユーザー
 * @returns 更新されたユーザーをPromiseとして返します。
 */
export async function updateUser(user: UserUpsertPayload): Promise<IUserDataModel> {
  if (!user.id) {
    const response = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Update failed: ${response.status} ${text}`);
    }
    return (await response.json()) as Promise<IUserDataModel>;
  }

  const response = await fetch(`/api/users/${user.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Update failed: ${response.status} ${text}`);
  }
  return (await response.json()) as Promise<IUserDataModel>;
}

/**
 * ユーザーを削除します。
 * @param userId 削除するユーザーのID
 */
export async function deleteUser(userId: string): Promise<void> {
  const response = await fetch(`/api/users/${userId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Delete failed: ${response.status} ${text}`);
  }
}

/**
 * タグの一覧を取得します。
 * @returns タグの配列をPromiseとして返します。
 */
export async function getTags(): Promise<Tag[]> {
  const response = await fetch("/api/tags");
  return (await response.json()) as Promise<Tag[]>;
}

/**
 * 新しいタグを作成します。
 * @param tag 作成するタグ
 * @returns 作成されたタグをPromiseとして返します。
 */
export async function createTag(tag: Tag): Promise<Tag> {
  const response = await fetch("/api/tags", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tag),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Create failed: ${response.status} ${text}`);
  }
  return (await response.json()) as Promise<Tag>;
}

/**
 * タグを更新します。
 * @param tag 更新対象のタグ
 * @param newTag 更新後のタグ
 * @returns 更新されたタグをPromiseとして返します。
 */
export async function updateTag(targetTag: Tag, newTag: Tag): Promise<Tag> {
  const response = await fetch(`/api/tags/${targetTag.tag_name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ new_tag_name: newTag.tag_name }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Update failed: ${response.status} ${text}`);
  }
  return (await response.json()) as Promise<Tag>;
}

/**
 * タグを削除します。
 * @param tagName 削除するタグの名前
 */
export async function deleteTag(tagName: string): Promise<void> {
  const response = await fetch(`/api/tags/${tagName}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Delete failed: ${response.status} ${text}`);
  }
}
