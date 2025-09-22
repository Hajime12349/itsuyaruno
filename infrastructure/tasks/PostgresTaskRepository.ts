import { sql } from '@vercel/postgres';
import { query } from '@/lib/db';
import { TaskEntity, type TaskId } from '../../domain/tasks/Task';
import type { TaskRepository } from '../../domain/tasks/TaskRepository';

function mapRowToEntity(row: any): TaskEntity {
    return TaskEntity.create({
        id: row.id,
        userId: row.user_id,
        name: row.task_name,
        deadline: row.deadline ?? undefined,
        totalSet: row.total_set,
        currentSet: row.current_set,
        isComplete: row.is_complete,
    });
}

export class PostgresTaskRepository implements TaskRepository {
    async findAllByUser(userId: string, includeComplete: boolean): Promise<TaskEntity[]> {
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`SELECT * FROM tasks WHERE user_id = ${userId} ${includeComplete ? sql`` : sql`AND is_complete = false`} ORDER BY id ASC`;
            return rows.map(mapRowToEntity);
        }
        const { rows } = await query('SELECT * FROM tasks WHERE user_id = $1 ' + (includeComplete ? '' : 'AND is_complete = false ') + 'ORDER BY id ASC', [userId]);
        return rows.map(mapRowToEntity);
    }

    async findByIdForUser(id: TaskId, userId: string): Promise<TaskEntity | null> {
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`SELECT * FROM tasks WHERE id = ${id} AND user_id = ${userId}`;
            return rows[0] ? mapRowToEntity(rows[0]) : null;
        }
        const { rows } = await query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
        return rows[0] ? mapRowToEntity(rows[0]) : null;
    }

    async create(task: TaskEntity): Promise<TaskEntity> {
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`INSERT INTO tasks (user_id, task_name, deadline, total_set, current_set, is_complete) VALUES(${task.userId}, ${task.name}, ${task.deadline}, ${task.totalSet}, ${task.currentSet}, ${task.isComplete}) RETURNING *`;
            return mapRowToEntity(rows[0]);
        }
        const { rows } = await query('INSERT INTO tasks (user_id, task_name, deadline, total_set, current_set, is_complete) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [task.userId, task.name, task.deadline, task.totalSet, task.currentSet, task.isComplete]);
        return mapRowToEntity(rows[0]);
    }

    async update(task: TaskEntity): Promise<TaskEntity> {
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`UPDATE tasks SET task_name = ${task.name}, deadline = ${task.deadline}, total_set = ${task.totalSet}, current_set = ${task.currentSet}, is_complete = ${task.isComplete} WHERE id = ${task.id} AND user_id = ${task.userId} RETURNING *`;
            return mapRowToEntity(rows[0]);
        }
        const { rows } = await query('UPDATE tasks SET task_name = $1, deadline = $2, total_set = $3, current_set = $4, is_complete = $5 WHERE id = $6 AND user_id = $7 RETURNING *', [task.name, task.deadline, task.totalSet, task.currentSet, task.isComplete, task.id, task.userId]);
        return mapRowToEntity(rows[0]);
    }

    async delete(id: TaskId, userId: string): Promise<void> {
        if (process.env.NODE_ENV === 'production') {
            await sql`DELETE FROM tasks WHERE id = ${id} AND user_id = ${userId}`;
            return;
        }
        await query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
    }
}


