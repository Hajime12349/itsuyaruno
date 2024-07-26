import { Generated, ColumnType, Selectable, Insertable, Updateable } from 'kysely'
import { createKysely } from '@vercel/postgres-kysely'

export interface TagTable {
    tag_name: string
}

export type Tag = Selectable<TagTable>
export type NewTag = Insertable<TagTable>
export type TagUpdate = Updateable<TagTable>

export interface TaskTable {
    id: Generated<number>
    user_id: string
    task_name: string
    deadline?: string
    total_set: number
    current_set: number
    is_complete: boolean
}

export type Task = Selectable<TaskTable>
export type NewTask = Insertable<TaskTable>
export type TaskUpdate = Updateable<TaskTable>

export interface TaskTagsTable {
    task_id: number
    tag_name: string
}

export type TaskTags = Selectable<TaskTagsTable>
export type NewTaskTags = Insertable<TaskTagsTable>
export type TaskTagsUpdate = Updateable<TaskTagsTable>

export interface UserTable {
    id: string
    display_name?: string
    icon_path?: string
    current_task?: number
    current_task_time?: string
}

export type User = Selectable<UserTable>
export type NewUser = Insertable<UserTable>
export type UserUpdate = Updateable<UserTable>

export interface Database {
    tags: TagTable
    tasks: TaskTable
    users: UserTable
    task_tags: TaskTagsTable
}

export const db = createKysely<Database>()
export { sql } from 'kysely'