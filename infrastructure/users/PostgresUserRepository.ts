import { sql } from '@vercel/postgres';
import { query } from '@/lib/db';
import { AppError, NotFoundError } from '@/shared/errors/AppError';
import { UserEntity } from '../../domain/users/User';
import type { UserRepository } from '../../domain/users/UserRepository';
import { UserId } from '../../domain/users/valueObjects/UserId';
import { DisplayName } from '../../domain/users/valueObjects/DisplayName';
import { IconPath } from '../../domain/users/valueObjects/IconPath';
import { CurrentTaskId } from '../../domain/users/valueObjects/CurrentTaskId';
import { CurrentTaskTime } from '../../domain/users/valueObjects/CurrentTaskTime';
import { userEntityToPlain } from '../../domain/users/mappers';

function mapRowToEntity(row: any): UserEntity {
    const currentTaskValue = row.current_task;
    const parsedCurrentTask = typeof currentTaskValue === 'number'
        ? currentTaskValue
        : currentTaskValue !== null && currentTaskValue !== undefined
            ? Number(currentTaskValue)
            : undefined;

    const normalizeOptionalText = (value: unknown): string | undefined => {
        if (typeof value !== 'string') {
            return undefined;
        }
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    };

    const normalizeTimestamp = (value: unknown): string | undefined => {
        if (value instanceof Date) {
            return value.toISOString();
        }
        if (typeof value === 'string') {
            const trimmed = value.trim();
            return trimmed.length > 0 ? trimmed : undefined;
        }
        return undefined;
    };

    const idValue = typeof row.id === 'string'
        ? row.id
        : row.id !== null && row.id !== undefined
            ? String(row.id)
            : undefined;
    if (idValue === undefined) {
        throw new AppError('InternalError', 'User row is missing id');
    }

    const displayNameValue = normalizeOptionalText(row.display_name);
    const iconPathValue = normalizeOptionalText(row.icon_path);
    const currentTaskValueOrUndefined = Number.isFinite(parsedCurrentTask)
        ? parsedCurrentTask as number
        : undefined;
    const currentTaskTimeValue = normalizeTimestamp(row.current_task_time);

    return UserEntity.create({
        id: UserId.create(idValue),
        displayName: displayNameValue !== undefined
            ? DisplayName.create(displayNameValue)
            : undefined,
        iconPath: iconPathValue !== undefined
            ? IconPath.create(iconPathValue)
            : undefined,
        currentTask: currentTaskValueOrUndefined !== undefined
            ? CurrentTaskId.create(currentTaskValueOrUndefined)
            : undefined,
        currentTaskTime: currentTaskTimeValue !== undefined
            ? CurrentTaskTime.create(currentTaskTimeValue)
            : undefined,
    });
}

function ensureRow<T>(result: { rows: T[]; rowCount?: number | null }, notFoundMessage: string): T {
    const row = result.rows[0];
    if (!row || result.rowCount === 0) {
        throw new NotFoundError(notFoundMessage);
    }
    return row;
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
        const persistence = userEntityToPlain(user);
        if (process.env.NODE_ENV === 'production') {
            const result = await sql`INSERT INTO users (id, display_name, icon_path, current_task, current_task_time) VALUES (${persistence.id}, ${persistence.displayName}, ${persistence.iconPath}, ${persistence.currentTask}, ${persistence.currentTaskTime}) RETURNING *`;
            return mapRowToEntity(ensureRow(result, 'User not found'));
        }
        const result = await query('INSERT INTO users (id, display_name, icon_path, current_task, current_task_time) VALUES ($1, $2, $3, $4, $5) RETURNING *', [persistence.id, persistence.displayName, persistence.iconPath, persistence.currentTask, persistence.currentTaskTime]);
        return mapRowToEntity(ensureRow(result, 'User not found'));
    }

    async update(user: UserEntity): Promise<UserEntity> {
        const persistence = userEntityToPlain(user);
        if (process.env.NODE_ENV === 'production') {
            const result = await sql`UPDATE users SET display_name = ${persistence.displayName}, icon_path = ${persistence.iconPath}, current_task = ${persistence.currentTask}, current_task_time = ${persistence.currentTaskTime} WHERE id = ${persistence.id} RETURNING *`;
            return mapRowToEntity(ensureRow(result, 'User not found'));
        }
        const result = await query('UPDATE users SET display_name = $1, icon_path = $2, current_task = $3, current_task_time = $4 WHERE id = $5 RETURNING *', [persistence.displayName, persistence.iconPath, persistence.currentTask, persistence.currentTaskTime, persistence.id]);
        return mapRowToEntity(ensureRow(result, 'User not found'));
    }

    async delete(id: string): Promise<void> {
        if (process.env.NODE_ENV === 'production') {
            const result = await sql`DELETE FROM users WHERE id = ${id}`;
            if ((result.rowCount ?? 0) === 0) {
                throw new NotFoundError('User not found');
            }
            return;
        }
        const result = await query('DELETE FROM users WHERE id = $1', [id]);
        if ((result.rowCount ?? 0) === 0) {
            throw new NotFoundError('User not found');
        }
    }
}
