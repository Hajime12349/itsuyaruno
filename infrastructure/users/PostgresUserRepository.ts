import { sql } from '@vercel/postgres';
import { query } from '@/lib/db';
import { UserEntity } from '../../domain/users/User';
import type { UserRepository } from '../../domain/users/UserRepository';

function mapRowToEntity(row: any): UserEntity {
    return UserEntity.create({
        id: row.id,
        displayName: row.display_name ?? undefined,
        iconPath: row.icon_path ?? undefined,
        currentTask: row.current_task ?? undefined,
        currentTaskTime: row.current_task_time ?? undefined,
    });
}

export class PostgresUserRepository implements UserRepository {
    async findById(id: string): Promise<UserEntity | null> {
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`SELECT * FROM users WHERE id = ${id}`;
            return rows[0] ? mapRowToEntity(rows[0]) : null;
        }
        const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
        return rows[0] ? mapRowToEntity(rows[0]) : null;
    }

    async create(user: UserEntity): Promise<UserEntity> {
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`INSERT INTO users (id, display_name, icon_path, current_task, current_task_time) VALUES (${user.id}, ${user.displayName}, ${user.iconPath}, ${user.currentTask}, ${user.currentTaskTime}) RETURNING *`;
            return mapRowToEntity(rows[0]);
        }
        const { rows } = await query('INSERT INTO users (id, display_name, icon_path, current_task, current_task_time) VALUES ($1, $2, $3, $4, $5) RETURNING *', [user.id, user.displayName, user.iconPath, user.currentTask, user.currentTaskTime]);
        return mapRowToEntity(rows[0]);
    }

    async update(user: UserEntity): Promise<UserEntity> {
        if (process.env.NODE_ENV === 'production') {
            const { rows } = await sql`UPDATE users SET display_name = ${user.displayName}, icon_path = ${user.iconPath}, current_task = ${user.currentTask}, current_task_time = ${user.currentTaskTime} WHERE id = ${user.id} RETURNING *`;
            return mapRowToEntity(rows[0]);
        }
        const { rows } = await query('UPDATE users SET display_name = $1, icon_path = $2, current_task = $3, current_task_time = $4 WHERE id = $5 RETURNING *', [user.displayName, user.iconPath, user.currentTask, user.currentTaskTime, user.id]);
        return mapRowToEntity(rows[0]);
    }

    async delete(id: string): Promise<void> {
        if (process.env.NODE_ENV === 'production') {
            await sql`DELETE FROM users WHERE id = ${id}`;
            return;
        }
        await query('DELETE FROM users WHERE id = $1', [id]);
    }
}


