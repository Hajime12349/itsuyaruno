export type Task = {
    id?: number;
    user_id?: string;
    task_name: string;
    deadline: string;
    total_set: number;
    current_set: number;
    is_complete: boolean;
}

export type User = {
    id?: string;
    display_name?: string;
    icon_path?: string;
    current_task?: number;
    current_task_time?: string;
}